import UserNameForm from "./UserNameForm";
import LobbyRouter from "../../../../lib/LobbyRouter";
import FullScreenButton from '../../../../componets/FullScreenButton';
import { setUsername } from './Actions';

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