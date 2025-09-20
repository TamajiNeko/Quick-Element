'use server';

import { redirect } from 'next/navigation';
import CookieService from './CookieService';

export async function deleteUsername() {
  const cookieService = new CookieService('username');
  await cookieService.deleteCookie();

  redirect('/lobby');
}