import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearch, onCreate }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-9 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
