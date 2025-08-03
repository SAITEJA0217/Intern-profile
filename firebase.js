// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyADa-n7KNqYGLFFis3OqKpNFiohvWFKVx4",
  authDomain: "intern-portal-c683d.firebaseapp.com",
  databaseURL: "https://intern-portal-c683d-default-rtdb.firebaseio.com",
  projectId: "intern-portal-c683d",
  storageBucket: "intern-portal-c683d.appspot.com",
  messagingSenderId: "5244297231",
  appId: "1:5244297231:web:7df9647b295ac61bb9037a",
  measurementId: "G-YBL0NPB8B6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
