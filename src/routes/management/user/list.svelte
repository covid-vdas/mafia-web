<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch}){

        let token_value;
        let login_user;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        user.subscribe((t) => (login_user = t));
        const response = await fetch(API_URL+"user/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        
        if(response.status == 401 || response.status == 403){
            return {
                redirect:"/",
                status: 303,
            }
        }

        const users = response.ok && (await response.json());


        let user_value;
        let user_object;
        user.subscribe((u) => (user_value = u));

        if (user_value) {
            user_object = JSON.parse(user_value);
        }

        return{
            props: {
                users: users,
                user_object: user_object,
                login_user: login_user,
            }
        };
    }
</script>

<script>
    import UserCardTable from "components/Cards/UserCardTable.svelte";
    import { getContext } from 'svelte';
    import Confirmation from 'components/Modals/Confirmation.svelte';
    const { open, close } = getContext('simple-modal');

    export let login_user;

    let table_title;

    if(login_user){
        login_user = JSON.parse(login_user);
    }
    

    if(login_user.role_id.name =="admin"){
        table_title = "User";
    } else {
        table_title = "Staff";
    }

    let table_properties = [
        "No.",
        "username",
        "full name",
        "email",
        "phone",
        "birthdate",
        "role",
        "status",
        "updated date",
        "action",
    ];

    let action_list = [
        {
            "name":"enable",
            "icon":"fas fa-unlock",
            "color": "text-emerald-600 hover:text-emerald-400"
        },
        {
            "name":"disable",
            "icon":"fas fa-lock",
            "color": "text-rose-600 hover:text-rose-400"
        },
        {
            "name":"view",
            "icon":"fas fa-circle-info",
            "color": "text-blue-800 hover:text-blue-400"
        },
        {
            "name":"edit",
            "icon":"fas fa-user-pen",
            "color": "text-blue-800 hover:text-blue-400"
        },
        {
            "name":"delete",
            "icon":"fas fa-trash",
            "color": "text-rose-600 hover:text-rose-400"
        }
    ]
    
    export let users;
    export let user_object;

</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <UserCardTable table_title={table_title} table_properties={table_properties} action_list={action_list} data={users} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

