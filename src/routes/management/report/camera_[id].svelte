<script context="module">
    import {API_URL} from "utils/constant.js";
    import {token, user} from "../../../stores.js"
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({fetch, params}){

        let token_value;
        console.log("Loading");
        token.subscribe((t) => (token_value = t));
        const response = await fetch(API_URL+"violation/getAllViolation/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        const response_chart = await fetch(`${API_URL}violation/listViolationByCamera/${params.id}/?from-date=7`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + token_value,
                },
            })

        const response_camera = await fetch(API_URL+"camera/"+params.id+"/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        });

        if(response.status == 401 || response_camera.status == 401 || response.status == 403 || response_camera.status == 403){
            return {
                redirect:"/",
                status: 303,
            }
        }

        const data = response.ok && (await response.json());
        const camera = response_camera.ok && (await response_camera.json());
        const chart_data = response_chart.ok && (await response_chart.json());

        let user_value;
        let user_object;
        user.subscribe((u) => (user_value = u));

        if (user_value) {
            user_object = JSON.parse(user_value);
        }

        return{
            props: {
                data: data.data,
                user_object: user_object,
                area_id: params.id,
                camera : camera,
                chart_data: chart_data,
            }
        };
    }
</script>

<script>
    import ReportCameraDetailCardTable from "components/Cards/ReportCameraDetailCardTable.svelte";
    
    export let area_id;
    export let camera;
    export let chart_data;
    export let data;
    export let user_object;

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
            "name":"view",
            "icon":"fas fa-circle-info",
            "color": "text-blue-800 hover:text-blue-400"
        }
    ]

</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <ReportCameraDetailCardTable table_title={table_title} table_properties={table_properties} area_id={camera.area_id} action_list={action_list} data={data} chart_data={chart_data} user_object={user_object} color="light"/>
        </div>
    </div>
</section>

