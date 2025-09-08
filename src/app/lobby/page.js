import LobbyRouter from '@/../../lib/lobbyRouter';

export default function Page() {
  LobbyRouter.handleRequest();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-[1.5rem]">Loading...</p>
    </div>
  );
}