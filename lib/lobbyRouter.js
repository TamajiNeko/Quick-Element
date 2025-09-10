import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

class LobbyRouter {
  constructor() {
    this.usernameCookieName = 'username';
    this.roomCookieName = 'room';
    this.authenticatedRoute = '/lobby/lounge';
    this.roomAuthenticatedRoute = '/lobby/lounge/seat';
    this.unauthenticatedRoute = '/lobby/user';
  }

  enforceAuthentication() {
    const usernameCookie = cookies().get(this.usernameCookieName);
    if (!usernameCookie || !usernameCookie.value) {
      redirect(this.unauthenticatedRoute);
    }
  }

  handleRequest() {
    const usernameCookie = cookies().get(this.usernameCookieName);
    const roomCookie = cookies().get(this.roomCookieName);

    if (roomCookie && roomCookie.value) {
      redirect(this.roomAuthenticatedRoute);
    } else if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    } else {
      redirect(this.unauthenticatedRoute);
    }
  }

  enforceNoAuthentication() {
    const usernameCookie = cookies().get(this.usernameCookieName);
    if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    }
  }
}

export default new LobbyRouter();