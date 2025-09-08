import { NextResponse } from 'next/server';
import pool from '../../../../lib/mysql';
import RoomCodeGenerator from '../../../../lib/roomCodeGenerator';

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

  const set = searchParams.get('set');
  const remove = searchParams.get('remove');

  try {
    const db = await pool.getConnection();

    if (set) {
      const data = await request.json();
      const { playerA, playerB } = data;
      const id = RoomCodeGenerator();
      
      if (!playerA || !playerB) {
        return NextResponse.json({ error: 'Players are required in the request body.' }, { status: 400 });
      }

      let query = `INSERT INTO ${tableName} (id, playerA, playerB) VALUES (?, ?, ?)`;
      const values = [id, playerA, playerB];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ id }, { status: 201 });
    } else if (remove) {
      const id = remove; 
      
      if (!id) {
        return NextResponse.json({ error: 'ID is required to remove an entry.' }, { status: 400 });
      }

      const query = `DELETE FROM ${tableName} WHERE id = ?`;
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