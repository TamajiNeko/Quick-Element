export default class playerClass {

    #selectedCard;

    constructor(playerName) {
        this.playerName = playerName;
        this.#selectedCard = null;
    }

    async drawACard(room, socket){
        if (!this.playerName || !room || !socket) {
            console.error("Player name, socket, or room missing for Drawing.");
            return;
        }
        socket.emit('drawACard', {
            room: room,
            playerName: this.playerName
        });
    }

    selectCard(element, key, value, group) {
        this.#selectedCard = { element, key, value, group };
    }

    placeCard(coord, room, socket) {
        if (!this.#selectedCard || !socket || !room) {
            console.error("Card, socket, or room missing for placement.");
            return;
        }
        
        const { element, key, value, group } = this.#selectedCard;

        socket.emit('cardPlacedAction', {
            room: room,
            playerName: this.playerName,
            coordinate: coord,
            element: element,
            value: value,
            group: group,
            key: key,
        });

        this.#selectedCard = null;
    }
}