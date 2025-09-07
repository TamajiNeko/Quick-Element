import { NextResponse } from 'next/server';
import pool from '../../../../lib/mysql';

export async function GET(request) {
  const { pathname, searchParams } = request.nextUrl;
  const parts = pathname.split('/');
  const tableName = parts[2];

  if (!tableName) {
    return NextResponse.json({ error: 'Table name is missing from the URL.' }, { status: 400 });
  }

  const id = searchParams.get('id');

  try {
    const db = await pool.getConnection();
    let query = `SELECT * FROM ${tableName}`;

    if (id) {
      query += ` WHERE id = ?`;
      const [rows] = await db.execute(query, [id]);
      db.release();
      return NextResponse.json(rows[0]);
    }
  } catch (error) {
    return NextResponse.json({ error: `Could not retrieve data: ${error.message}` }, { status: 500 });
  }
}