import { NextResponse } from 'next/server';
import pool from '../../../../lib/MySql';
import CodeGenerator from '../../../../lib/CodeGenerator';
import CookieService from '../../../../lib/CookieService';

export async function GET(request) {
  const { pathname, searchParams } = request.nextUrl;
  const parts = pathname.split('/');
  const tableName = parts[2];

  if (!tableName) {
    return NextResponse.json({ error: 'Table name is missing from the URL.' }, { status: 400 });
  }

  const getRoom = searchParams.get('get_room');
  const getMap = searchParams.get('get_map');

  try {
    const db = await pool.getConnection();
    let query = `select * from ${tableName}`;

    if (getRoom) {
      query += ` where id = ?`;
      const [rows] = await db.execute(query, [getRoom]);
      db.release();
      return NextResponse.json(rows[0]);
    }else if (getMap) {
      query += ` inner join room where room_id = ?`;
      const [rows] = await db.execute(query, [getMap]);
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
  const makeRoom = searchParams.get('make');
  const remove = searchParams.get('remove');
  const join = searchParams.get('join');
  const leave = searchParams.get('leave');
  const ready = searchParams.get('ready');

  try {
    const db = await pool.getConnection();

    if (create) {
      const playerCookieService = new CookieService('username');
      const playerA = await playerCookieService.getCookie();
      const playerB = "Waiting..."
      const generateRoomCode = new CodeGenerator();
      const id = await generateRoomCode.generate(6);
      const roomCookieService = new CookieService('room');
      roomCookieService.setCookie(id); 

      let query = `insert into ${tableName} (id, playerA, playerB, BReady) VALUES (?, ?, ?, 2)`;
      const values = [id, playerA, playerB];

      await db.execute(query, values);
      db.release();
        return NextResponse.json({ id }, { status: 201 });
    }else if (makeRoom) {
      const roomCookieService = new CookieService('room');
      const room = await roomCookieService.getCookie(); 
      const turn = `player${Math.random() < 0.5 ? "A" : "B"}`;

      let query = `INSERT INTO ${tableName} (room_id, turn) VALUES (?, ?)`;
      const values = [room, turn];

      const [result] = await db.execute(query, values);
      db.release();

      return NextResponse.json({ id: result.insertId }, { status: 201 });
    }else if (join) {
      const playerCookieService = new CookieService('username');
      const roomCookieService = new CookieService('room');
      const playerB = await playerCookieService.getCookie();
      const id = await roomCookieService.getCookie();

      let query = `update ${tableName} set playerB = ?, BReady = 0 where id = ?`;
      const values = [playerB, id];

      await db.execute(query, values);
      db.release();
    } else if (leave) {
      const playerB = "Waiting...";
      const id = leave;

      let query = `update ${tableName} set playerB = ?, BReady = 2 where id = ?`;
      const values = [playerB, id];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ leaving: id }, { status: 200 });
    } else if (ready) {
      const position = ready;

      const roomCookieService = new CookieService('room');
      const id = await roomCookieService.getCookie();

      if (!position) {
        return NextResponse.json({ error: 'Position is required' }, { status: 400 });
      }

      const query = `update ${tableName} set ${position} = true where id = ?`;
      const values = [id];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ position: 'Is Ready' }, { status: 200 });
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