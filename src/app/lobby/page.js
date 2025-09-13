import LobbyRouter from '../../../lib/LobbyRouter';
import {  } from 'next/dist/server/api-utils';

export default function Page() {
  LobbyRouter.lobbyRequest();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-[1.5rem]">Loading...</p>
    </div>
  );
}