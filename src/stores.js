import { writable } from "svelte/store";
import { browser } from '$app/env';
 
let persistedUser = browser && localStorage.getItem('user');
export const user = writable(persistedUser? persistedUser:'');

let persistedToken = browser && localStorage.getItem('token');
export const token = writable(persistedToken? persistedToken:'');

if(browser){
    user.subscribe(u => localStorage.user = u);
    token.subscribe(t => localStorage.token = t);
}