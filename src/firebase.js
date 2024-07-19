// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiFgQ8dn-JyjLrQ8JlpfdxQUk1WTuGom4",
  authDomain: "napier-firebase.firebaseapp.com",
  projectId: "napier-firebase",
  storageBucket: "napier-firebase.appspot.com",
  messagingSenderId: "157741730613",
  appId: "1:157741730613:web:5c9869e1908c7d76055a7c",
  measurementId: "G-Q4M6970Z0T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
