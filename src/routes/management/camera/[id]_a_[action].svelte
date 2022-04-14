<script context="module">
    import {API_URL, API_DETECT_URL} from "utils/constant.js";
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
    let name_valid = true;
    let url_valid = true;
    let ratio_valid = true;
    $: detect_class = "person";
    $: name_message = "";
    $: ratio_message = "";
    $: url_message = "";
    let processing = false;
    let color = "bg-slate-100"
    let data_url = encodeURIComponent(data.url);
    const handleSubmit = async () =>{
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
                    goto("/management/camera/list_"+data.area_id)
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
                
            });
        } 
        processing = false;
    }

    // const response_stream = fetch(API_DETECT_URL+`detector/?stream_url=${data_url}&ratio=1&obj_detect_type=mask&camera_id=${data.id}/`, {
    //     method : "GET",
    //     // body : JSON.stringify({
    //     //         stream_url : data.url,
    //     //         ratio : 1,
    //     //         object_detect_type : 'mask',
    //     //         camera_id : data.id,
    //     //     }
    //     // )
    // }).then(response => {
    //         console.log(response);
    //     });
    console.log();
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-10/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    {#if edit}Edit{/if} Camera Information
                </div>
                <img src={API_DETECT_URL+`detector/?stream_url=${data_url}&ratio=1&obj_detect_type=mask&camera_id=${data.id}`} alt="An IP Camera Stream" class="mb-4"/>
                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-cam-name">
                        Name
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!name_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="info-cam-name" bind:value={data.name} disabled={!edit}/>
                    {#if !name_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{name_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-cam-url">
                        URL
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!url_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="info-cam-url" bind:value={data.url} disabled={!edit}/>
                    {#if !url_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{url_message}</p>
                    {/if}

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-cam-ratio">
                        Ratio
                    </label>
                    <input type="number" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!ratio_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="info-cam-ratio" bind:value={data.ratio} disabled={!edit} required/>
                    {#if !ratio_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{ratio_message}</p>
                    {/if}

                    <div class="grid grid-cols-2 gap-4">
                        <button
                        class="text-white bg-lime-600 active:bg-lime-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        on:click={() =>{
                            edit = edit ? false : true;
                        }} type="button">
                            {#if edit} Disable {:else} Enable {/if} Edit
                        </button>
                        <button
                        class="text-white bg-lime-600 active:bg-lime-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        on:click={() =>{
                            if(detect_class == 'person'){
                                detect_class = 'mask';
                            }else{
                                detect_class = 'person'
                            }
                        }} type="button">
                            Change Detect Class To {#if detect_class == 'person'} Mask {:else} Person {/if}
                        </button>
                    </div>
                   
                       
                    {#if edit}
                        {#if processing}
                            <button
                                class="text-white mt-3 bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit" disabled>
                                <icon class="fa-solid fa-spinner fa-spin-pulse fa-xl mr-1"></icon>
                                Processing..
                            </button>
                        {:else}
                            <button
                                class="text-white mt-3 bg-blue-700 active:bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
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

