import { Pressable, StyleSheet, Text } from "react-native";

const CHALK_WHITE = "#F5F1E8";
const X_COLOR = "#FF6B5B";
const O_COLOR = "#FFC857";

interface CellProps {
    mark: string;
    disabled: boolean;
    onPress: () => void;
}

function Cell({ mark, disabled, onPress }: CellProps) {
    const isOccupied = mark !== " ";

    return (
        <Pressable onPress={onPress} disabled={disabled} style={styles.cell}>
            {isOccupied && (
                <Text style={[styles.mark, { color: mark === "X" ? X_COLOR : O_COLOR }]}>
                    {mark}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cell: {
        width: "31%",
        aspectRatio: 1,
        margin: "1.16%",
        borderRadius: 12,
        backgroundColor: "rgba(245, 241, 232, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(245, 241, 232, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    mark: {
        fontSize: 40,
        fontWeight: "700",
        color: CHALK_WHITE,
    },
});

export { Cell };
