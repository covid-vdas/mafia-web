import { initializeApp } from 'firebase/app'
import _auth from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBrHhfP6OXbZGOk-vdzcL5l0iraCHvH_3U',
    authDomain: 'covid-vdas.firebaseapp.com',
    databaseURL: 'https://covid-vdas-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'covid-vdas',
    storageBucket: 'covid-vdas.appspot.com',
    messagingSenderId: '367575761058',
    appId: '1:367575761058:web:c266b7437604644e4817fb',
    measurementId: 'G-MHF7YCRPS1'
}

export const app = initializeApp(firebaseConfig)
export * as auth from 'firebase/auth'