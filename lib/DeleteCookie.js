'use server';
import CookieService from "./CookieService";

export async function deleteRoomCookie() {
    const cookieService_ = new CookieService('room');
    const requestRoomDelete = cookieService_.deleteCookie();
}