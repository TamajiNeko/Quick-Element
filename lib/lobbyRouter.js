import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

class LobbyRouter {
  constructor() {
    this.cookieName = 'username';
    this.authenticatedRoute = '/lobby/lounge';
    this.unauthenticatedRoute = '/lobby/user';
  }

  enforceAuthentication() {
    const usernameCookie = cookies().get(this.cookieName);
    if (!usernameCookie || !usernameCookie.value) {
      redirect(this.unauthenticatedRoute);
    }
  }

  handleRequest() {
    const usernameCookie = cookies().get(this.cookieName);
    if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    } else {
      redirect(this.unauthenticatedRoute);
    }
  }

  enforceNoAuthentication() {
    const usernameCookie = cookies().get(this.cookieName);
    if (usernameCookie && usernameCookie.value) {
      redirect(this.authenticatedRoute);
    }
  }
}

export default new LobbyRouter();