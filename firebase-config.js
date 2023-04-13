// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: `${process.env.apiKey}`,
  authDomain: `${process.env.authDomain}`,
  projectId: `${process.env.projectId}`,
  storageBucket: `${process.env.storageBucket}`,
  messagingSenderId: `${process.env.messagingSenderId}`,
  appId: `${process.env.appId}`,
  measurementId: `${process.env.measurementId}`
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore(app)
export const storage = getStorage(app)
