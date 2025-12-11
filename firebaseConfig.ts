import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: 請在 Firebase Console > Project Settings > General > Your apps 複製設定並貼上
const firebaseConfig = {
  apiKey: "AIzaSyDfuiM1BiYetD150AdUcqcvIMGWangueyc",
  authDomain: "hahahe-4c6e8.firebaseapp.com",
  projectId: "hahahe-4c6e8",
  storageBucket: "hahahe-4c6e8.firebasestorage.app",
  messagingSenderId: "99056306594",
  appId: "1:99056306594:web:dcac8fc2c329806eb8cafb"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);