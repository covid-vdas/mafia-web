<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../stores.js";
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({}){
        let token_value;
        let login_user;
        token.subscribe((t) => (token_value = t));
        user.subscribe((t) => (login_user = t));

        return{
            props: {
                token: token_value,
                login_user: login_user,
            }
        };
    }
</script>

<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { goto, invalidate } from '$app/navigation';

    export let token;
    export let login_user;
    let confirm_pass;
    let confirm_pass_valid = true;
    let pass_valid = true;
    let user = {
        password: "",
        old_password:""
    };
    $: pass_message = "";
    let old_pass_valid = true;
    $: old_pass_message = "";

    let processing = false;
    if(login_user){
        login_user = JSON.parse(login_user);
    }

    async function reloadData(){
        await invalidate(API_URL+"user/");
    }


    const handleSubmit = async () =>{ 
        processing = true;

        pass_valid = true;

        const isWhitespace = /^(?=.*\s)/;
        if (isWhitespace.test(user.password)) {
            pass_message = "Password must not contain Whitespaces";
            pass_valid = false;
        }
        
    
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long";
            pass_valid = false;
        }
    
    
        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long";
            pass_valid = false;
        }
    
    
        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long";
            pass_valid = false;
        }
    
    
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long";
            pass_valid = false;
        }

        const isValidLength = /^.{8,30}$/;
        if (!isValidLength.test(user.password)) {
            pass_message = "Password must contain at least one Digit, one Uppercase, one Lowercase, one Special Symbol and 8 Characters Long";
            pass_valid = false;
        }


        if(user.password === confirm_pass){
            confirm_pass_valid = true;
        }else {
            confirm_pass_valid = false;
        }

        if(pass_valid & confirm_pass_valid){
            const login_response = await fetch(API_URL+"login/",{
            method : "POST",
            headers : {
                "Content-type": "application/json",
            },
            body : JSON.stringify({
                'username' : login_user.username,
                'password' : user.old_password
                }
            ),
            }).then(
                response => {
                    if(response.status == 200){
                        old_pass_valid = true;
                    }else{
                        old_pass_valid = false;
                        old_pass_message = "Your old password is incorrect";
                    }
                }).catch (error =>{
                    error_status=true;
                    console.log(error);
                });

                if(old_pass_valid){
                    const response = await fetch(API_URL+"user/"+login_user.id+"/",{
                method : "PATCH",
                headers : {
                    "Content-type": "application/json",
                    "Authorization": "Bearer "+ token,
                },
                body : JSON.stringify({
                    'password' : user.password,
                }),
            }).then(
                response => {
                    processing = false;
                    if(response.status == 200 || response.status == 201){
                        reloadData();
                        toast.push("Changed User Password Successfully", {
                            theme: {
                                '--toastBackground':'white',
                                '--toastBarBackground': 'green',
                                '--toastColor': 'black',
                                '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            }
                        });
                        goto("/")
                    }else{
                        console.log(response);
                        toast.push("An error occurred while changing user password", {
                            theme: {
                                '--toastBackground':'white',
                                '--toastBarBackground': 'red',
                                '--toastColor': 'black',
                                '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                
                            }
                        });
                    }
                }).catch (error =>{
                    toast.push("An error occurred while changing user password", {
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
            
        }
        processing = false;
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-5/12 px-4">
            <div class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    <a sveltekit:prefetch href={`/user/profile`} class="mr-3"><i class="fa-solid fa-angle-left"></i></a>Change Personal Password
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="edit-old-password">
                        Old Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!old_pass_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="edit-old-password" bind:value={user.old_password} />
                    {#if !old_pass_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{old_pass_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="edit-password">
                        Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!pass_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="edit-password" bind:value={user.password} />
                    {#if !pass_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{pass_message}</p>
                    {/if}
    
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="edit-confirm-pass">
                        Confirm Password
                    </label>
                    <input type="password" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!confirm_pass_valid?'border-1 border-rose-500 focus:border-rose-600':''}
                    " id="edit-confirm-pass" bind:value={confirm_pass} />
                    {#if !confirm_pass_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">Your Password and Confirm Password not matched</p>
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