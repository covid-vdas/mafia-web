<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        let login_user;
        let managers;
        let is_admin = false;
        user.subscribe((t) => (login_user = t));
        token.subscribe((t) => (token_value = t));

        const response_role = await fetch(API_URL+"role/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        if(login_user.includes("admin")){
            const response_manager = await fetch(API_URL+"user/getAllManager/",{
                method : "GET",
                headers : {
                    "Content-type": "application/json",
                    "Authorization": "Bearer "+ token_value,
                }
            });
            is_admin = true;
            managers = response_manager.ok && (await response_manager.json());
        }

        const role = response_role.ok && (await response_role.json());

        return{
            props: {
                token: token_value,
                role: role,
                login_user: login_user,
                managers: managers,
                is_admin: is_admin,
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { goto } from '$app/navigation';
    import SveltyPicker from 'svelty-picker';

    export let role;
    export let token;
    export let login_user;
    export let managers;
    export let is_admin;
    let username_valid = true;
    let phone_valid = true;
    let email_valid = true;
    let confirm_pass_valid = true;
    let pass_valid = true;
    let processing = false;
    let confirm_pass = "";
    let role_staff_index;
    let user = {
        username: "",
        password: "",
        fullname: "",
        email: "",
        phone: "",
        birthdate: "",
        role_id: {
            id: ""
        },
        managed_by:"",
    }
    $: picker_theme = 'picker_theme';
    $: pass_message = "";
    $: username_message = "";

    const handleSubmit = () => {
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

        pass_valid = true;
        username_valid = true;

        const isWhitespace = /^(?=.*\s)/;
        if (isWhitespace.test(user.password)) {
            pass_message = "Password must not contain Whitespaces.";
            pass_valid = false;
        }
        
    
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long.";
            pass_valid = false;
        }
    
    
        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long.";
            pass_valid = false;
        }
    
    
        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long.";
            pass_valid = false;
        }
    
    
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long.";
            pass_valid = false;
        }

        const isSymbol = /^.*[^a-zA-Z0-9_.]/;    
        if (isSymbol.test(user.username)) {
            username_message = "Username must have at least 6 to 30 characters and not contain Special Symbol except dots, and underscores";
            username_valid = false;
        }
    
        const isValidLength630 = /^.{6,30}$/;
        if (!isValidLength630.test(user.username)) {
            username_message = "Username must have at least 6 to 30 characters and not contain Special Symbol except dots, and underscores";
            username_valid = false;
        }


        const isValidLength = /^.{8,}$/;
        if (!isValidLength.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long.";
            pass_valid = false;
        }


        if(user.password === confirm_pass){
            confirm_pass_valid = true;
        }else {
            confirm_pass_valid = false;
        }

        console.log(user);
        toast.push("Create User Successful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });

        processing = false;
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    login_user = JSON.parse(login_user);
    if(is_admin){
        role_staff_index = role.findIndex(value => {
                return value.name == 'staff';  
        });
    }

</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-5/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    Create New {#if is_admin}User{:else}Staff{/if}
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-username">
                        Username
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!username_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="create-username" bind:value={user.username} />
                    {#if !username_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{username_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-password">
                        Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!pass_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="create-password" bind:value={user.password} />
                    {#if !pass_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{pass_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-confirm-pass">
                        Confirm Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!confirm_pass_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="create-confirm-pass" bind:value={confirm_pass} />
                    {#if !confirm_pass_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Password and Confirm Password not matched.</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-fullname">
                        Full Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="create-fullname" bind:value={user.fullname} />

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-email">
                        Email
                    </label>
                    <input type="email" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!email_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="create-email" bind:value={user.email}/>
                    {#if !email_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Email is invalid.</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-phone">
                        Phone
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!phone_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="create-phone" bind:value={user.phone}/>
                    {#if !phone_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Phone is invalid.</p>
                    {/if}


                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-birthdate">
                        birthdate
                    </label>
                    <SveltyPicker bind:value={user.birthdate} on:keydown={(e) => {e.preventDefault();}}
                        inputClasses="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear transition-all duration-150 focus:outline-none"
                        todayBtnClasses="text-white bg-blue-500 text-sm font-bold p-2 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        clearBtnClasses="text-rose-600 bg-white border-1 border-rose-500 text-sm font-bold p-2 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        theme={picker_theme} placeholder="dd/mm/yyyy" id="create-birthdate" required
                        format="dd/mm/yyyy"></SveltyPicker>

                    {#if is_admin}
                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-role">
                            Role
                        </label>
                        <select class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                        transition-all duration-150 focus:outline-none" bind:value={user.role_id.id} >
                            {#each role as r}
                                {#if r.name != 'admin'}
                                    <option value={r.id}>
                                        {capitalizeFirstLetter(r.name)}
                                    </option>
                                {/if} 
                            {/each}
                        </select>
                    {/if}
                    
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

<style>
    :global(.picker_theme) {
    --sdt-primary: rgb(59 130 246);
    --sdt-color: #000;
    --sdt-bg-main: #fff;
    --sdt-bg-today: var(--sdt-primary);
    --sdt-bg-clear: #dc3545;
    --sdt-today-bg: #1e486d;
    --sdt-clear-color: #dc3545;
    --sdt-btn-bg-hover: #eee;
    --sdt-btn-header-bg-hover: #dfdfdf;
    --sdt-clock-bg: #eeeded;
    --sdt-clock-bg-minute: rgb(238, 237, 237, 0.25);
    --sdt-clock-bg-shadow: 0 0 128px 2px #ddd inset;
    --sdt-shadow: #ccc;
  }
</style>
