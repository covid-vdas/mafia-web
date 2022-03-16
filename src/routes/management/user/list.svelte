<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch}){
        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"user/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const users = response.ok && (await response.json());

        return{
            props: {
                users: users,
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
        "fullname",
        "email",
        "phone",
        "birthdate",
        "role",
        "active",
        "updated date",
        "action",
    ];

    let action_list = [
        {
            "name":"enable",
            "icon":"fas fa-unlock"
        },
        {
            "name":"disable",
            "icon":"fas fa-lock"
        },
        {
            "name":"view",
            "icon":"fas fa-circle-info"
        },
        {
            "name":"edit",
            "icon":"fas fa-user-pen"
        },
        {
            "name":"delete",
            "icon":"fas fa-trash"
        }
    ]
    
    export let users;

    const handleClick = () =>{
        console.log(users);
        alert("Chao Nhung Em be hieu hoc");
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <UserCardTable table_title={table_title} table_properties={table_properties} action_list={action_list} data={users} color="light"/>
        </div>
    </div>
    <button class="btn bg-slate-500 text-white" on:click={handleClick}>Click Me</button>
</section>

