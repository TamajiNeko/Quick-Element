export default class boardManager {
    createInitialGameBoardJSON = () => {
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
                    "value": null
                };
            }
        }
        
        return boardData;
    }

    prepareGame = async () => {
        try {
            let start = await fetch(`/api/element_lib?element=${Math.floor(Math.random() * (38 - 1 + 1)) + 1}`);

            if (!start.ok) {
                throw new Error("Room Not Found in Server");
            }

            const data = await start.json();
            data.coordinate = 'E8';
            await fetch(`/api/map_data?set=start`, {
                method: "POST",
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Polling error:", error);
        }
    }
}