import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CookieService from './CookieService';

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

  enforceNoAuthentication() {
    const usernameCookie = cookies().get(this.usernameCookieName);
    if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    }
  }
  
  lobbyRequest() {
    const usernameCookie = cookies().get(this.usernameCookieName);

    if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    } else {
      redirect(this.unauthenticatedRoute);
    }
  }

  loungeRequest() {
    const roomCookie = cookies().get(this.roomCookieName);
    const usernameCookie = cookies().get(this.usernameCookieName);

    if (!usernameCookie || !usernameCookie.value) {
      redirect(this.unauthenticatedRoute);
    } else if (roomCookie && roomCookie.value) {
      redirect(this.roomAuthenticatedRoute);
    }
  }

  seatRequest() {
    const roomCookie = cookies().get(this.roomCookieName);
    const usernameCookie = cookies().get(this.usernameCookieName);

    if (!usernameCookie || !usernameCookie.value) {
      redirect(this.unauthenticatedRoute);
    } else if (!roomCookie || !roomCookie.value) {
      redirect(this.authenticatedRoute);
    }
  }
}

export default new LobbyRouter();