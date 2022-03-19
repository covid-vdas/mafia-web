<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"user/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        
        const response_role = await fetch(API_URL+"role/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        const edit = params.action == "e"? true : false;
        const user = response.ok && (await response.json());
        const role = response_role.ok && (await response_role.json());

        return{
            props: {
                token: token_value,
                user: user,
                edit: edit,
                role: role,
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';

    export let edit;
    export let token;
    export let user;
    export let role;
    let processing = false;
    // user.birthdate = new Date(user.birthdate).toLocaleDateString();

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function reloadData(){
        await invalidate(API_URL+"user/");
    }


    const handleSubmit = async () =>{
        processing = true;
        const response = await fetch(API_URL+"user/"+user.id+"/",{
            method : "PATCH",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token,
            },
            body : JSON.stringify({
                'fullname' : user.fullname,
                'phone' : user.phone,
                'role_id' : user.role_id.id,
            }),
        }).then(
            response => {
                processing = false;
                if(response.status == 200 || response.status == 201){
                    reloadData();
                    toast.push("Update User Successful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
                }else{
                    console.log(response);
                    toast.push("Update User Unsuccessful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            
                        }
                    });
                }
            }).catch (error =>{
                toast.push("Update User Unsuccessful", {
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
                    {#if edit}Edit{/if} User Information
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Full Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={user.fullname} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-email">
                        Email
                    </label>
                    <input type="email" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-email" bind:value={user.email} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-phone">
                        Phone
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-phone" bind:value={user.phone} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-birthdate">
                        birthdate
                    </label>
                    <input type="date" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-birthdate" bind:value={user.birthdate} on:keydown={(e) => {
                        e.preventDefault();
                    }} disabled={!edit} required/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                        Role
                    </label>
                    <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" bind:value={user.role_id.id} disabled={!edit}>
                        {#each role as r}
                            <option value={r.id} selected>
                                {capitalizeFirstLetter(r.name)}
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

