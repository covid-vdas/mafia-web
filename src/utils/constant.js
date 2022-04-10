export const API_URL = "http://mafia-violation.herokuapp.com/api/";

export function protectedRedirect(session, base){
    if(!session.user){
        return{
            redirect:"auth/login",
            status: 303,
        }
    }

    return base;
}