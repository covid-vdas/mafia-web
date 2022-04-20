<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch}){

        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"area/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const data = response.ok && (await response.json());

        if(response.status == 401 || response.status == 403){
            return {
                redirect:"/",
                status: 303,
            }
        }

        let user_value;
        let user_object;
        user.subscribe((u) => (user_value = u));

        if (user_value) {
            user_object = JSON.parse(user_value);
        }

        return{
            props: {
                data: data,
                user_object: user_object,
            }
        };
    }
</script>

<script>
    import ReportAreaCardTable from "components/Cards/ReportAreaCardTable.svelte";

    let table_title = "Area";

    let table_properties = [
        "No.",
        "name",
        "updated date",
        "action",
    ];

    let action_list = [
        {
            "name":"detail",
            "icon": "fa-solid fa-right-to-bracket",
            "color": "text-emerald-600 hover:text-emerald-400"
        }
    ]
    
    export let data;
    export let user_object;

</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <ReportAreaCardTable table_title={table_title} table_properties={table_properties} action_list={action_list} data={data} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

