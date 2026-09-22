export enum GameStatus {
    IN_PROGRESS = 0,
    TIE = 1,
    HUMAN_WON = 2,
    COMPUTER_WON = 3
}

export enum Difficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2
}

export const BOARD_SIZE = 9;
export const OPEN_SPOT = " ";
export const HUMAN_PLAYER = "X";
export const COMPUTER_PLAYER = "O";
