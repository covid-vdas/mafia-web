import { parse, serialize } from 'cookie';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({params, request}) => {
    return {
        status: 200,
        headers: {
            'Set-Cookie': serialize('session_id', '', {
                path: '/',
                expires: new Date(0),
            }),
        },
        body: {
            message: "logout success"
        },
    }
}