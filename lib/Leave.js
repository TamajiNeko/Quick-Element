'use server';
import CookieService from "./CookieService";

export const Leave = async () => {
    const roomCookieService = new CookieService('room');
    const usernameCookieService = new CookieService('username');
    const room = await roomCookieService.getCookie();
    const username = await usernameCookieService.getCookie();
    try {
      const res = await fetch(`http://localhost:3000/api/room?get_room=${room}`);
      if (!res.ok) {
        roomCookieService.deleteCookie();
        throw new Error("Room Not Found in Server");
      }
      const data = await res.json();
      if (data) {
        if (username === data.playerA) {
            try {
                const response = await fetch(`http://localhost:3000/api/room?remove=${room}`, {
                method: 'POST',
            });
            
            } catch (error) {
                console.error(error);
            }
        }else if (username === data.playerB) {
            try {
                const response = await fetch(`http://localhost:3000/api/room?leave=${room}`, {
                method: 'POST',
            });
            
            } catch (error) {
                console.error(error);
            }
        }
        roomCookieService.deleteCookie();
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
}