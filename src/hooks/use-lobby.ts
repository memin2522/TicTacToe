import { useEffect, useState } from "react";
import { OnlineGame, subscribeToWaitingGames } from "@/services/games";

export function useLobby(uid: string | null) {
    const [games, setGames] = useState<OnlineGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) return;

        const unsubscribe = subscribeToWaitingGames(
            (list) => {
                setGames(list);
                setLoading(false);
                setError(null);
            },
            (e) => {
                setError(e.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, [uid]);

    return { games, loading, error };
}