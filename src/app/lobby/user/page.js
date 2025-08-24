import UserNameForm from './UserNameForm';
import lobbyRouter from "@/../lib/lobbyRouter";
import FullScreenButton from '../../../../componets/fullScreenButton';
import { setUsername } from './actions';

export const metadata = {
  title: 'Create User - Quick Element'
}

export default function Home() {
  lobbyRouter.enforceNoAuthentication();
  return (
    <main>
      <div className="flex flex-col justify-center items-center h-screen">
        <UserNameForm setUsername={setUsername} />
      </div>
      <FullScreenButton/>
    </main>
  );
}