export const API_URL = "http://mafia-violation.herokuapp.com/api/";
const API_DETECT = "http://192.168.1.108:8000/"
export const API_DETECT_URL = `${API_DETECT}api/`;
export const MEDIA_DETECT_URL = `${API_DETECT}media/detected/`;
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