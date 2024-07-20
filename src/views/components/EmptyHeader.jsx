import React, { useState, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const [currentTime, setCurrentTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Update the current time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer); 
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <div className="text-gray-600">
            <span className="font-semibold">Current Time:</span> {currentTime}
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Notifications"
          >
            <FaBell />
          </button>
          <div className="relative">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              aria-label="User Profile"
            >
              <FaUser />
              {user && (
                <span className="hidden md:inline">{user.username}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
