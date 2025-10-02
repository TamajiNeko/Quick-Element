export default class playerClass {
    #hand

    constructor(playerName, selectedCard){
        this.playerName = playerName;
        this.selectedCard = selectedCard;
        this.#hand = 5;
    }

    draw(){}
}