import React, { useState } from "react";
import Modal from "react-modal";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

// Style the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Increase the width of the modal
    maxWidth: "600px", // Set a maximum width
    padding: "20px", // Add padding inside the modal
    zIndex: 1000, // Ensure the modal is above other content
    position: "relative", // Allow absolute positioning within modal
  },
};

// Style the input field
const inputStyles = {
  width: "100%", // Make the input field take full width
  padding: "10px", // Add padding inside the input field
  fontSize: "16px", // Increase font size
  marginTop: "10px", // Add margin on top of the input field
  border: "1px solid #ddd", // Add border
  borderRadius: "5px", // Add border radius
};

// Style the notification
const notificationStyles = {
  position: "absolute",
  top: "-40px", // Adjust this value to position it right above the input field
  left: "50%", // Center horizontally within the modal
  transform: "translateX(-50%)", // Center the notification itself
  backgroundColor: "#28a745", // Green background for success
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "5px",
  boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
  zIndex: 1100, // Ensure the notification is above the input field
  fontSize: "14px", // Adjust font size
  textAlign: "center", // Center the text
};

// Style the close button
const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#333",
};

// Style the share button
const shareButtonStyles = {
  display: "flex",
  alignItems: "center",
  padding: "10px 15px",
  border: "none",
  backgroundColor: "#007bff", // Blue background
  color: "#fff",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
};

const shareIconStyles = {
  marginRight: "8px",
};

Modal.setAppElement("#root");

const ShareButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sharableLink, setSharableLink] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);

  const generateSharableLink = () => {
    const currentLink = window.location.href;
    setSharableLink(currentLink);
    setModalIsOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharableLink);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 2000); // Hide notification after 2 seconds
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button style={shareButtonStyles} onClick={generateSharableLink}>
        <i className="fas fa-share" style={shareIconStyles}></i> Share
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Sharable Link Modal"
      >
        <button style={closeButtonStyles} onClick={closeModal}>
          <i className="fas fa-times"></i>
        </button>
        <h2>Sharable Link</h2>
        <div style={{ position: "relative" }}> {/* Ensure this container is relatively positioned */}
          {notificationVisible && (
            <div style={notificationStyles}>
              Link copied to clipboard!
            </div>
          )}
          <input
            type="text"
            value={sharableLink}
            readOnly
            style={inputStyles}
            onClick={copyToClipboard} // Copy link to clipboard on click
          />
        </div>
      </Modal>
    </div>
  );
};

export default ShareButton;
