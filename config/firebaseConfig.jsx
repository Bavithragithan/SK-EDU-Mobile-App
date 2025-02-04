// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6aR4dgliVZfTB1Ppu8tD7LLIId32C-LA",
    authDomain: "education-app-34691.firebaseapp.com",
    projectId: "education-app-34691",
    storageBucket: "education-app-34691.firebasestorage.app",
    messagingSenderId: "606964740154",
    appId: "1:606964740154:web:07abdf8fda724b53788503",
    measurementId: "G-EY8MV6RLMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db = getFirestore(app)
const analytics = getAnalytics(app);