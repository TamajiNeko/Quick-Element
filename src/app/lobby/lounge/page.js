import lobbyRouter from "../../../../lib/LobbyRouter";
import FullScreenButton from "../../../../componets/FullScreenButton";
import UserNamePlateWithEdit from "../../../../componets/UserNamePlateWithEdit";
import RoomCodeForm from "./EnterRoomForm";
import { setRoomID } from "./Actions";
import CookieService from "../../../../lib/CookieService";

export const metadata = {
  title: 'Lounge - Quick Element'
}

export default async function Page() {
  const usernameCookieService = new CookieService('username');
  const username = await usernameCookieService.getCookie() || "N/A";
  
  lobbyRouter.loungeRequest();

  return (
    <>
      <UserNamePlateWithEdit username={username}/>
      <div className="flex flex-col justify-center items-center h-screen">
        <RoomCodeForm setRoomID={setRoomID}/>
      </div>
      <FullScreenButton/>
    </>
  );
}