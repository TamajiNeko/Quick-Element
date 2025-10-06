'use server';

import { redirect } from 'next/navigation'; 
import CookieService from "./CookieService";

export const Leave = async () => {
    const roomCookieService = new CookieService('room');

    const [room] = await Promise.all([
        roomCookieService.getCookie(),
    ]);
    
    if (room) {
        roomCookieService.deleteCookie();
    }
    
    redirect('../'); 
}