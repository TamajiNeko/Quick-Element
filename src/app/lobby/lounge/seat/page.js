import FullScreenButton from "../../../../../componets/FullScreenButton"
import UserNamePlate from "../../../../../componets/UserNamePlate"
import RoomCodePlate from "../../../../../componets/RoomCodePlate";
import CookieService from '../../../../../lib/CookieService';
import lobbyRouter from "../../../../../lib/LobbyRouter";
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Seat - Quick Element'
}

export default function Page (){
    const usernameCookieService = new CookieService('username');
    const roomCookieService = new CookieService('room');
    const username = usernameCookieService.getCookie() || "N/A";
    const room = roomCookieService.getCookie() || "N/A";

    lobbyRouter.enforceAuthentication();

    return(
        <main>
            <UserNamePlate username={username}/>
            <RoomCodePlate code={room}/>
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-[1.5rem]">Loading...</p>
            </div>
            <FullScreenButton/>
        </main>
    )
}