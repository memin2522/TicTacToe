// src/app/index.tsx

import { Board } from "@/components/board";
import { Difficulty, GameStatus } from "@/constants/tic-tac-toe";
import { useTicTacToe } from "@/hooks/use-tic-tac-toe";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOARD_BACKGROUND = "#1B1F3B";
const CHALK_WHITE = "#F5F1E8";
const CHALK_WHITE_DIM = "#F5F1E866";

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty }[] = [
    { label: "Fácil", value: Difficulty.EASY },
    { label: "Medio", value: Difficulty.MEDIUM },
    { label: "Difícil", value: Difficulty.HARD },
];

export default function GameScreen() {
    const { board, status, isHumanTurn, difficulty, onCellClicked, resetGame, changeDifficulty } =
        useTicTacToe();

    let statusText: string;
    switch (status) {
        case GameStatus.TIE:
            statusText = "It's a tie.";
            break;
        case GameStatus.HUMAN_WON:
            statusText = "You win!";
            break;
        case GameStatus.COMPUTER_WON:
            statusText = "Computer wins!";
            break;
        default:
            statusText = isHumanTurn ? "Your turn" : "Computer is thinking…";
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.status}>{statusText}</Text>

                <View style={styles.difficultyRow}>
                    {DIFFICULTY_OPTIONS.map((option) => {
                        const isSelected = option.value === difficulty;
                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => changeDifficulty(option.value)}
                                style={[styles.difficultyButton, isSelected && styles.difficultyButtonSelected]}
                            >
                                <Text
                                    style={[
                                        styles.difficultyText,
                                        isSelected && styles.difficultyTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Board board={board} status={status} onCellPress={onCellClicked} />

                <Pressable onPress={resetGame} style={styles.resetButton}>
                    <Text style={styles.resetText}>Reset</Text>
                </Pressable>
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
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    status: {
        fontSize: 22,
        fontWeight: "600",
        color: CHALK_WHITE,
        marginBottom: 24,
    },
    difficultyRow: {
        flexDirection: "row",
        marginBottom: 24,
        gap: 8,
    },
    difficultyButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: CHALK_WHITE_DIM,
    },
    difficultyButtonSelected: {
        backgroundColor: CHALK_WHITE,
        borderColor: CHALK_WHITE,
    },
    difficultyText: {
        color: CHALK_WHITE,
        fontSize: 14,
        fontWeight: "500",
    },
    difficultyTextSelected: {
        color: BOARD_BACKGROUND,
    },
    resetButton: {
        marginTop: 24,
        padding: 8,
    },
    resetText: {
        color: CHALK_WHITE,
        fontSize: 16,
    },
});