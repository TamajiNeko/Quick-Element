import UserNameForm from "./userNameForm";
import LobbyRouter from "@/../lib/lobbyRouter";
import FullScreenButton from '../../../../componets/fullScreenButton';
import { setUsername } from './actions';

export const metadata = {
  title: 'Create User - Quick Element'
}

export default function Page() {
  LobbyRouter.enforceNoAuthentication();
  return (
    <main>
      <div className="flex flex-col justify-center items-center h-screen">
        <UserNameForm setUsername={setUsername} />
      </div>
      <FullScreenButton/>
    </main>
  );
}