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
  const getElement = searchParams.get('element');

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
    }else if (getElement) {
      let elementId = parseInt(getElement, 10);
      if (isNaN(elementId)) {
        elementId = getElement
        query += ` where element = ?`;
      } else {
        query += ` where id = ?`;
      }
      const [rows] = await db.execute(query, [elementId]);
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
  const createMap = searchParams.get('create_map');
  const set = searchParams.get('set')
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
      return NextResponse.json({ status: 201 });
    }else if (createMap) {
      const mapData = await request.json();
      const jsonMapData = JSON.stringify(mapData);
      const roomCookieService = new CookieService('room');
      const room = await roomCookieService.getCookie(); 
      const turn = `player${Math.random() < 0.5 ? "A" : "B"}`;

      let query = `INSERT INTO ${tableName} (room_id, turn, map) VALUES (?, ?, ?)`;
      const values = [room, turn, jsonMapData];

      await db.execute(query, values);
      db.release();

      return NextResponse.json({ status: 200 });
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

      let query = `update ${tableName} set playerB = ?, BReady = 2 where id = ?`;
      const values = [playerB, leave];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ status: 200 });
    } else if (ready) {

      const roomCookieService = new CookieService('room');
      const id = await roomCookieService.getCookie();

      if (!ready) {
        return NextResponse.json({ error: 'Position is required' }, { status: 400 });
      }

      const query = `update ${tableName} set ${ready} = true where id = ?`;
      const values = [id];

      await db.execute(query, values);
      db.release();
      return NextResponse.json({ status: 200 });
    } else if (set) {
      const data = await request.json();
      const roomCookieService = new CookieService('room');
      const id = await roomCookieService.getCookie();
      const coordinate = data.coordinate;
      const element = data.element;
      const value = data.value;

      if (set === 'place') {
        const parent = data.parent
        if (parent) {
          const query = `update ${tableName} set map = json_set
              ( map,
                '${'$.' + coordinate + '.parent'}', ?,
                '${'$.' + coordinate + '.value'}', ?
              )
              where room_id = ?`;
          const values = [element, value, id];
          await db.execute(query, values);
        } else {
          const query = `update ${tableName} set map = json_set
              ( map,
                '${'$.' + coordinate + '.element'}', ?,
                '${'$.' + coordinate + '.value'}', ?
              )
              where room_id = ?`;
          const values = [element, value, id];
          await db.execute(query, values);
        }
        db.release();
        return NextResponse.json({ status: 200 });
      } else if (set === 'start') {
        const col = parseInt(coordinate.substring(1), 10);
        const rowChar = coordinate.charAt(0);
        const rowIndex = rowChar.charCodeAt(0);
        const offsets = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        let jsonPaths = [];
        let queryValues = [];

        jsonPaths.push(`'${'$.' + coordinate + '.element'}', ?`);
        queryValues.push(element);
        
        jsonPaths.push(`'${'$.' + coordinate + '.value'}', ?`);
        queryValues.push(value);

        for (const [rOffset, cOffset] of offsets) {
            const newRowIndex = rowIndex + rOffset;
            const newCol = col + cOffset;
            
            if (newRowIndex >= 'A'.charCodeAt(0) && newRowIndex <= 'I'.charCodeAt(0) && 
                newCol >= 1 && newCol <= 15) {
                
                const newCoord = String.fromCharCode(newRowIndex) + newCol;
                
                jsonPaths.push(`'${'$.' + newCoord + '.value'}', ?`);
                queryValues.push(value); 
                
                jsonPaths.push(`'${'$.' + newCoord + '.parent'}', ?`);
                queryValues.push(element); 
            }
        }

        const jsonSetString = jsonPaths.join(',\n');
        
        const query = `
            UPDATE ${tableName} 
            SET 
                map = JSON_SET(
                    map,
                    ${jsonSetString} 
                )
            WHERE 
                room_id = ?`;

        queryValues.push(id); 

        await db.execute(query, queryValues);
        db.release();
        return NextResponse.json({ status: 200 });
        } else if (remove) {
          
          if (!remove) {
            return NextResponse.json({ error: 'ID is required to remove an entry.' }, { status: 400 });
          }

          const query = `delete from ${tableName} where id = ?`;
          await db.execute(query, [remove]);
          return NextResponse.json({ status: 200 });
      }
    } else if (remove) {
      
      if (!remove) {
        return NextResponse.json({ error: 'ID is required to remove an entry.' }, { status: 400 });
      }

      const query = `delete from ${tableName} where id = ?`;
      await db.execute(query, [remove]);
      return NextResponse.json({ status: 200 });
    } else {
      db.release();
      return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: `Data error: ${error.message}` }, { status: 500 });
  }
}