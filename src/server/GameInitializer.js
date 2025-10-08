// src/server/GameInitializer.js

const path = require('path');
// ⚠️ ปรับ Path ของ Pool/CodeGenerator ให้ถูกต้องจากมุมมองของไฟล์ GameInitializer.js
const pool = require('../../lib/MySql'); 
const generateCardID = async(lenght) => {return Math.random().toString(36).substring(2, 2 + lenght);}

// ----------------------------------------------------------------
// ⚠️ DUMMY DB ACCESS/CARD PULLER - ต้องปรับปรุงให้ดึงจาก DB จริง
// ----------------------------------------------------------------
const getRandomCardFromDB = async () => {
    // ⚠️ แทนที่ด้วย Query ที่สุ่มดึงการ์ด 1 ใบจากตาราง cards/elements
    try {
        // สุ่มเลข ID การ์ดระหว่าง 1 ถึง 38
        const randomId = Math.floor(Math.random() * (38 - 1 + 1)) + 1;
        
        // 🚨 สมมติว่าตาราง `element_lib` มีคอลัมน์ element และ value
        const [rows] = await pool.execute(
            `SELECT element, value FROM element_lib WHERE id = ?`, 
            [randomId]
        );
        
        if (rows.length === 0) throw new Error("Card element not found in DB.");
        
        return {
            element: rows[0].element,
            value: rows[0].value,
        };
    } catch (error) {
        console.error("DB Error fetching random card:", error);
        throw new Error("Failed to fetch card from database.");
    }
};

class GameInitializer {
    async handStarter() {
        const hand = {};
        for (let i = 0; i < 5; i++) {
            try {
                const data = await getRandomCardFromDB();
                const cardID = await generateCardID(4);

                hand[cardID] = {
                    "element": data.element,
                    "max_value": data.value,
                    "value": data.value
                };
            } catch (error) {
                throw error;
            }
        }
        return hand;
    }

    createInitialGameBoardJSON() {
        const boardData = {};
        const startChar = 'A'.charCodeAt(0);
        const endChar = 'I'.charCodeAt(0); 

        for (let i = startChar; i <= endChar; i++) {
            const rowChar = String.fromCharCode(i);

            for (let j = 1; j <= 15; j++) { 
                const gridKey = `${rowChar}${j}`;

                boardData[gridKey] = {
                    "element": "",
                    "parent": "",
                    "bond": null,
                    "value": null,
                };
            }
        }
        return boardData;
    }

    async prepareGame() {
        const initialMap = this.createInitialGameBoardJSON();
        const turn = `player${Math.random() < 0.5 ? "A" : "B"}`;
        
        const startCard = await getRandomCardFromDB();
        
        const centralCoord = 'E8'; 
        const childCoord = ["E7", "E9", "D8", "F8"]
        
        initialMap[centralCoord] = {
            "element": startCard.element,
            "parent": "",            
            "bond": startCard.value,
            "value": startCard.value,
        };

        childCoord.forEach(coord => {
            if (initialMap[coord]) {
                initialMap[coord] = {
                    "element": "",
                    "parent": centralCoord,
                    "bond": null,
                    "value": startCard.value,
                };
            }
        });

        const handA = await this.handStarter();
        const handB = await this.handStarter();

        return {
            map: initialMap,
            handA: handA,
            handB: handB,
            turn: turn
        };
    }
}

module.exports = GameInitializer;