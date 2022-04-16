export const API_URL = "http://mafia-violation.herokuapp.com/api/";
export const API_DETECT_URL = "http://192.168.1.108:8000/api/";

export function protectedRedirect(session, base){
    if(!session.user){
        return{
            redirect:"/auth/login",
            status: 303,
        }
    }

    return base;
}