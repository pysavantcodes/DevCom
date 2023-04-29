// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MEASUREMENT_ID,
  MESSAGING_SENDER_ID,
  APP_ID,
} from "react-native-dotenv";

// const firebaseConfig = {
//   apiKey: `${API_KEY}`,
//   authDomain: `${AUTH_DOMAIN}`,
//   projectId: `${PROJECT_ID}`,
//   storageBucket: `${STORAGE_BUCKET}`,
//   messagingSenderId: `${MESSAGING_SENDER_ID}`,
//   appId: `${APP_ID}`,
//   measurementId: `${MEASUREMENT_ID}`,
// };
const firebaseConfig = {
  apiKey: `AIzaSyBC_pSdVKDn3Nl7-0FvY-IOtYKvBtiDXJI`,
  authDomain: `chatapp-3919c.firebaseapp.com`,
  projectId: `chatapp-3919c`,
  storageBucket: `chatapp-3919c.appspot.com`,
  messagingSenderId: `898628960437`,
  appId: `1:898628960437:web:730fb2da7ded50b2d0befc`,
  measurementId: `G-REN2KYN1RC`,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
