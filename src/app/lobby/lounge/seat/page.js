import { cookies } from 'next/headers';
import FullScreenButton from "../../../../../componets/FullScreenButton";
import ClientPage from './ClientPage';
import LobbyRouter from '../../../../../lib/LobbyRouter';
import BackButton from '../../../../../componets/BackButton';
import { deleteRoomCookie } from '../../../../../lib/DeleteCookie';

export const metadata = {
  title: 'Seat - Quick Element'
};

export default function Page() {
  const cookieStore = cookies();
  const username = cookieStore.get('username')?.value || "N/A";
  const room = cookieStore.get('room')?.value || "N/A";

  LobbyRouter.seatRequest();

  return (
    <>
      <ClientPage username={username} room={room}/>
      <BackButton function_={deleteRoomCookie}/>
      <FullScreenButton/>
    </>
  );
}