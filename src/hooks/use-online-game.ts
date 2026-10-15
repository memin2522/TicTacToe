import { useCallback, useEffect, useRef, useState } from "react";
import type { Mark } from "@/lib/board-logic";
import { makeMove, OnlineGame, subscribeToGame } from "@/services/games";

export function useOnlineGame(gameId: string, uid: string | null) {
    const [game, setGame] = useState<OnlineGame | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [moveError, setMoveError] = useState<string | null>(null);
    const movingRef = useRef(false);

    useEffect(() => {
        if (!uid) return;

        const unsubscribe = subscribeToGame(
            gameId,
            (g) => {
                setGame(g);
                setLoading(false);
                setError(null);
            },
            (e) => {
                setError(e.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, [gameId, uid]);

    let mySymbol: Mark | null = null;
    if (game && uid) {
        if (game.hostId === uid) mySymbol = "X";
        else if (game.guestId === uid) mySymbol = "O";
    }

    const isMyTurn =
        game?.status === "playing" && mySymbol !== null && game.turn === mySymbol;

    const onCellPress = useCallback(
        async (index: number) => {
            if (!uid || !game || !isMyTurn || movingRef.current) return;

            movingRef.current = true;
            setMoveError(null);
            try {
                await makeMove(game.id, uid, index);
            } catch (e: any) {
                setMoveError(e?.message ?? String(e));
            } finally {
                movingRef.current = false;
            }
        },
        [uid, game, isMyTurn]
    );

    return { game, loading, error, moveError, mySymbol, isMyTurn, onCellPress };
}