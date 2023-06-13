// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY0g7EAPMWpBaX4v1u8p1Be58iA74OJD4",
  authDomain: "todo-app-c4ea0.firebaseapp.com",
  projectId: "todo-app-c4ea0",
  storageBucket: "todo-app-c4ea0.appspot.com",
  messagingSenderId: "407061464303",
  appId: "1:407061464303:web:c2dbadbc38ea77349ac71a",
  measurementId: "G-C89Z6LLWKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

const db = getFirestore(app);
export { db }