import { StyleSheet, View } from "react-native";
import { GameStatus } from "../constants/tic-tac-toe";
import { Cell } from "./cell";

interface BoardProps {
    board: string[];
    status: GameStatus;
    onCellPress: (index: number) => void;
}

function Board({ board, status, onCellPress }: BoardProps) {
    return (
        <View style={styles.grid}>
            {board.map((mark, index) => {
                const isOccupied = mark !== " ";
                return (
                    <Cell
                        key={index}
                        mark={mark}
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
        aspectRatio: 1,
    },
});

export { Board };
