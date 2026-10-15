import { useEffect, useState } from "react";
import { auth, onAuthStateChanged, signInAnonymously } from "@/lib/firebase";

let signInPromise: Promise<unknown> | null = null;

function ensureSignedIn() {
    if (!signInPromise) {
        signInPromise = signInAnonymously(auth).catch((error) => {
            signInPromise = null;
            throw error;
        });
    }
    return signInPromise;
}

export function useAuth() {
    const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                setError(null);
            } else {
                setUid(null);
                ensureSignedIn().catch((e) => setError(e?.code ?? String(e)));
            }
        });
        return unsubscribe;
    }, []);

    return { uid, error };
}