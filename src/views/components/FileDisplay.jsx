import React, { useEffect, useState } from "react";
import { storage, db } from "../../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { TrashIcon } from "@heroicons/react/24/solid"; // Updated import path

const FileDisplay = ({ caseId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    // Create a reference to the Firestore document
    const noiRef = doc(db, "nois", caseId);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(noiRef, (doc) => {
      if (doc.exists()) {
        setFiles(doc.data().files || []);
      }
    });

    // Cleanup the listener on component unmount or caseId change
    return () => unsubscribe();
  }, [caseId]);

  const handleFileClick = async (file) => {
    const fileRef = ref(storage, file);
    const url = await getDownloadURL(fileRef);
    setSelectedFile(file);
    setFileUrl(url);
  };

  const handleDelete = async (file) => {
    try {
      // Delete file from Firebase Storage
      const fileRef = ref(storage, file);
      await deleteObject(fileRef);

      // Update Firestore to remove the file reference
      const noiRef = doc(db, "nois", caseId);
      const updatedFiles = (files || []).filter((f) => f !== file);
      await updateDoc(noiRef, { files: updatedFiles });

      // No need to manually update local state; Firestore listener will handle it
      if (selectedFile === file) {
        setSelectedFile(null);
        setFileUrl(null);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getFileName = (url) => {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  };

  return (
    <div className="bg-white rounded-lg my-8 shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">NOI Files</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out"
              onClick={() => handleFileClick(file)}
            >
              <p className="font-medium truncate flex-grow">
                {getFileName(file)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from propagating to parent div
                  handleDelete(file);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        {selectedFile && (
          <div className="bg-gray-100 rounded-lg p-4 mt-4">
            <a
              href={fileUrl}
              download
              className="block mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-150 ease-in-out"
            >
              Download
            </a>
            {selectedFile.endsWith(".pdf") ? (
              <iframe src={fileUrl} className="w-full h-96" />
            ) : (
              <img
                src={fileUrl}
                alt={getFileName(fileUrl)}
                className="w-full h-96 object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDisplay;
