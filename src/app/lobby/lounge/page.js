import lobbyRouter from "../../../../lib/LobbyRouter";
import { cookies } from 'next/headers';
import FullScreenButton from "../../../../componets/FullScreenButton";
import UserNamePlateWithEdit from "../../../../componets/UserNamePlateWithEdit";
import RoomCodeForm from "./EnterRoomForm";
import { setRoomID } from "./Actions";

export const metadata = {
  title: 'Lounge - Quick Element'
}

export default function Page() {
  const cookieStore = cookies();
  const username = cookieStore.get('username')?.value || "N/A";
  
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