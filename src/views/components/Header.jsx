import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearch, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };
  const handleCreateClick = () => {
    navigate("/create-noi");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search NOIs..."
              value={searchTerm}
              onChange={handleSearch}
              className="block  w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
        </div>
        <button
          onClick={handleCreateClick}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <FaPlus className="mr-2" />
          Create NOI Case
        </button>
      </div>
    </header>
  );
};

export default Header;
