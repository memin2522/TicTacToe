import { BOARD_SIZE, OPEN_SPOT } from "../constants/tic-tac-toe";

export type Mark = "X" | "O";
export type BoardResult = Mark | "tie" | null;

const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function evaluateBoard(board: string[]): BoardResult {
    for (const [a, b, c] of WINNING_LINES) {
        const mark = board[a];
        if (mark !== OPEN_SPOT && mark === board[b] && mark === board[c]) {
            return mark as Mark;
        }
    }

    const isFull = board.length === BOARD_SIZE && board.every((cell) => cell !== OPEN_SPOT);
    return isFull ? "tie" : null;
}