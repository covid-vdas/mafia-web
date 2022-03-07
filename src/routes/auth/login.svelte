<script>
    import {API_URL} from "utils/constant.svelte";
    import { goto } from '$app/navigation';
    import { user, token } from "../../stores";

    let username = "";
    let password = "";
    let error_status = false;
    let processing = false;



    const handleLogin = async () => {
        let data = {
        'username' : username,
        'password' : password,
        };
        console.log(API_URL+"login");
        processing = true;
        console.log(data);
        const response = await fetch(API_URL+"login/",{
            method : "POST",
            headers : {
                "Content-type": "application/json",
            },
            body : JSON.stringify(data),
        }).then(
            response => {
                processing = false;
                if(response.status == 200){
                    error_status = false;
                    return response.json();
                }else{
                    console.log(response)
                    error_status = true;
                }
            }).then(responseData =>{
                if(responseData){
                    user.update((u) => u = JSON.stringify(responseData.data));
                    token.update((t) => t = responseData.token);
                    goto("/");
                } else {

                }
            }).catch (error =>{
                error_status=true;
                console.log(error);
                processing = false;
            });
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen bg-gradient-to-tr from-sky-900 to-blue-400">
    <div class="">
        <div class="container mx-auto px-4 h-full">
            <div class="flex content-center items-center justify-center h-full">
                <div class="w-full lg:w-6/12 px-4">
                    <div
                        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                        <div class="flex flex-row">
                            <div class="basis-5/12 bg-[url('static/login-image.png')] bg-no-repeat hover:bg-center hover:bg-contain">

                            </div>
                            <div class="rounded-t mb-0 px-6 py-6 basis-7/12">
                                <div class="text-zinc-700 text-3xl text-center mb-3 font-bold">
                                    <small>Welcome to VDAS</small>
                                </div>
                                <form on:submit|preventDefault="{handleLogin}" method="post">
                                    <div class="relative w-full mb-3">
                                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2"
                                            for="login-username">
                                            Username
                                        </label>
                                        <input id="login-username" type="text"
                                            class=" px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  focus:ring w-full ease-linear transition-all duration-150 focus:outline-none
                                            {error_status?'border-1 border-rose-500 focus:border-rose-600':'border-0 text-zinc-600 '}"
                                            placeholder="Username" bind:value="{username}" />
                                    </div>
                                    <div class="relative w-full mb-3">
                                        <label class="block uppercase text-zinc-600 text-xs font-bold mb-2"
                                            for="login-password">
                                            Password
                                        </label>
                                        <input id="login-password" type="password"
                                            class=" px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  focus:ring w-full ease-linear transition-all duration-150 focus:outline-none
                                            {error_status?'border-1 border-rose-500 focus:border-rose-600':'border-0 text-zinc-600 '}"
                                            placeholder="Password" bind:value="{password}" />
                                            {#if error_status}
                                            <p class="text-rose-600 text-center mt-3 font-semibold">Your Credentials is invalid. Please try again.</p>
                                            {/if}
                                    </div>
                                    <div class="text-center mt-6">
                                        {#if processing}
                                        <button
                                            class="text-white bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit"
                                            disabled>
                                            <icon class="fa-solid fa-spinner fa-spin-pulse fa-xl mr-1"></icon>
                                            Processing..
                                        </button>
                                        {:else}
                                        <button
                                            class="text-white bg-blue-700 active:bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit">
                                            Sign In
                                        </button>
                                        {/if}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
