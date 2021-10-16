import admin, { app } from 'firebase-admin'

const sa = require('../firebase-private.json')

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(sa),
        databaseURL: sa.database_url
    })
}

export default admin