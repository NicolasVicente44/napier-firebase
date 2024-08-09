import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import Modal from "react-modal";

// Ensure accessibility by setting the root element
Modal.setAppElement("#root");

const BugReportModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    urgency: "low",
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the email data
    const emailParams = {
      to_name: "Nicolas",
      from_name: formData.name,
      message: `Email: ${formData.email}\nDescription: ${formData.description}\nUrgency: ${formData.urgency}`,
    };

    // Send the email using EmailJS
    emailjs
      .send(
        "service_y281hgh",
        "template_lgrvdni",
        emailParams,
        "V6uLa1ME2WklSEeI7"
      ) // Use your Public Key here
      .then(
        (result) => {
          console.log(result.text);
          alert("Bug report sent successfully!");
          closeModal();
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send bug report.");
        }
      );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Bug Report Modal"
      className="fixed z-40 inset-0 flex items-center justify-center p-4 bg-transparent"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-70"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
          Submit a Bug Report
        </h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue description, please be verbose
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Submit
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 border border-transparent rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BugReportModal;
