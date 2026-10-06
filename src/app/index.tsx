// src/app/index.tsx

import { Board } from "@/components/board";
import { Difficulty, GameStatus } from "@/constants/tic-tac-toe";
import { useTicTacToe } from "@/hooks/use-tic-tac-toe";
import { useState } from "react";
import {
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOARD_BACKGROUND = "#1B1F3B";
const CHALK_WHITE = "#F5F1E8";
const CHALK_WHITE_DIM = "#F5F1E866";

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty }[] = [
    { label: "Easy", value: Difficulty.EASY },
    { label: "Medium", value: Difficulty.MEDIUM },
    { label: "Hard", value: Difficulty.HARD },
];

export default function GameScreen() {
    const {
        board,
        status,
        isHumanTurn,
        difficulty,
        onCellClicked,
        resetGame,
        changeDifficulty,
        humanWins,
        computerWins,
        ties,
    } = useTicTacToe();

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [boardAreaSize, setBoardAreaSize] = useState({ width: 0, height: 0 });

    const onBoardAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setBoardAreaSize({ width, height });
    };

    const boardSize = Math.min(boardAreaSize.width, boardAreaSize.height);

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
            <SafeAreaView
                style={[styles.safeArea, isLandscape && styles.safeAreaLandscape]}
            >
                <View style={styles.boardSection} onLayout={onBoardAreaLayout}>
                    {boardSize > 0 && (
                        <Board
                            size={boardSize}
                            board={board}
                            status={status}
                            onCellPress={onCellClicked}
                        />
                    )}
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.status}>{statusText}</Text>

                    <View style={styles.scoreRow}>
                        <View style={styles.scoreItem}>
                            <Text style={styles.scoreLabel}>You</Text>
                            <Text style={styles.scoreValue}>{humanWins}</Text>
                        </View>
                        <View style={styles.scoreItem}>
                            <Text style={styles.scoreLabel}>Ties</Text>
                            <Text style={styles.scoreValue}>{ties}</Text>
                        </View>
                        <View style={styles.scoreItem}>
                            <Text style={styles.scoreLabel}>CPU</Text>
                            <Text style={styles.scoreValue}>{computerWins}</Text>
                        </View>
                    </View>

                    <View style={styles.difficultyRow}>
                        {DIFFICULTY_OPTIONS.map((option) => {
                            const isSelected = option.value === difficulty;
                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => changeDifficulty(option.value)}
                                    style={[
                                        styles.difficultyButton,
                                        isSelected && styles.difficultyButtonSelected,
                                    ]}
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

                    <Pressable onPress={resetGame} style={styles.resetButton}>
                        <Text style={styles.resetText}>Reset</Text>
                    </Pressable>
                </View>
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
        gap: 24,
    },
    safeAreaLandscape: {
        flexDirection: "row",
        gap: 32,
    },
    boardSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    infoSection: {
        alignItems: "center",
        justifyContent: "center",
    },
    status: {
        fontSize: 22,
        fontWeight: "600",
        color: CHALK_WHITE,
        marginBottom: 24,
    },
    scoreRow: {
        flexDirection: "row",
        gap: 24,
        marginBottom: 24,
    },
    scoreItem: {
        alignItems: "center",
    },
    scoreLabel: {
        color: CHALK_WHITE_DIM,
        fontSize: 12,
        textTransform: "uppercase",
    },
    scoreValue: {
        color: CHALK_WHITE,
        fontSize: 24,
        fontWeight: "700",
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
        padding: 8,
    },
    resetText: {
        color: CHALK_WHITE,
        fontSize: 16,
    },
});