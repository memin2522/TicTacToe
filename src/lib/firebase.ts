import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    onAuthStateChanged,
    signInAnonymously,
} from "@firebase/auth";
import { firebaseConfig } from "./firebase-config";

const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

export const auth = isFirstInit
    ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
    : getAuth(app);

export const db = getFirestore(app);
export { onAuthStateChanged, signInAnonymously };