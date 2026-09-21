import { BOARD_SIZE, COMPUTER_PLAYER, GameStatus, HUMAN_PLAYER, OPEN_SPOT } from "../constants/tic-tac-toe";

export class TicTacToeEngine {
    private board = Array(BOARD_SIZE).fill(OPEN_SPOT);

    getBoardCopy() {
        return [...this.board];
    }

    setMove(player: string, location: number) {
        if (this.board[location] === OPEN_SPOT) {
            this.board[location] = player;
        }
    }

    getComputerMove(): number {
        //Search for a Winning Move
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (this.board[i] !== HUMAN_PLAYER && this.board[i] !== COMPUTER_PLAYER) {
                this.board[i] = COMPUTER_PLAYER;
                const result = this.checkForWinner();
                this.board[i] = OPEN_SPOT;

                if (result === GameStatus.COMPUTER_WON) {
                    return i;
                }
            }
        }

        //Search for a Blocking Move
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (this.board[i] !== HUMAN_PLAYER && this.board[i] !== COMPUTER_PLAYER) {
                this.board[i] = HUMAN_PLAYER;
                const result = this.checkForWinner();
                this.board[i] = OPEN_SPOT;

                if (result === GameStatus.HUMAN_WON) {
                    return i;
                }
            }
        }

        //Random Move
        let move: number;
        do {
            move = Math.floor(Math.random() * BOARD_SIZE);
        } while (this.board[move] === HUMAN_PLAYER || this.board[move] === COMPUTER_PLAYER);

        return move;
    }

    checkForWinner(): GameStatus {
        for (let i = 0; i <= 6; i += 3) {
            if (this.board[i] === HUMAN_PLAYER &&
                this.board[i + 1] === HUMAN_PLAYER &&
                this.board[i + 2] === HUMAN_PLAYER)
                return GameStatus.HUMAN_WON;

            if (this.board[i] === COMPUTER_PLAYER &&
                this.board[i + 1] === COMPUTER_PLAYER &&
                this.board[i + 2] === COMPUTER_PLAYER)
                return GameStatus.COMPUTER_WON;
        }

        for (let i = 0; i <= 2; i++) {
            if (this.board[i] === HUMAN_PLAYER &&
                this.board[i + 3] === HUMAN_PLAYER &&
                this.board[i + 6] === HUMAN_PLAYER)
                return GameStatus.HUMAN_WON;
            if (this.board[i] === COMPUTER_PLAYER &&
                this.board[i + 3] === COMPUTER_PLAYER &&
                this.board[i + 6] === COMPUTER_PLAYER)
                return GameStatus.COMPUTER_WON;
        }

        // Diagonales
        if ((this.board[0] === HUMAN_PLAYER && this.board[4] === HUMAN_PLAYER && this.board[8] === HUMAN_PLAYER) ||
            (this.board[2] === HUMAN_PLAYER && this.board[4] === HUMAN_PLAYER && this.board[6] === HUMAN_PLAYER))
            return GameStatus.HUMAN_WON;

        if ((this.board[0] === COMPUTER_PLAYER && this.board[4] === COMPUTER_PLAYER && this.board[8] === COMPUTER_PLAYER) ||
            (this.board[2] === COMPUTER_PLAYER && this.board[4] === COMPUTER_PLAYER && this.board[6] === COMPUTER_PLAYER))
            return GameStatus.COMPUTER_WON;

        // Si queda alguna casilla libre, el juego continúa
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (this.board[i] !== HUMAN_PLAYER && this.board[i] !== COMPUTER_PLAYER) {
                return GameStatus.IN_PROGRESS;
            }
        }

        // Ninguna casilla libre y ningún ganador: empate
        return GameStatus.TIE;
    }

    clearBoard() {
        this.board.fill(OPEN_SPOT);
    }
}

