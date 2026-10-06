import { useAudioPlayer } from "expo-audio";

const tieSound = require("../assets/sounds/Tie.mp3");
const moveSound = require("../assets/sounds/IA.mp3");
const victorySound = require("../assets/sounds/victory.mp3");
const defeatSound = require("../assets/sounds/defeat.mp3");

export function useGameSounds() {
    const movePlayer = useAudioPlayer(moveSound);
    const tiePlayer = useAudioPlayer(tieSound);
    const victoryPlayer = useAudioPlayer(victorySound);
    const defeatPlayer = useAudioPlayer(defeatSound);

    const playMove = () => {
        movePlayer.seekTo(0);
        movePlayer.play();
    };

    const playTie = () => {
        tiePlayer.seekTo(0);
        tiePlayer.play();
    };
    
    const playVictory = () => {
        victoryPlayer.seekTo(0);
        victoryPlayer.play();
    };

    const playDefeat = () => {
        defeatPlayer.seekTo(0);
        defeatPlayer.play();
    };

    return { playMove, playTie, playVictory, playDefeat };
}