import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { COMPUTER_PLAYER, Difficulty, GameStatus, HUMAN_PLAYER } from "../constants/tic-tac-toe";
import { TicTacToeEngine } from "./tic-tac-toe-engine";
import { useGameSounds } from "./use-game-sound";

const COMPUTER_MOVE_DELAY: Record<Difficulty, number> = {
    [Difficulty.EASY]: 900,
    [Difficulty.MEDIUM]: 500,
    [Difficulty.HARD]: 200,
};

const SCORES_STORAGE_KEY = "tic-tac-toe:scores";

interface StoredScores {
    humanWins: number;
    computerWins: number;
    ties: number;
}

export function useTicTacToe() {
    const engineRef = useRef<TicTacToeEngine>(new TicTacToeEngine());
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { playMove, playTie, playVictory, playDefeat } = useGameSounds();

    const [board, setBoard] = useState(() => engineRef.current.getBoardCopy());
    const [status, setStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
    const [isHumanTurn, setIsHumanTurn] = useState(true);
    const [difficulty, setDifficulty] = useState(engineRef.current.getDifficulty());

    const [humanWins, setHumanWins] = useState(0);
    const [computerWins, setComputerWins] = useState(0);
    const [ties, setTies] = useState(0);
    const [scoresLoaded, setScoresLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(SCORES_STORAGE_KEY)
            .then((raw) => {
                if (raw) {
                    const stored: StoredScores = JSON.parse(raw);
                    setHumanWins(stored.humanWins);
                    setComputerWins(stored.computerWins);
                    setTies(stored.ties);
                }
            })
            .finally(() => setScoresLoaded(true));
    }, []);

    useEffect(() => {
        if (!scoresLoaded) return;
        const scores: StoredScores = { humanWins, computerWins, ties };
        AsyncStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
    }, [humanWins, computerWins, ties, scoresLoaded]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const registerResult = useCallback((result: GameStatus) => {
        if (result === GameStatus.HUMAN_WON) {
            setHumanWins((wins) => wins + 1);
        } else if (result === GameStatus.COMPUTER_WON) {
            setComputerWins((wins) => wins + 1);
        } else if (result === GameStatus.TIE) {
            setTies((count) => count + 1);
        }
    }, []);

    const makeComputerMove = useCallback(() => {
        const engine = engineRef.current;
        const move = engine.getComputerMove();
        engine.setMove(COMPUTER_PLAYER, move);
        playMove();
        setBoard(engine.getBoardCopy());

        const result = engine.checkForWinner();
        if (result !== GameStatus.IN_PROGRESS) {
            setStatus(result);
            registerResult(result);
            if (result === GameStatus.COMPUTER_WON) {
                playDefeat();
            } else if (result === GameStatus.TIE) {
                playTie();
            }
        } else {
            setIsHumanTurn(true);
        }
    }, [playMove, playDefeat, playTie, registerResult]);

    const onCellClicked = useCallback(
        (location: number) => {
            if (!isHumanTurn || status !== GameStatus.IN_PROGRESS) return;

            const engine = engineRef.current;
            engine.setMove(HUMAN_PLAYER, location);
            playMove();
            setBoard(engine.getBoardCopy());

            const result = engine.checkForWinner();
            if (result !== GameStatus.IN_PROGRESS) {
                setStatus(result);
                registerResult(result);
                if (result === GameStatus.HUMAN_WON) {
                    playVictory();
                } else if (result === GameStatus.TIE) {
                    playTie();
                }
                return;
            }

            setIsHumanTurn(false);
            const delay = COMPUTER_MOVE_DELAY[engine.getDifficulty()];
            timeoutRef.current = setTimeout(makeComputerMove, delay);
        },
        [isHumanTurn, status, makeComputerMove, playMove, playVictory, playTie, registerResult]
    );

    const resetGame = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        engineRef.current.clearBoard();
        setBoard(engineRef.current.getBoardCopy());
        setStatus(GameStatus.IN_PROGRESS);
        setIsHumanTurn(true);
    }, []);

    const changeDifficulty = useCallback((next: Difficulty) => {
        engineRef.current.setDifficulty(next);
        setDifficulty(next);
    }, []);

    return {
        board,
        status,
        isHumanTurn,
        onCellClicked,
        resetGame,
        changeDifficulty,
        difficulty,
        humanWins,
        computerWins,
        ties,
    };
}