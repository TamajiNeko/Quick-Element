'use server';

import { redirect } from 'next/navigation';
import CookieService from "./CookieService";

export const Leave = async () => {
    const roomCookieService = new CookieService('room');
    const playerCookieService = new CookieService('username');

    let clickBlock = false;

    const [room, username] = await Promise.all([
        roomCookieService.getCookie(),
        playerCookieService.getCookie()
    ]);

    if (room && username && !clickBlock) {
        clickBlock = true
        try {
            const res = await fetch(`http://localhost:3000/api/room?get_room=${room}`);
            if (!res.ok) {
                throw new Error("Room Not Found in Server");
            }
            const data = await res.json();
            if (data.playerA === username) {
                await fetch(`http://localhost:3000/api/room?remove=${room}`, {method:'POST'});
            } else {
                await fetch(`http://localhost:3000/api/room?leave=${room}`, {method:'POST'});
            }
        } catch (error) {
            console.error("Polling error:", error);
        }
        roomCookieService.deleteCookie();
    }

    redirect('../');
}