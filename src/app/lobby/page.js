import LobbyRouter from '@/../../lib/lobbyRouter';

export default function Page() {
  LobbyRouter.handleRequest();
  return null;
}