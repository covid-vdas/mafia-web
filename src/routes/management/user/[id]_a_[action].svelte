<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){
        let token_value;
        token.subscribe((t) => (token_value = t));
        console.log(params.id);
        console.log(params.action);
        const response = await fetch(API_URL+"user/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const user = response.ok && (await response.json());
        console.log(user);
        console.log(response);

        return{
            props: {
                user: user,
            }
        };
    }
</script>

<script>
    import UserCardTable from "components/Cards/UserCardTable.svelte";

    let table_title = "Users";

    let table_properties = [
        "No.",
        "username",
        "email",
        "phone",
        "birthdate",
        "role",
        "active",
        "updated date",
        "action",
    ];

    export let id;
    
    export let user;

    const handleClick = () =>{
        console.log(user);
        alert("Chao Nhung Em be hieu hoc");
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded p-4">
                hello {user.id}
                <form>
                    <input type="text" value={user.fullname}/>
                </form>
            </div>
        </div>
    </div>
    <button class="btn bg-slate-500 text-white" on:click={handleClick}>Click Me</button>
</section>

