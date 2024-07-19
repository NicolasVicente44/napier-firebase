import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../services/authService"; // Adjust the path if necessary
import logoutsvg from "../../assets/svgs/logout-svgrepo-com.svg"; // Correct SVG import
import napierLogo from "../../assets/images/logo.png";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/home", icon: "🏠" },
    { name: "Cases", path: "/cases", icon: "📁" },
    { name: "Reporting", path: "/reporting", icon: "📊" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
  ];

  const bottomItems = [
    { name: "Users", path: "/users", icon: "👥" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logOut();
      // Optionally redirect to the login page or another page after logout
      window.location.href = "/login"; // Adjust the redirect path if necessary
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-6 right-5 z-20 bg-gray-800 text-white py-4 px-6 rounded-md"
      >
        {isOpen ? "✕" : "☰"}
      </button>
      <aside
        className={`bg-gray-100 text-gray-800 w-64 flex flex-col justify-between h-screen fixed left-0 top-0 z-10 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <a href="/" className="p-4 flex   items-center text-2xl font-bold">
            <img src={napierLogo} className="h-12 mr-3" alt="Napier Logo" />
            <span className="text-sm flex-nowrap">Napier NOI Flow</span>
          </a>
          <nav>
            {user && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{"Welcome Back,"}</p>
                    <p className="text-sm text-gray-600">
                      {user.email ? user.email.split("@")[0] : "User"}
                    </p>
                  </div>
                </div>
                {/* Ensure border spans the full width */}
                <div className="border-t border-gray-200 mt-4"></div>
              </div>
            )}
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center p-4 hover:bg-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <nav>
            <ul>
              {bottomItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center p-4 hover:bg-gray-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {user && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:bg-red-100 p-2 rounded-lg flex items-center"
              >
                <img src={logoutsvg} className="w-5 h-5 mx-2" alt="Logout" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
