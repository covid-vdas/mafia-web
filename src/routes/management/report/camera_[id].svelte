<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){

        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"violation/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });
        const data = response.ok && (await response.json());

        const response_camera = await fetch(API_URL+"camera/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        const camera = response_camera.ok && (await response_camera.json());

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
                camera : camera,
            }
        };
    }
</script>

<script>
    import ReportCameraDetailCardTable from "components/Cards/ReportCameraDetailCardTable.svelte";
    
    export let area_id;
    export let camera;

    let table_title = camera.name + " Report";

    let table_properties = [
        "No.",
        "Type",
        "Camera",
        "Class",
        "Distance",
        "Created At",
        "Action"
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
            <ReportCameraDetailCardTable table_title={table_title} table_properties={table_properties} area_id={area_id} action_list={action_list} data={data} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

