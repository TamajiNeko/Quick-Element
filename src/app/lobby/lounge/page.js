import lobbyRouter from "@/../lib/lobbyRouter";
import { cookies } from 'next/headers';
import FullScreenButton from "../../../../componets/fullScreenButton";
import UserNamePlateWithEdit from "../../../../componets/userNamePlateWithEdit";
import RoomCodeForm from "./enterRoomForm";

export const metadata = {
  title: 'Lounge - Quick Element'
}

export default function Page() {
  const cookieStore = cookies();
  const username = cookieStore.get('username')?.value || "N/A";
  
  lobbyRouter.enforceAuthentication();

  return (
    <main>
      <UserNamePlateWithEdit username={username}/>
      <div className="flex flex-col justify-center items-center h-screen">
        <RoomCodeForm/>
      </div>
      <FullScreenButton/>
    </main>
  );
}