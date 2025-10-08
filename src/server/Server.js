const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const httpServer = http.createServer();

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env.local')
});

const pool = require('../../lib/MySql');
const GameInitializer = require('../../modules/GameInitializer');
const gameInitializer = new GameInitializer();

const SERVER_PORT = 3001;

const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('enterRoom', async (room) => {
        socket.join(room);
        console.log(`[SOCKET] ${socket.id} joined room: ${room}`);

        try {
            const [roomData] = await pool.execute(
                `SELECT * FROM room WHERE id = ?`,
                [room]
            );

            const roomInfo = roomData[0];

            if (roomData.length > 0) {
                const [rows] = await pool.execute(
                    `SELECT * FROM map_data INNER JOIN room WHERE room_id = ?`,
                    [room]
                );

                let gameUpdateData;

                if (rows.length > 0) {
                    const data = rows[0];
                    gameUpdateData = {
                        ...data,
                        map: data.map,
                        handA: data.handA,
                        handB: data.handB,
                        turn: data.turn,
                        playerA: data.playerA,
                        playerB: data.playerB,
                        winner: data.winner
                    };
                }
                else {
                    console.log(`[DB] Initializing map_data for room: ${room}`);

                    const gameData = await gameInitializer.prepareGame();
                    const insertQuery = `
                    INSERT INTO map_data (room_id, map, handA, handB, turn)
                    VALUES (?, ?, ?, ?, ?)`;

                    await pool.execute(insertQuery, [
                        room,
                        JSON.stringify(gameData.map),
                        JSON.stringify(gameData.handA),
                        JSON.stringify(gameData.handB),
                        gameData.turn,
                    ]);

                    gameUpdateData = {
                        ...gameData,
                        room_id: room,
                        turn: gameData.turn,
                        playerA: roomInfo.playerA,
                        playerB: roomInfo.playerB,
                        winner: roomInfo.winner
                    };
                }

                socket.emit('gameUpdate', gameUpdateData);
            } else {
                console.log(`[DB] Room ${room} not found.`);
                socket.emit('action_error', { message: 'Room not found or invalid code.' });
            }
        } catch (error) {
            console.error("[ERROR] Initial map data fetch/initialization:", error);
            socket.emit('action_error', { message: 'Failed to load or initialize game data.' });
        }
    });

    socket.on('cardPlacedAction', async (data) => {
        const { room, coordinate, element, value, key, playerName } = data;

        try {
            const [rows] = await pool.execute(
                `SELECT * FROM map_data INNER JOIN room WHERE room_id = ?`,
                [room]
            );
            if (rows.length === 0) throw new Error("Room data not found.");

            const boardData = rows[0];
            const map = boardData.map;

            if (boardData[boardData.turn] !== playerName) {
                return socket.emit('action_error', { message: 'Not your turn.' });
            }

            let handColumn = (playerName === boardData.playerA) ? "handA" : "handB";
            let nextTurnPlayer = (playerName === boardData.playerA) ? "playerB" : "playerA";

            let jsonPaths = [];
            let queryValues = [];

            const collectUpdates = (coord, newValue, isParent = false, isClear = false, parentElement = "") => {
                const col = parseInt(coord.substring(1), 10);
                const rowChar = coord.charAt(0);
                const rowIndex = rowChar.charCodeAt(0);
                const offsets = [[0, 1], [0, -1], [1, 0], [-1, 0]];

                const elementToSet = isParent ? parentElement : element;
                const parentForNeighbors = isClear ? "" : coord;

                jsonPaths.push(`'${'$.' + coord + '.element'}', ?`);
                queryValues.push(elementToSet);

                jsonPaths.push(`'${'$.' + coord + '.value'}', ?`);
                queryValues.push(newValue);

                jsonPaths.push(`'${'$.' + coord + '.parent'}', ?`);
                queryValues.push("");

                if (!isParent) {
                    jsonPaths.push(`'${'$.' + coord + '.bond'}', ?`);
                    queryValues.push(value);
                }

                for (const [rOffset, cOffset] of offsets) {
                    const newRowIndex = rowIndex + rOffset;
                    const newCol = col + cOffset;

                    if (newRowIndex >= 'A'.charCodeAt(0) && newRowIndex <= 'I'.charCodeAt(0) &&
                        newCol >= 1 && newCol <= 15) {

                        const newCoord = String.fromCharCode(newRowIndex) + newCol;

                        jsonPaths.push(`'${'$.' + newCoord + '.value'}', ?`);
                        queryValues.push(newValue);

                        jsonPaths.push(`'${'$.' + newCoord + '.parent'}', ?`);
                        queryValues.push(parentForNeighbors);
                    }
                }
            }

            const parentCoord = map[coordinate].parent;
            if (parentCoord !== "" && parentCoord !== null) {
                const parentValue = map[coordinate].value;
                const parentElement = map[parentCoord].element;
                let resultValue = value - parentValue;

                if (resultValue === 0) {
                    collectUpdates(coordinate, 0, false, true);
                    collectUpdates(parentCoord, 0, true, true, parentElement);

                } else if (resultValue < 0) {
                    collectUpdates(coordinate, 0, false, true);
                    collectUpdates(parentCoord, Math.abs(resultValue), true, false, parentElement);

                } else if (resultValue > 0) {
                    collectUpdates(coordinate, resultValue, false);
                    collectUpdates(parentCoord, 0, true, true, parentElement);
                }
            }

            let finalJsonSetString = `map = JSON_SET(map, ${jsonPaths.join(',\n')})`;
            queryValues.push(nextTurnPlayer, room);

            const updateQuery = `
                UPDATE map_data 
                SET ${finalJsonSetString},
                    ${handColumn} = JSON_REMOVE(${handColumn}, '$."${key}"'), 
                    turn = ? 
                WHERE room_id = ?`;

            await pool.execute(updateQuery, queryValues);

            const [updatedRows] = await pool.execute(
                `SELECT * FROM map_data INNER JOIN room WHERE room_id = ?`,
                [room]
            );

            const updatedRowData = updatedRows[0];

            let drawACard = `hand${updatedRowData.turn.slice(6)}`;
            let newMap = updatedRowData.map;
            let handA = updatedRowData.handA;
            let handB = updatedRowData.handB;
            let winner = updatedRowData.winner;

            for (const keyMap in updatedRowData.map) {
                if (updatedRowData.map.hasOwnProperty(keyMap)) {
                    const keyValue = updatedRowData.map[keyMap];
                    if ((keyValue.value !== 0 && keyValue.value !== null) && keyValue.element === "") {
                        drawACard = null
                    }
                }
            }

            if (drawACard !== null) {
                console.log(`[DB] Initializing map_data for room: ${room}`);

                const gameData = await gameInitializer.resetBoard();
                const drawACard_ = await gameInitializer.drawACard();
                const cardID = Object.keys(drawACard_)[0];
                const cardData = Object.values(drawACard_)[0];
                const jsonPath = `$."${cardID}"`;

                const insertQuery = `
                    UPDATE map_data SET map = ?, ${drawACard} = json_set(${drawACard}, ?, CAST(? AS JSON)) WHERE room_id = ?`;

                await pool.execute(insertQuery, [
                    JSON.stringify(gameData.map),
                    jsonPath,
                    cardData,
                    room
                ]);

                newMap = gameData.map
            }

            if (Object.keys(handA).length === 0) {
                const query = `
                UPDATE map_data SET winner = ? WHERE room_id = ?`;

                await pool.execute(query, [
                    "playerA",
                    room
                ]);
                winner = "playerA"
            } else if (Object.keys(handB).length === 0) {
                const query = `
                UPDATE map_data SET winner = ? WHERE room_id = ?`;

                await pool.execute(query, [
                    "playerB",
                    room
                ]);
                winner = "playerB"
            }

            const newMapData = {
                ...updatedRowData,
                map: newMap,
                handA: handA,
                handB: handB,
                turn: updatedRowData.turn,
                winner: winner
            };

            io.to(room).emit('gameUpdate', newMapData);

        } catch (error) {
            console.error(`[ERROR] Card placement in room ${room}:`, error);
            socket.emit('action_error', { message: 'Server failed to process your move.' });
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`HTTP Server (and Socket.io) listening on port ${SERVER_PORT}`);
});
