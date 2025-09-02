import { cookies } from 'next/headers';

class CookieService {
  constructor(cookieName) {
    this.cookieName = cookieName;
  }

  async setCookie(value) {
    cookies().set(this.cookieName, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  async getCookie() {
    return cookies().get(this.cookieName)?.value || null;
  }

  async deleteCookie() {
    cookies().set(this.cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    });
  }
}

export default CookieService;