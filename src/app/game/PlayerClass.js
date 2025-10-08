export default class playerClass {

    #selectedCard;

    constructor(playerName) {
        this.playerName = playerName;
        this.#selectedCard = null;
    }

    async drawACard(){
        await fetch(`/api/map_data?draw=${this.playerName}`, {method: 'POST'});
    }

    selectCard(element, key, value) {
        this.#selectedCard = { element, key, value };
    }

    placeCard(coord, room, socket) {
        if (!this.#selectedCard || !socket || !room) {
            console.error("Card, socket, or room missing for placement.");
            return;
        }
        
        const { element, key, value } = this.#selectedCard;

        socket.emit('cardPlacedAction', {
            room: room,
            playerName: this.playerName,
            coordinate: coord,
            element: element,
            value: value,
            key: key,
        });

        this.#selectedCard = null;
    }
}