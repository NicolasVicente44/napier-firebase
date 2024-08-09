// src/views/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <img
          src="/path/to/404-illustration.png"
          alt="404 Illustration"
          className="w-64 mb-6"
        />
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-lg mb-6">
          Sorry, the page you're looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
