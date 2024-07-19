import React from "react";
import { logOut } from "../services/authService";

const Dashboard = ({ user }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user.displayName || user.email}
        </h2>
        <button
          onClick={logOut}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
