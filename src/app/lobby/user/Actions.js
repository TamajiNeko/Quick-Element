'use server';

import { redirect } from 'next/navigation';
import CookieService from '../../../../lib/CookieService';

export async function setUsername(formData) {
  const userName = formData.get('userName');

  if (userName) {
    const usernameCookieService = new CookieService('username');
    await usernameCookieService.setCookie(userName); 
    redirect('/lobby/lounge');
  }
}