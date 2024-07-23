import React, { useState, useEffect } from "react";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Users = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User created:", userCredential.user);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setError(error.message);
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-semibold mb-6">Current User</h1>
              {loading ? (
                <p>Loading...</p>
              ) : currentUser ? (
                <div>
                  <p>ID: {currentUser.uid}</p>
                  <p>Email: {currentUser.email}</p>
                </div>
              ) : (
                <p>No user logged in.</p>
              )}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleCreate}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded-md mr-4"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded-md mr-4"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Create User
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
