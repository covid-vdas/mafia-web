import { withIronSession } from 'next-iron-session'

export default function withSession(handler) {
    return withIronSession(handler, {
        password: '8gvAYVS7enKMNAMgeJ7G4LWZ6Ze2yaXg',
        cookieName: '_session',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production'
        }
    })
}