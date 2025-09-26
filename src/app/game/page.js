import ClientPage from './ClientPage';
import CookieService from '../../../lib/CookieService';
export const metadata = {
  title: 'Game - Quick Element'
};

export default async function page(){
    const roomCookieService = new CookieService('room');
    const room = await roomCookieService.getCookie();
    return (
        <>
            <ClientPage room={room}/>
        </>
    )
}