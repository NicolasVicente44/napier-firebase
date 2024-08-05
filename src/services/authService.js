import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { logAuthActivity } from "../controllers/activityController"; // Adjust the path if necessary

// Initialize Firebase Authentication
const auth = getAuth();

// Sign in with Email and Password
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Email sign-in successful:", userCredential.user);

    // Log sign-in activity
    await logAuthActivity("login", userCredential.user.uid);

    return userCredential.user; // Return user for further use if needed
  } catch (error) {
    console.error("Error during email sign-in:", error);
    throw new Error(
      `Error signing in with email and password: ${error.message}`
    );
  }
};

// Sign out
export const logOut = async () => {
  try {
    const user = auth.currentUser; // Get current user
    await firebaseSignOut(auth);
    console.log("User signed out");

    // Log sign-out activity if user exists
    if (user) {
      try {
        await logAuthActivity("logout", user.uid);
        console.log("Sign-out activity logged successfully.");
      } catch (logError) {
        console.error("Error logging sign-out activity:", logError);
      }
    }
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw new Error(`Error signing out: ${error.message}`);
  }
};
