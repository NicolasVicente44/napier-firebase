import React, { useState } from "react";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearch, onCreate, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleCreateClick = () => {
    navigate("/create-noi");
  };

  const handleFilterToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilter(filter); // Pass the selected filter to the parent component
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="relative w-full max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search NOIs..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-16 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <button
            onClick={handleFilterToggle}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            <FaFilter className="text-gray-500" />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div
                  onClick={() => handleFilterChange("All")}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  All
                </div>
                <div
                  onClick={() => handleFilterChange("Open Duration")}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Open Duration
                </div>
                <div
                  onClick={() => handleFilterChange("Value")}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Value
                </div>
                <div
                  onClick={() => handleFilterChange("Client Name")}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Client Name
                </div>
                <div
                  onClick={() => handleFilterChange("Asset Name")}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Asset Name
                </div>
              </div>
            )}
          </button>
        </div>
        <button
          onClick={handleCreateClick}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center md-button:flex hidden"
          style={{ height: "40px" }} // Fixed button height
        >
          <FaPlus className="mr-2" />
          Create NOI Case
        </button>
        <button
          onClick={handleCreateClick}
          className="ml-4 bg-indigo-600 text-white p-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center md-button:hidden md-button:px-6"
          style={{ height: "40px" }} // Fixed button height
        >
          <FaPlus />
        </button>
      </div>
    </header>
  );
};

export default Header;
