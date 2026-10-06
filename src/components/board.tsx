import { StyleSheet, View } from "react-native";
import { GameStatus, OPEN_SPOT } from "../constants/tic-tac-toe";
import { Cell } from "./cell";

interface BoardProps {
    size: number;
    board: string[];
    status: GameStatus;
    onCellPress: (index: number) => void;
}

const COLUMNS = 3;
const CELL_GAP = 8;

function Board({ size, board, status, onCellPress }: BoardProps) {
    const totalGap = CELL_GAP * (COLUMNS - 1);
    const cellSize = (size - totalGap) / COLUMNS;

    return (
        <View style={[styles.grid, { width: size }]}>
            {board.map((mark, index) => {
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
        gap: CELL_GAP,
    },
});

export { Board };