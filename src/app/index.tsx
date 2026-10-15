import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameListItem } from "@/components/game-list-item";
import { useAuth } from "@/hooks/use-auth";
import { useLobby } from "@/hooks/use-lobby";
import { createGame, joinGame } from "@/services/games";

const BOARD_BACKGROUND = "#1B1F3B";
const CHALK_WHITE = "#F5F1E8";
const CHALK_WHITE_DIM = "#F5F1E866";

export default function MenuScreen() {
    const router = useRouter();
    const { uid, error: authError } = useAuth();
    const { games, loading, error: lobbyError } = useLobby(uid);

    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    const onCreateGame = async () => {
        if (!uid || creating) return;
        setCreating(true);
        setCreateError(null);
        try {
            const gameId = await createGame(uid);
            router.push({ pathname: "/game/[id]", params: { id: gameId } });
        } catch (e: any) {
            setCreateError(e?.code ?? String(e));
        } finally {
            setCreating(false);
        }
    };

    const onGamePress = async (gameId: string, isMine: boolean) => {
        if (!uid || joining) return;
        setCreateError(null);

        if (isMine) {
            router.push({ pathname: "/game/[id]", params: { id: gameId } });
            return;
        }

        setJoining(true);
        try {
            await joinGame(gameId, uid);
            router.push({ pathname: "/game/[id]", params: { id: gameId } });
        } catch (e: any) {
            setCreateError(e?.message ?? String(e));
        } finally {
            setJoining(false);
        }
    };

    const errorText = authError ?? lobbyError ?? createError;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.title}>Tic Tac Toe</Text>

                <Pressable style={styles.button} onPress={() => router.push("/local")}>
                    <Text style={styles.buttonText}>Play Against CPU</Text>
                </Pressable>

                <Text style={styles.sectionTitle}>Online Games</Text>

                <Pressable
                    style={[styles.button, (!uid || creating) && styles.buttonDisabled]}
                    onPress={onCreateGame}
                    disabled={!uid || creating}
                >
                    <Text style={styles.buttonText}>
                        {creating ? "Creating…" : "Create Game"}
                    </Text>
                </Pressable>

                {errorText && <Text style={styles.errorText}>Error: {errorText}</Text>}

                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    data={games}
                    keyExtractor={(game) => game.id}
                    renderItem={({ item }) => (
                        <GameListItem
                            game={item}
                            isMine={item.hostId === uid}
                            disabled={!uid || joining}
                            onPress={() => onGamePress(item.id, item.hostId === uid)}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {loading ? "Loading games…" : "No games available"}
                        </Text>
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BOARD_BACKGROUND,
    },
    safeArea: {
        flex: 1,
        padding: 24,
        gap: 16,
    },
    title: {
        fontSize: 40,
        fontWeight: "700",
        color: CHALK_WHITE,
        textAlign: "center",
        marginBottom: 8,
    },
    sectionTitle: {
        color: CHALK_WHITE_DIM,
        fontSize: 13,
        textTransform: "uppercase",
        marginTop: 8,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CHALK_WHITE_DIM,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        color: CHALK_WHITE,
        fontSize: 18,
        fontWeight: "600",
    },
    errorText: {
        color: "#FF6B5B",
        fontSize: 13,
    },
    list: {
        flex: 1,
    },
    listContent: {
        gap: 10,
    },
    emptyText: {
        color: CHALK_WHITE_DIM,
        textAlign: "center",
        marginTop: 24,
    },
});