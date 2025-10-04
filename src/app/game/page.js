import ClientPage from './ClientPage'; 
import CookieService from '../../../lib/CookieService';

export const metadata = {
    title: 'Game - Quick Element'
};

export default async function page(){
    const playerCookieService = new CookieService('username');
    const roomCookieService = new CookieService('room');
    const actualPlayerName = await playerCookieService.getCookie();
    const room = await roomCookieService.getCookie();
    
    const youPlayerName = `1${actualPlayerName}`; 
    const opponentPlayerName = `0${actualPlayerName}`;

    return (
        <>
            <ClientPage 
                room={room} 
                youPlayerName={youPlayerName}
                opponentPlayerName={opponentPlayerName}
                playerName={actualPlayerName} 
            />
        </>
    );
}