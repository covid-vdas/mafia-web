<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"violation/"+params.id+"/",{
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


    const handleSubmit = async () =>{
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4 content-center items-center justify-center">
        <div class="w-full lg:w-5/12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words shadow-lg rounded py-4 px-9">
                <div class="text-left mb-8 font-bold text-2xl text-zinc-700">
                    <a sveltekit:prefetch href={"/management/report/camera_"+data.camera_id.id} class="mr-3"><i class="fa-solid fa-angle-left"></i></a>{#if edit}Edit{/if} Report Information
                </div>
                <img class="mb-4" src="#" on:error={(e) =>{
                    let source = e.target;
                    source.setAttribute("src", "/static/report_temp.png");
                  }} alt="Violation Image"/>

                <form on:submit|preventDefault="{handleSubmit}">
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        ID
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={data.id} disabled={!edit}/>
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Type
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" value="Distance" disabled={!edit}/>
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Camera
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" bind:value={data.camera_id.name} disabled={!edit}/>
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Class
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" value="Person" disabled={!edit}/>
                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-fullname">
                        Distance
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                    transition-all duration-150 focus:outline-none" id="info-fullname" value="132.53608929178085" disabled={!edit}/>

                    {#if !edit}
                        {#if processing}
                            <button
                                class="text-white bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit" disabled>
                                <icon class="fa-solid fa-spinner fa-spin-pulse fa-xl mr-1"></icon>
                                Processing..
                            </button>
                        {:else}
                            <button
                                class="text-white bg-emerald-600 active:bg-blue-500 text-sm font-bold uppercase px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                type="submit">
                                Export
                            </button>
                        {/if}
                    {/if}
                </form>
            </div>
        </div>
    </div>
</section>

