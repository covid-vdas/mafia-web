<script context="module">
    import {API_URL, API_DETECT_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        let login_user;
        let is_staff = false;
        user.subscribe((t) => (login_user = t));
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"camera/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        
        if(login_user.includes("staff")){
            is_staff = true;
        }
        const edit = params.action == "e"? true : false;
        const data = response.ok && (await response.json());

        return{
            props: {
                token: token_value,
                edit: edit,
                data: data,
                is_staff: is_staff,
            }
        };
    }
</script>

<script>
    import { getContext } from 'svelte';
    import Confirmation from 'components/Modals/Confirmation.svelte';
    import { toast } from '@zerodevx/svelte-toast';
    import { goto, invalidate } from '$app/navigation';

    const { open, close } = getContext('simple-modal');

    export let edit;
    export let token;
    export let data;
    export let is_staff;

    let name_valid = true;
    let url_valid = true;
    let ratio_valid = true;
    let processing = false;
    let color = "bg-slate-100"
    let data_url = encodeURIComponent(data.url);

    $: detect_class = "person";
    $: name_message = "";
    $: ratio_message = "";
    $: url_message = "";
    
    async function reloadData(){
        await invalidate(API_URL+"camera/"+data.id+"/");
    }

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
                'ratio' : data.ratio
            }),
        }).then(
            response => {
                processing = false;
                if(response.status == 200 || response.status == 201){
                    toast.push("Changed camera information successfully", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'green',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }
                    });
                    reloadData();
                }else{
                    console.log(response);
                    toast.push("An error occurred while changing camera information", {
                        theme: {
                            '--toastBackground':'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            
                        }
                    });
                }
            }).catch (error =>{
                toast.push("An error occurred while changing camera information", {
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


    const handleDeleteCamera = async () => {
        open(Confirmation, {
            message: "Do you want to delete this camera .",
            title: "Confirmation",
            btn_title: "Yes",
            handleClick: () => {
                fetch(API_URL + "camera/" + data.id + "/", {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                }).then(
                    response => {
                        close(Confirmation);
                        if (response.status == 200 || response.status == 201) {
                            toast.push("Deleted camera successfully", {
                                theme: {
                                    '--toastBackground': 'white',
                                    '--toastBarBackground': 'green',
                                    '--toastColor': 'black',
                                    '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                }
                            });
                            goto("/management/camera/list_"+data.area_id);
                        } else {
                            console.log(response);
                            toast.push("An error occurred while deleting camera", {
                                theme: {
                                    '--toastBackground': 'white',
                                    '--toastBarBackground': 'red',
                                    '--toastColor': 'black',
                                    '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                }
                            });
                        }
                    }).catch(error => {
                    close(Confirmation);
                    toast.push("An error occurred while deleting camera", {
                        theme: {
                            '--toastBackground': 'white',
                            '--toastBarBackground': 'red',
                            '--toastColor': 'black',
                            '--toastBoxShadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

                        }
                    });
                    console.log(error);
                });
            },
            closeModal: () => {
                close(Confirmation);
            }
        });
        }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-10/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="flex flex-wrap flex-row mb-8">
                    <div class="text-left font-bold grow text-2xl text-zinc-700 content-center">
                        <a sveltekit:prefetch href={"/management/camera/list_"+data.area_id} class="mr-3"><i class="fa-solid fa-angle-left"></i></a>{#if edit}Edit{/if} Camera Information
                    </div>
                    <div class="grow-0">
                        {#if !is_staff}
                            <a on:click|preventDefault= {() => edit?handleDeleteCamera():{}} id="delete-camera" class="btn text-2xl m-0.1 {edit?'text-rose-600 hover:text-rose-400':'text-gray-400'}">
                                <icon class="fa-solid fas fa-trash"></icon>
                            </a>
                        {/if} 
                    </div>
                </div>
                <img src={API_DETECT_URL+`detector/?stream_url=${data_url}&ratio=${data.ratio}&obj_detect_type=${detect_class}&camera_id=${data.id}`} 
                        on:error={(e) =>{
                            let source = e.target;
                            let src = source.getAttribute("src");
                            if(src == data.url){
                                source.setAttribute("src", "/static/error_placeholder.png");
                            }else {
                                source.setAttribute("src", data.url);
                            }
                        }} alt="An IP Camera Stream" id="camera_stream" class="mb-4"/>
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
                    <input type="number" step="any" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none
                    {!ratio_valid?'border-1 border-rose-500 focus:border-rose-600':''}" id="info-cam-ratio" bind:value={data.ratio} disabled={!edit} required/>
                    {#if !ratio_valid}
                        <p class="text-rose-600 text-left text-sm font-semibold mb-3">{ratio_message}</p>
                    {/if}

                    {#if !is_staff}
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
                    {/if}
                </form>
            </div>
        </div>
    </div>
</section>

