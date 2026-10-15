import {
    addDoc,
    collection,
    DocumentData,
    onSnapshot,
    query,
    serverTimestamp,
    where,
    doc,
    runTransaction,
    DocumentSnapshot,
} from "firebase/firestore";
import { BOARD_SIZE, OPEN_SPOT } from "../constants/tic-tac-toe";
import { db } from "@/lib/firebase";
import { evaluateBoard, type BoardResult, type Mark } from "@/lib/board-logic";

const GAMES_COLLECTION = "games";

export type OnlineStatus = "waiting" | "playing" | "finished";

export interface OnlineGame {
    id: string;
    status: OnlineStatus;
    board: string;
    hostId: string;
    guestId: string | null;
    turn: Mark;
    winner: BoardResult;
    createdAtMs: number;
}

function toGame(snap: DocumentSnapshot<DocumentData>): OnlineGame {
    const data = snap.data({ serverTimestamps: "estimate" })!;
    return {
        id: snap.id,
        status: data.status,
        board: data.board,
        hostId: data.hostId,
        guestId: data.guestId ?? null,
        turn: data.turn,
        winner: data.winner ?? null,
        createdAtMs: data.createdAt?.toMillis?.() ?? Date.now(),
    };
}

export async function createGame(uid: string): Promise<string> {
    const ref = await addDoc(collection(db, GAMES_COLLECTION), {
        status: "waiting",
        board: OPEN_SPOT.repeat(BOARD_SIZE),
        hostId: uid,
        guestId: null,
        turn: "X",
        winner: null,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export function subscribeToWaitingGames(
    onChange: (games: OnlineGame[]) => void,
    onError?: (error: Error) => void
) {
    const q = query(collection(db, GAMES_COLLECTION), where("status", "==", "waiting"));
    return onSnapshot(
        q,
        (snapshot) => {
            const games = snapshot.docs
                .map(toGame)
                .sort((a, b) => b.createdAtMs - a.createdAtMs);
            onChange(games);
        },
        onError
    );
}

export async function joinGame(gameId: string, uid: string): Promise<void> {
    const ref = doc(db, GAMES_COLLECTION, gameId);

    await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe");

        const data = snap.data();
        if (data.hostId === uid) throw new Error("No podés unirte a tu propia partida");
        if (data.status !== "waiting" || data.guestId !== null) {
            throw new Error("La partida ya no está disponible");
        }

        tx.update(ref, { guestId: uid, status: "playing" });
    });
}

export function subscribeToGame(
    gameId: string,
    onChange: (game: OnlineGame | null) => void,
    onError?: (error: Error) => void
) {
    return onSnapshot(
        doc(db, GAMES_COLLECTION, gameId),
        (snap) => onChange(snap.exists() ? toGame(snap) : null),
        onError
    );
}

export async function makeMove(gameId: string, uid: string, index: number): Promise<void> {
    const ref = doc(db, GAMES_COLLECTION, gameId);

    await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("La partida ya no existe");

        const data = snap.data();
        if (data.status !== "playing") throw new Error("La partida no está en juego");

        const mark: Mark | null =
            data.hostId === uid ? "X" : data.guestId === uid ? "O" : null;
        if (!mark) throw new Error("No sos parte de esta partida");
        if (data.turn !== mark) throw new Error("No es tu turno");
        if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
            throw new Error("Celda inválida");
        }

        const cells: string[] = data.board.split("");
        if (cells[index] !== OPEN_SPOT) throw new Error("La celda ya está ocupada");

        cells[index] = mark;
        const result = evaluateBoard(cells);

        tx.update(ref, {
            board: cells.join(""),
            turn: mark === "X" ? "O" : "X",
            status: result ? "finished" : "playing",
            winner: result,
        });
    });
}