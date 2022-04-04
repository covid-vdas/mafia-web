<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));

        const response_role = await fetch(API_URL+"role/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        const role = response_role.ok && (await response_role.json());

        return{
            props: {
                token: token_value,
                role: role,
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { goto } from '$app/navigation';

    export let role;
    export let token;
    
    const handleSubmit = () => {
        toast.push("Create User Successful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
    }
    
    let processing = false;
    let confirm_pass = "";
    let user = {
        username: "",
        password: "",
        fullname: "",
        email: "",
        phone: "",
        birthdate: "",
        role_id: {
            id: ""
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-5/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    Create New User
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-username">
                        Username
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-username" bind:value={user.username} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-password">
                        Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-password" bind:value={user.password} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-confirm-pass">
                        Confirm Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-confirm-pass" bind:value={confirm_pass} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-fullname">
                        Full Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-fullname" bind:value={user.fullname} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-email">
                        Email
                    </label>
                    <input type="email" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-email" bind:value={user.email} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-phone">
                        Phone
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-phone" bind:value={user.phone}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-birthdate">
                        birthdate
                    </label>
                    <input type="date" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-birthdate" bind:value={user.birthdate} on:keydown={(e) => {
                        e.preventDefault();
                    }} required />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-role">
                        Role
                    </label>
                    <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" bind:value={user.role_id.id} >
                        {#each role as r}
                            <option value={r.id} selected>
                                {capitalizeFirstLetter(r.name)}
                            </option>
                        {/each}
                    </select>

                    
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
                
                </form>
            </div>
        </div>
    </div>
</section>