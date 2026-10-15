import { Pressable, StyleSheet, Text, View } from "react-native";
import type { OnlineGame } from "@/services/games";

const CHALK_WHITE = "#F5F1E8";
const CHALK_WHITE_DIM = "#F5F1E866";

function formatAge(createdAtMs: number): string {
    const minutes = Math.floor((Date.now() - createdAtMs) / 60000);
    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 minute ago";
    return `${minutes} minutes ago`;
}

interface GameListItemProps {
    game: OnlineGame;
    isMine: boolean;
    disabled?: boolean;
    onPress: () => void;
}

export function GameListItem({ game, isMine, disabled, onPress }: GameListItemProps) {
    return (
        <View style={styles.row}>
            <View>
                <Text style={styles.name}>
                    {isMine ? "Your Game" : `Game ${game.id.slice(0, 4)}`}
                </Text>
                <Text style={styles.meta}>{formatAge(game.createdAtMs)}</Text>
            </View>

            <Pressable
                style={[styles.joinButton, disabled && styles.joinButtonDisabled]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={styles.joinText}>{isMine ? "Open" : "Join"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CHALK_WHITE_DIM,
    },
    name: {
        color: CHALK_WHITE,
        fontSize: 16,
        fontWeight: "600",
    },
    meta: {
        color: CHALK_WHITE_DIM,
        fontSize: 12,
        marginTop: 2,
    },
    joinButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: CHALK_WHITE,
    },
    joinButtonDisabled: {
        opacity: 0.4,
    },
    joinText: {
        color: "#1B1F3B",
        fontSize: 14,
        fontWeight: "600",
    },
});