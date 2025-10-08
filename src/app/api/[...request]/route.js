import { NextResponse } from 'next/server';
import pool from '../../../../lib/MySql';
import CookieService from '../../../../lib/CookieService';

export async function GET(request) {
    const { pathname, searchParams } = request.nextUrl;
    const parts = pathname.split('/');
    const tableName = parts[2];

    const getRoom = searchParams.get('get_room');
    const getElement = searchParams.get('element');

    try {
        const db = await pool.getConnection();
        let query = `select * from ${tableName}`;

        if (getRoom) {
            query += ` where id = ?`;
            const [rows] = await db.execute(query, [getRoom]);
            db.release();
            return NextResponse.json(rows[0]);
        } else if (getElement) {
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

    const create = searchParams.get('create');
    const join = searchParams.get('join');
    const leave = searchParams.get('leave');
    const ready = searchParams.get('ready');
    const remove = searchParams.get('remove');

    try {
        const db = await pool.getConnection();

        if (create) {
            const playerCookieService = new CookieService('username');
            const playerA = await playerCookieService.getCookie();
            const playerB = "Waiting..."
            const codeGenerator = async(lenght) => {return Math.random().toString(36).substring(2, 2 + lenght);}
            const id = await codeGenerator(6);
            const roomCookieService = new CookieService('room');
            roomCookieService.setCookie(id);

            let query = `insert into ${tableName} (id, playerA, playerB, BReady) VALUES (?, ?, ?, 2)`;
            const values = [id, playerA, playerB];

            await db.execute(query, values);
            db.release();
            return NextResponse.json({ status: 201 });
        } else if (join) {
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