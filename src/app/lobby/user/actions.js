'use server';

import { redirect } from 'next/navigation';
import CookieService from '@/../lib/cookieService';

export async function setUsername(formData) {
  const username = formData.get('username');

  if (username) {
    await CookieService.setCookie(username); 
    redirect('/lobby/lounge');
  }
  return { message: 'Username is required.' };
}