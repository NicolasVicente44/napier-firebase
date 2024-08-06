import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import BugReportModal from "./BugReportModal";

const BugReportFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hidden md:flex"
        aria-label="Report a bug"
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
      <BugReportModal isOpen={isOpen} closeModal={toggleModal} />
    </>
  );
};

export default BugReportFAB;
