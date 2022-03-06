<script context="module">
    import {API_URL} from "utils/constant.svelte";
    import {token} from "../../stores.js"

    export async function load({url, params, fetch, session, stuff }){
        let token_value;
        token.subscribe((t) => (token_value = t));
        const response = fetch(API_URL+"user/",{
            method : "GET",
            headers : {
                "Content-type": "application/json",
                "Authorization": "Bearer "+ token_value,
            }
        }).then(
            response => {
                processing = false;
                if(response.status == 200){
                    error_status = false;
                    return response.json();
                }else{
                    console.log(response)
                    error_status = true;
                }
            }).then(responseData =>{
                if(responseData){
                    console.log(responseData);
                } else {
                    
                }         
            }).catch (error =>{
                error_status=true;
                console.log(error);
                processing = false;
            });
        return{};
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

    let action_list = [
        'Enable',
        'Disable',
        'View',
        'Update',
        'Delete',
    ]
    
    let users = [
        {
            "username": "Admin",
            "email": "admin@gmail.com",
            "address": "123 FPT Campus",
            "phone": "0969169969",
            "birthdate": "06/09/2000",
            "role_id": "1",
            "is_active": true,
            "created_at": "06/03/2022",
            "updated_at": "06/03/2022"
        },
        {
            "username": "Admin",
            "email": "admin@gmail.com",
            "address": "123 FPT Campus",
            "phone": "0969169969",
            "birthdate": "06/09/2000",
            "role_id": "1",
            "is_active": false,
            "created_at": "06/03/2022",
            "updated_at": "06/03/2022"
        }
    ]
    const handleClick = () =>{
        alert("Chao Nhung Em be hieu hoc");
    }
</script>

<section class="relative w-full h-full py-40 min-h-screen">
    <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
            <UserCardTable table_title={table_title} table_properties={table_properties} handleClick={handleClick} action_list={action_list} data={users} color="light"/>
        </div>
    </div>
</section>

