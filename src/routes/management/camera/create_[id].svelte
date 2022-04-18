<script context="module">
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        return{
            props: {
                token: token_value,
                area_id: params.id,
            }
        };
    }
</script>

<script>
    import {API_URL} from "utils/constant.js";
    import { toast } from '@zerodevx/svelte-toast';
    import { goto } from '$app/navigation';
    export let token;
    export let area_id;
    let processing = false;
    let name_valid = true;
    let url_valid = true;
    let ratio_valid = true;
    let data = {
        name: "",
        url: "",
        ratio: "",
    }
    $: name_message = "";
    $: ratio_message = "";
    $: url_message = "";

    const handleSubmit = async () => {
        processing = true;

        ratio_valid = true;
        if(data.ratio <= 0){
            ratio_valid = false;
            ratio_message = "Ratio must be greater than zero";
        }

        
        const addressLength = /^.{2,}$/;

        name_valid = true;
        if (!addressLength.test(data.name)) {
            name_message = "Name must have at least 2 characters";
            name_valid = false;
        }

        url_valid = true;
        if (!addressLength.test(data.url)) {
            url_message = "URL must have at least 2 characters";
            url_valid = false;
        }

        if(name_valid && url_valid && ratio_valid){
            const response = await fetch(API_URL+"camera/",{
            method : "POST",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token,
            },
            body : JSON.stringify({
                'name' : data.name,
                'url' : data.url,
                'area_id' : area_id,
                'ratio' : data.ratio,
            }),
        }).then(
            response => {
                processing = false;
                if(response.status == 200 || response.status == 201){
                    toast.push("Added new camera successfully", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
                    goto("/management/camera/list_"+area_id)
                }else{
                    console.log(response);
                    toast.push("An error occurred while adding new camera", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            
                        }
                    });
                }
            }).catch (error =>{
                toast.push("An error occurred while adding new camera", {
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
                    <a sveltekit:prefetch href={"/management/camera/list_"+area_id} class="mr-3"><i class="fa-solid fa-angle-left"></i></a>Create New Camera 
                </div>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-cam-name">
                        Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!name_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="create-cam-name" bind:value={data.name}/>
                    {#if !name_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{name_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-cam-url">
                        URL
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!url_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="create-cam-url" bind:value={data.url}/>
                    {#if !url_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{url_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="create-cam-ratio">
                        Ratio
                    </label>
                    <input type="number" step="any" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!ratio_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="create-cam-ratio" bind:value={data.ratio} required/>
                    {#if !ratio_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{ratio_message}</p>
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