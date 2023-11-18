import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvnecZn33eE2TKsT3CwH4LxEG65KUXMSY",
    authDomain: "diet-on-the-go.firebaseapp.com",
    projectId: "diet-on-the-go",
    storageBucket: "diet-on-the-go.appspot.com",
    messagingSenderId: "113650200327",
    appId: "1:113650200327:web:ec59b41106a98753bc9fa2",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
export const db = getFirestore(firebaseApp);
