'use server';

import { redirect } from 'next/navigation';
import CookieService from './cookieService';

export async function deleteUsername() {
  const cookieService = new CookieService('username');
  await cookieService.deleteCookie();

  redirect('/lobby');
}