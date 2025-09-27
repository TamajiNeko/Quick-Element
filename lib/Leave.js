'use server';

import { redirect } from 'next/navigation'; 

import CookieService from "./CookieService";

export const Leave = async () => {
    const roomCookieService = new CookieService('room');
    const usernameCookieService = new CookieService('username');

    const [room, username] = await Promise.all([
        roomCookieService.getCookie(),
        usernameCookieService.getCookie()
    ]);

    try {
        const res = await fetch(`http://localhost:3000/api/room?get_room=${room}`);
        

        if (!res.ok) {
            console.warn(`Room ${room} not found or server error. Deleting cookies and redirecting.`);
            roomCookieService.deleteCookie();
            redirect('/'); 
        }

        const data = await res.json();

        if (data) {
            let actionSuccessful = false;
            
            if (username === data.playerA) {
                try {
                    const response = await fetch(`http://localhost:3000/api/room?remove=${room}`, {
                        method: 'POST',
                    });
                    if (response.ok) actionSuccessful = true;
                } catch (error) {
                    console.error("Error removing room:", error);
                }
            } 
            else if (username === data.playerB) {
                try {
                    const response = await fetch(`http://localhost:3000/api/room?leave=${room}`, {
                        method: 'POST',
                    });
                    if (response.ok) actionSuccessful = true;
                } catch (error) {
                    console.error("Error leaving room:", error);
                }
            }
            
            if (actionSuccessful) {
                 roomCookieService.deleteCookie();
            }
           
        }
        
    } catch (error) {
        console.error("Polling error:", error);
    }
    
    redirect('../'); 
}