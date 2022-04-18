export const API_URL = "http://mafia-violation.herokuapp.com/api/";
export const API_DETECT_URL = "http://localhost:8000/api/";
export const MEDIA_DETECT_URL = "http://localhost:8000/media/detected/";
export const PAGE_SIZE = 10;
export const CAMERA_PAGE_SIZE = 12;

export function protectedRedirect(session, base){
    if(!session.user){
        return{
            redirect:"/auth/login",
            status: 303,
        }
    }

    return base;
}