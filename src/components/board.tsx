import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GameStatus, OPEN_SPOT } from "../constants/tic-tac-toe";
import { Cell } from "./cell";

interface BoardProps {
    board: string[];
    status: GameStatus;
    onCellPress: (index: number) => void;
}

const COLUMNS = 3;
const CELL_GAP = 8;

function Board({ board, status, onCellPress }: BoardProps) {
    const [cellSize, setCellSize] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const containerWidth = event.nativeEvent.layout.width;
        const totalGap = CELL_GAP * (COLUMNS - 1);
        setCellSize((containerWidth - totalGap) / COLUMNS);
    };

    return (
        <View style={styles.grid} onLayout={onLayout}>
            {cellSize > 0 &&
                board.map((mark, index) => {
                    const isOccupied = mark !== OPEN_SPOT;
                    return (
                        <Cell
                            key={index}
                            mark={mark}
                            size={cellSize}
                            disabled={isOccupied || status !== GameStatus.IN_PROGRESS}
                            onPress={() => onCellPress(index)}
                        />
                    );
                })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        gap: CELL_GAP,
    },
});

export { Board };
