import { useCallback, useEffect, useRef, useState } from "react";
import { COMPUTER_PLAYER, GameStatus, HUMAN_PLAYER, } from "../constants/tic-tac-toe";
import { TicTacToeEngine } from "./tic-tac-toe-engine";

const COMPUTER_MOVE_DELAY = 0;

export function useTicTacToe() {
    const engineRef = useRef<TicTacToeEngine>(new TicTacToeEngine());
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [board, setBoard] = useState(() => engineRef.current.getBoardCopy());
    const [status, setStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
    const [isHumanTurn, setIsHumanTurn] = useState(true);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const makeComputerMove = useCallback(() => {
        const engine = engineRef.current;
        const move = engine.getComputerMove();
        engine.setMove(COMPUTER_PLAYER, move);
        setBoard(engine.getBoardCopy());

        const result = engine.checkForWinner();
        if (result !== GameStatus.IN_PROGRESS) {
            setStatus(result);
        } else {
            setIsHumanTurn(true);
        }
    }, []);

    const onCellClicked = useCallback(
        (location: number) => {
            if (!isHumanTurn || status !== GameStatus.IN_PROGRESS) return;

            const engine = engineRef.current;
            engine.setMove(HUMAN_PLAYER, location);
            setBoard(engine.getBoardCopy());

            const result = engine.checkForWinner();
            if (result !== GameStatus.IN_PROGRESS) {
                setStatus(result);
                return;
            }

            setIsHumanTurn(false);
            timeoutRef.current = setTimeout(makeComputerMove, COMPUTER_MOVE_DELAY);
        },
        [isHumanTurn, status, makeComputerMove]
    );

    const resetGame = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        engineRef.current.clearBoard();
        setBoard(engineRef.current.getBoardCopy());
        setStatus(GameStatus.IN_PROGRESS);
        setIsHumanTurn(true);
    }, []);

    return { board, status, isHumanTurn, onCellClicked, resetGame };
}