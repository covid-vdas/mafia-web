<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"camera/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        
        const edit = params.action == "e"? true : false;
        const data = response.ok && (await response.json());

        return{
            props: {
                token: token_value,
                edit: edit,
                data: data,
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
    let processing = false;
    let color = "bg-slate-100"


    const handleSubmit = async () =>{
        processing = true;
        const response = await fetch(API_URL+"camera/"+data.id+"/",{
            method : "PATCH",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token,
            },
            body : JSON.stringify({
                'name' : data.name,
                'url' : data.url,
            }),
        }).then(
            response => {
                processing = false;
                if(response.status == 200 || response.status == 201){
                    toast.push("Update Camera Successful", {
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
                    toast.push("Update Camera Unsuccessful", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            
                        }
                    });
                }
            }).catch (error =>{
                toast.push("Update Camera Unsuccessful", {
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
        <div class="w-full lg:w-10/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    {#if edit}Edit{/if} Camera Information
                </div>
                <img src={data.url} class="mb-4"/>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={data.name} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        URL
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={data.url} disabled={!edit}/>

                    <button
                        class="text-white bg-lime-600 active:bg-lime-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        on:click={() =>{
                            edit = edit ? false : true;
                        }} type="button">
                        Change Mode
                    </button>
                       
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

