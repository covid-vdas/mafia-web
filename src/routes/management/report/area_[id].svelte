<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){

        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"camera/getAllCamera/"+params.id+"/",{
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
                area_id: params.id,
            }
        };
    }
</script>

<script>
    import ReportCameraCardTable from "components/Cards/ReportCameraCardTable.svelte";
    
    export let area_id;

    let table_title = "Camera";

    let table_properties = [
        "name",
        "url",
        "area id",
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
        {
            "name":"delete",
            "icon":"fas fa-trash",
            "color": "text-rose-600 hover:text-rose-400"
        },
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
            <ReportCameraCardTable table_title={table_title} table_properties={table_properties} area_id={area_id} action_list={action_list} data={data} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

