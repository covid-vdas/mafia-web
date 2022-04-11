<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        let login_user;
        token.subscribe((t) => (token_value = t));
        user.subscribe((t) => (login_user = t));
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
        const user_data = response.ok && (await response.json());
        const role = response_role.ok && (await response_role.json());

        return{
            props: {
                token: token_value,
                user: user_data,
                edit: edit,
                role: role,
                login_user: login_user,
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { goto } from '$app/navigation';
    import moment from 'moment'

    export let edit;
    export let token;
    export let user;
    export let role;
    export let login_user;

    login_user = JSON.parse(login_user);

    let phone_valid = true;
    let email_valid = true;

    let role_staff_index = role.findIndex(value => {
            return value.name == 'staff';  
    });

    console.log(user)

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

        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user.email)){
            email_valid = true;
        } else{
            email_valid = false;
        }

        if (/^(0)[1-9]\d{8}$/.test(user.phone)){
            phone_valid = true;
        } else{
            phone_valid = false;
        }


        if(email_valid && phone_valid){
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
                'email' : user.email,
                'birthdate' : new Date(user.birthdate).toISOString().slice(0, 10),
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
                    goto("/management/user/list")
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
            });
        }
        processing = false;
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
                    transition-all duration-150 focus:outline-none
                    {!email_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="info-email" bind:value={user.email} disabled={!edit}/>
                    {#if !email_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Email is invalid.</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-phone">
                        Phone
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!phone_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="info-phone" bind:value={user.phone} disabled={!edit}/>
                    {#if !phone_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Phone is invalid.</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-birthdate">
                        birthdate
                    </label>
                    <input type="date" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-birthdate" data-date="18 December 1999" data-date-format="DD MMMM YYYY" on:change={(e) => {
                        console.log(moment(e.target.value, "YYYY-MM-DD").format(e.target.getAttribute("data-date-format")))
                    }} bind:value={user.birthdate} on:keydown={(e) => {
                        e.preventDefault();
                    }} disabled={!edit} required pattern=""/>

                    {#if login_user.role_id.name == "admin"}
                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                            Role
                        </label>
                        <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                        transition-all duration-150 focus:outline-none" bind:value={user.role_id.id} disabled={!edit}>
                            {#each role as r}
                                {#if r.name != 'admin'}
                                    <option value={r.id} selected>
                                        {capitalizeFirstLetter(r.name)}
                                    </option>
                                {/if}   
                            {/each}
                        </select>
                    {/if}
                    
                    {#if user.role_id.id == role[role_staff_index].id &&  login_user.role_id.name == "admin"}
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                        Managed By
                    </label>
                    <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" bind:value={user.managed_by} disabled={!edit} required>
                        {#each role as r}
                            <option value={r.id} selected>
                                {capitalizeFirstLetter(r.name)}
                            </option>
                        {/each}
                        </select>
                    {/if}
                    
                    {#if user.role_id.id == role[role_staff_index].id && login_user.role_id.name == "admin"}
                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                            Area
                        </label>
                        <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                        transition-all duration-150 focus:outline-none" bind:value={user.managed_by} disabled={!edit} required>
                            {#each role as r}
                                <option value={r.id} selected>
                                    {capitalizeFirstLetter(r.name)}
                                </option>
                            {/each}
                        </select>
                    {/if}
                    
                
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

