'use server';

import { redirect } from 'next/navigation';
import CookieService from '../../../../lib/CookieService';

export async function setRoomID(formData) {
  const room = formData.get('roomCode');

  if (room) {
    const roomCookieService = new CookieService('room');
    await roomCookieService.setCookie(room);
  }
}