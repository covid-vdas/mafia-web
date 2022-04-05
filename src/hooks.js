import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

/** @type {import('@sveltejs/kit').Handle}  */
export const handle = async ({ event, resolve }) => {
	
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	// TODO https://github.com/sveltejs/kit/issues/1046
	if (event.request.method) {
		event.request.method = event.request.method.toUpperCase();
	}

	if (cookies.session_id) {
		event.locals.user = cookies;
	}

	const response = await resolve(event);
	return response;
};


/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return event.locals.user
    ? {
        user: {
		session_id: event.locals.user.session_id,
        }
	}
    : {};
}