import Piece from "./Piece";

export default class Elephant extends Piece {
    constructor(shortName, isRed) {
        super(shortName, isRed);
    }

    isValidMove(board, from, to) {
        return super.isValidMove(board, from, to);
    }

}