import {API_URL} from "utils/constant.js";
import {serialize} from "cookie";

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({params, request}) =>{
    const form_data = await request.json();
    
    let res_data;
    let res;
    const response = await fetch(API_URL+"login/",{
            method : "POST",
            headers : {
                "Content-type": "application/json",
            },
            body : JSON.stringify(form_data),
        }).then(
            response => {
                if(response.status == 200){
                    return response.json();
                }else{
                    res = response;
                }
            }).then(response_data =>{
                if(response_data){
                   res_data = response_data;
                } else {
                }
            }).catch (error =>{
                error_status=true;
                console.log(error);
            });

    if(res_data){
        return {
            status: 200,
            headers: {
                'Set-Cookie': serialize('session_id', res_data.data.id, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // one week
                }),
            },
            body: res_data
        }
    }else{
        return res;
    }     
}
