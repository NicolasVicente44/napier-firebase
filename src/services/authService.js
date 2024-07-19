import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw new Error(`Error signing out: ${error.message}`);
  }
};
