import { NextResponse } from 'next/server';
import pool from '../../../../lib/Mysql';
import RoomCodeGenerator from '../../../../lib/RoomCodeGenerator';
import CookieService from '../../../../lib/CookieService';

export async function GET(request) {
  const { pathname, searchParams } = request.nextUrl;
  const parts = pathname.split('/');
  const tableName = parts[2];

  if (!tableName) {
    return NextResponse.json({ error: 'Table name is missing from the URL.' }, { status: 400 });
  }

  const get = searchParams.get('get');

  try {
    const db = await pool.getConnection();
    let query = `SELECT * FROM ${tableName}`;

    if (get) {
      query += ` WHERE id = ?`;
      const [rows] = await db.execute(query, [get]);
      db.release();
      return NextResponse.json(rows[0]);
    }
  } catch (error) {
    return NextResponse.json({ error: `Could not retrieve data: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request) {
  const { pathname, searchParams } = request.nextUrl;
  const parts = pathname.split('/');
  const tableName = parts[2];

  if (!tableName) {
    return NextResponse.json({ error: 'Table name is missing from the URL.' }, { status: 400 });
  }

  const create = searchParams.get('create');
  const remove = searchParams.get('remove');
  const join = searchParams.get('join');

  try {
    const db = await pool.getConnection();

    if (create) {
      const playerCookieService = new CookieService('username');
      const playerA = await playerCookieService.getCookie();
      const id = RoomCodeGenerator();
      const roomCookieService = new CookieService('room');
      await roomCookieService.setCookie(id); 

      let query = `insert into ${tableName} (id, playerA) VALUES (?, ?)`;
      const values = [id, playerA];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ id }, { status: 201 });
    } else if (join) {
      const playerCookieService = new CookieService('username');
      const roomCookieService = new CookieService('room');
      const playerB = await playerCookieService.getCookie();
      const id = await roomCookieService.getCookie();

      let query = `UPDATE ${tableName} SET playerB = ? WHERE id = ?`;
      const values = [playerB, id];

      await db.execute(query, values);
      db.release();
    } else if (remove) {
      const id = remove; 
      
      if (!id) {
        return NextResponse.json({ error: 'ID is required to remove an entry.' }, { status: 400 });
      }

      const query = `delete from ${tableName} where id = ?`;
      await db.execute(query, [id]);
      return NextResponse.json({ removed: id }, { status: 200 });
    } else {
      db.release();
      return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: `Data error: ${error.message}` }, { status: 500 });
  }
}