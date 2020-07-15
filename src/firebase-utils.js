import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";
import { colors } from "./assets/js/colorlist.js";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "emilys-app-f1604.firebaseapp.com",
  databaseURL: "https://emilys-app-f1604.firebaseio.com",
  projectId: "emilys-app-f1604",
  storageBucket: "emilys-app-f1604.appspot.com",
  messagingSenderId: "207902982889",
  appId: "1:207902982889:web:d14790104742e04092e678",
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const storageRef = storage.ref();

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  const randIndex = Math.floor(Math.random() * colors.length + 1);
  const color = colors[randIndex];

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        color,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  return userRef;
};
