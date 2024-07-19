import { auth, googleProvider, microsoftProvider } from "../firebase/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Handle successful sign-in here
    console.log("Google sign-in successful:", result.user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

// Sign in with Microsoft
export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    // Handle successful sign-in here
    console.log("Microsoft sign-in successful:", result.user);
  } catch (error) {
    console.error("Error signing in with Microsoft:", error);
  }
};

// Sign in with Email and Password
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Handle successful sign-in here
    console.log("Email sign-in successful:", userCredential.user);
  } catch (error) {
    console.error("Error signing in with email and password:", error);
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
