import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Assuming you have a firebase.js file with your Firebase configuration
import logo from "../assets/images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      // Redirect to dashboard after successful login
      navigate("/home");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
      setShowForgotPassword(false);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 py-10 pb-10 rounded-lg shadow-xl w-full max-w-md">
        <img src={logo} alt="Napier Logo" className="w-35 h-24 mx-auto mb-8" />
        <h2 className="text-2xl font-bold mb-6 text-center">Napier NOI Flow</h2>
        <form onSubmit={handleEmailSignIn} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-900 transition"
          >
            Login
          </button>
        </form>
        <button
          onClick={() => setShowForgotPassword(true)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Reset Password</h3>
              <form
                onSubmit={handleForgotPassword}
                className="flex flex-col space-y-4"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-900 transition"
                >
                  Send Reset Email
                </button>
              </form>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="mt-4 text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
