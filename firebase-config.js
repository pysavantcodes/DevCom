// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MEASUREMENT_ID,MESSAGING_SENDER_ID, APP_ID} from "react-native-dotenv"

const firebaseConfig = {
  apiKey: `${API_KEY}`,
  authDomain: `${AUTH_DOMAIN}`,
  projectId: `${PROJECT_ID}`,
  storageBucket: `${STORAGE_BUCKET}`,
  messagingSenderId: `${MESSAGING_SENDER_ID}`,
  appId: `${APP_ID}`,
  measurementId: `${MEASUREMENT_ID}`
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore(app)
export const storage = getStorage(app)
