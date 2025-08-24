import lobbyRouter from "@/../lib/lobbyRouter";
import FullScreenButton from "../../../../componets/fullScreenButton";

export const metadata = {
  title: 'Louge - Quick Element'
}

export default function HomePage() {
  
  lobbyRouter.enforceAuthentication();

  return (
    <main>
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-[1.5rem] text-white">Loading...</p>
        </div>
        <FullScreenButton/>
    </main>
  );
}