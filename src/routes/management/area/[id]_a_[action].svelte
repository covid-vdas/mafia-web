<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        let login_user;
        let managers;
        token.subscribe((t) => (token_value = t));
        user.subscribe((t) => (login_user = t));
        const response = await fetch(API_URL+"area/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        
        const response_user = await fetch(API_URL+"user/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const users = response_user.ok && (await response_user.json());

        if(login_user.includes("admin")){
            const response_manager = await fetch(API_URL+"user/getAllManager/",{
                method : "GET",
                headers : {
                    "Content-type": "application/json",
                    "Authorization": "Bearer "+ token_value,
                }
            });

            managers = response_manager.ok && (await response_manager.json());
        }

        const edit = params.action == "e"? true : false;
        const data = response.ok && (await response.json());

        return{
            props: {
                token: token_value,
                edit: edit,
                data: data,
                managers: managers,
                login_user: login_user,
                users: users,   
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { goto } from '$app/navigation';

    export let edit;
    export let token;
    export let data;
    export let login_user;
    export let managers;
    export let users;
    export let managed_users;
    let processing = false;
    let color = "bg-slate-100";
    $: manager_id = data.managed_manager;
    login_user = JSON.parse(login_user);

    managed_users =  users.filter(user =>{
                                return user.managed_by == data.managed_manager;
                     });

    console.log(managed_users);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleSubmit = async () =>{
        processing = true;
        const response = await fetch(API_URL+"area/"+data.id+"/",{
            method : "PATCH",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token,
            },
            body : JSON.stringify({
                'name' : data.name,
                'managed_manager': data.managed_manager,
                'managed_staff': data.managed_staff,
            }),
        }).then(
            response => {
                processing = false;
                if(response.status == 200 || response.status == 201){
                    toast.push("Update Area Successful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
                    goto("/management/area/list")
                }else{
                    console.log(response);
                    toast.push("Update Area Unsuccessful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            
                        }
                    });
                }
            }).catch (error =>{
                toast.push("Update Area Unsuccessful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
                console.log(error);
                processing = false;
            });
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-5/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    {#if edit}Edit{/if} Area Information
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={data.name} disabled={!edit}/>
                    
                    {#if login_user.role_id.name == "admin"} 
                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                            Managed By Manager
                        </label>
                        <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                        transition-all duration-150 focus:outline-none" bind:value={data.managed_manager} disabled={!edit} required on:change={()=>{
                            manager_id = data.managed_manager;
                            managed_users = users.filter(user =>{
                                return user.managed_by == manager_id;
                            });
                            data.managed_staff = "";
                        }}>
                            {#each managers as m}
                                <option value={m.id} selected>
                                    {capitalizeFirstLetter(m.fullname)}
                                </option>
                            {/each}
                            </select>
                    {/if}


                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                        Managed By Staff
                    </label>
                    <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" bind:value={data.managed_staff} disabled={!edit || managed_users.length === 0} required>
                        {#if managed_users.length === 0}
                             <option value="" disabled selected>There is no staff under manager management</option>
                        {/if}
                        {#each managed_users as m}
                            <option value={m.id} selected>
                                {capitalizeFirstLetter(m.fullname)}
                            </option>
                        {/each}
                        </select>

                    {#if edit}
                        {#if processing}
                            <button
                                class="text-white bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit" disabled>
                                <icon class="fa-solid fa-spinner fa-spin-pulse fa-xl mr-1"></icon>
                                Processing..
                            </button>
                        {:else}
                            <button
                                class="text-white bg-blue-700 active:bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit">
                                Submit
                            </button>
                        {/if}
                    {/if}
                </form>
            </div>
        </div>
    </div>
</section>

