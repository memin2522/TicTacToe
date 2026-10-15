import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board } from "@/components/board";
import { GameStatus } from "@/constants/tic-tac-toe";
import { useAuth } from "@/hooks/use-auth";
import { useOnlineGame } from "@/hooks/use-online-game";

const BOARD_BACKGROUND = "#1B1F3B";
const CHALK_WHITE = "#F5F1E8";
const CHALK_WHITE_DIM = "#F5F1E866";

// Board solo acepta toques cuando recibe IN_PROGRESS. Cualquier otro valor lo bloquea.
const BOARD_UNLOCKED = GameStatus.IN_PROGRESS;
const BOARD_LOCKED = GameStatus.TIE;

export default function OnlineGameScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { uid } = useAuth();
    const { game, loading, error, moveError, mySymbol, isMyTurn, onCellPress } =
        useOnlineGame(id, uid);

    const [boardAreaSize, setBoardAreaSize] = useState({ width: 0, height: 0 });
    const onBoardAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setBoardAreaSize({ width, height });
    };
    const boardSize = Math.min(boardAreaSize.width, boardAreaSize.height);

    const backButton = (
        <Pressable style={styles.button} onPress={() => router.replace("/")}>
            <Text style={styles.buttonText}>Back to Menu</Text>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.centered}>
                    <Text style={styles.status}>Loading game…</Text>
                </SafeAreaView>
            </View>
        );
    }

    if (error || !game) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.centered}>
                    <Text style={styles.status}>
                        {error ? `Error: ${error}` : "The game no longer exists"}
                    </Text>
                    {backButton}
                </SafeAreaView>
            </View>
        );
    }

    if (!mySymbol) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.centered}>
                    <Text style={styles.status}>This game is for other players</Text>
                    {backButton}
                </SafeAreaView>
            </View>
        );
    }

    if (game.status === "waiting") {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.centered}>
                    <Text style={styles.status}>Waiting for opponent…</Text>
                    <Text style={styles.meta}>Game {game.id.slice(0, 4)}</Text>
                    {backButton}
                </SafeAreaView>
            </View>
        );
    }

    let statusText: string;
    if (game.status === "finished") {
        if (game.winner === "tie") statusText = "Tie";
        else if (game.winner === mySymbol) statusText = "You won!";
        else statusText = "You lost";
    } else {
        statusText = isMyTurn ? "Your turn" : "Opponent's turn…";
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.status}>{statusText}</Text>
                <Text style={styles.meta}>Play with {mySymbol}</Text>

                <View style={styles.boardSection} onLayout={onBoardAreaLayout}>
                    {boardSize > 0 && (
                        <Board
                            size={boardSize}
                            board={game.board.split("")}
                            status={isMyTurn ? BOARD_UNLOCKED : BOARD_LOCKED}
                            onCellPress={onCellPress}
                        />
                    )}
                </View>

                {moveError && <Text style={styles.errorText}>{moveError}</Text>}

                {game.status === "finished" && <View style={styles.footer}>{backButton}</View>}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BOARD_BACKGROUND,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },
    safeArea: {
        flex: 1,
        padding: 24,
        gap: 8,
    },
    boardSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        alignItems: "center",
    },
    status: {
        color: CHALK_WHITE,
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
    },
    meta: {
        color: CHALK_WHITE_DIM,
        fontSize: 14,
        textAlign: "center",
    },
    errorText: {
        color: "#FF6B5B",
        fontSize: 13,
        textAlign: "center",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CHALK_WHITE_DIM,
    },
    buttonText: {
        color: CHALK_WHITE,
        fontSize: 16,
        fontWeight: "600",
    },
});