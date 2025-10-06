export default class playerClass {
    #hand
    #selectedCard

    constructor(playerName){
        this.playerName = playerName;
        this.#selectedCard = {};
        this.#hand = 5;
    }

    draw(){}

    selectCard(element, key, value){
        this.#selectedCard.element = element;
        this.#selectedCard.key = key;
        this.#selectedCard.value = value;
    }

    async place(coord){
        if (!this.#selectedCard.element || !this.#selectedCard.value){return}
        try {
            const data = {coordinate:coord, element:this.#selectedCard.element, 
                value:this.#selectedCard.value, key:this.#selectedCard.key};

            await fetch(`/api/map_data?set=place`, {
            method: "POST",
            body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Polling error:", error);
        }
        this.#selectedCard = {}
    }
}