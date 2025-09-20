import FullScreenButton from "../../../../../componets/FullScreenButton";
import ClientPage from './ClientPage';
import LobbyRouter from '../../../../../lib/LobbyRouter';
import BackButton from '../../../../../componets/BackButton';
import { Leave } from '../../../../../lib/Leave';
import CookieService from "../../../../../lib/CookieService";

export const metadata = {
  title: 'Seat - Quick Element'
};

export default async function Page() {
  const usernameCookieService = new CookieService('username');
  const roomCookieService = new CookieService('room');
  const username = await usernameCookieService.getCookie() || "N/A";
  const room = await roomCookieService.getCookie() || "N/A";

  LobbyRouter.seatRequest();

  return (
    <>
      <ClientPage username={username} room={room}/>
      <BackButton function_={Leave}/>
      <FullScreenButton/>
    </>
  );
}