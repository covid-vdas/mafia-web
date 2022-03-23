<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch}){

        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"role/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const role = response.ok && (await response.json());


        let user_value;
        let user_object;
        user.subscribe((u) => (user_value = u));

        if (user_value) {
            user_object = JSON.parse(user_value);
        }

        return{
            props: {
                role: role,
                user_object: user_object,
            }
        };
    }
</script>

<script>
    import RoleCardTable from "components/Cards/RoleCardTable.svelte";

    let table_title = "Role";

    let table_properties = [
        "id",
        "name",
        "updated date",
        "action",
    ];

    let action_list = [
        {
            "name":"view",
            "icon":"fas fa-circle-info",
            "color": "text-blue-800 hover:text-blue-400"
        },
        {
            "name":"edit",
            "icon":"fas fa-pen",
            "color": "text-blue-800 hover:text-blue-400"
        },
        // {
        //     "name":"delete",
        //     "icon":"fas fa-trash",
        //     "color": "text-rose-600 hover:text-rose-400"
        // }
    ]
    
    export let role;
    export let user_object;

</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <RoleCardTable table_title={table_title} table_properties={table_properties} action_list={action_list} data={role} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

