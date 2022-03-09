<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"user/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const edit = params.action == "e"? true : false;
        const user = response.ok && (await response.json());

        return{
            props: {
                user: user,
                edit: edit,
            }
        };
    }
</script>

<script>
    export let edit;
    
    export let user;
    
    user.birthdate = new Date(user.birthdate).toLocaleDateString();

    const handleSubmit = () =>{
        console.log(user);
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
                     transition-all duration-150 focus:outline-none" id="info-email" bind:value={user.email} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-phone">
                        Phone
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow  mb-4 focus:ring w-full ease-linear
                     transition-all duration-150 focus:outline-none" id="info-phone" bind:value={user.phone} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-birthdate">
                        birthdate
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                     transition-all duration-150 focus:outline-none" id="info-birthdate" bind:value={user.birthdate} disabled={!edit}/>

                    <label class="block uppercase text-zinc-600 text-xs font-bold mb-2" for="info-role">
                        Role
                    </label>
                    <input type="text" class="px-3 py-3 bg-white placeholder-zinc-300 rounded-md text-sm shadow mb-4 focus:ring w-full ease-linear
                     transition-all duration-150 focus:outline-none"  id="info-role" bind:value={user.role_id} disabled={!edit}/>

                     {#if edit}
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

