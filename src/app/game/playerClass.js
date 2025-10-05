export default class playerClass {
    #hand
    #selectedCard

    constructor(playerName){
        this.playerName = playerName;
        this.#selectedCard = {};
        this.#hand = 5;
    }

    selectCard(name, key){
        this.#selectedCard.name = name;
        this.#selectedCard.key = key;
    }

    draw(){

    }
}