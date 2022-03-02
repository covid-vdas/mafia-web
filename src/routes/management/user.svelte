<script context="module">
    import {API_URL} from "utils/constant.svelte";

    export async function load({url, params, fetch, session, stuff }){
        console.log(API_URL);
        return{};
    }
</script>

<script>
    import CardTable from "components/Cards/CardTable.svelte";

    let table_title = "Users";

    let table_properties = [
        "No.",
        "Username",
        "Email",
        "Phone",
        "Birthdate",
        "Role",
        "Active",
        "Updated Date",
        "Action",
    ];

    const handleClick = () =>{
        alert("Chao Nhung Em be hieu hoc");
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <CardTable table_title={table_title} table_properties={table_properties} handleClick={handleClick} color="light"/>
        </div>
    </div>
</section>

