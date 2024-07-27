import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storage, db } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const NOIFileUpload = ({ caseId }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `files/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });

      const fileURLs = await Promise.all(uploadPromises);

      const noiRef = doc(db, "nois", caseId);
      await updateDoc(noiRef, {
        files: arrayUnion(...fileURLs),
      });

      setFiles([]);
      setError(null);
      alert("Files uploaded successfully!");
    } catch (err) {
      setError("Failed to upload files.");
    }
  };

  return (
    <div className="  mt-8 py-4 p-4 border-2 border-dashed border-gray-300 rounded-md">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors py-12 ${
          isDragActive
            ? "border-blue-500 bg-blue-100"
            : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-gray-700">Drop the files here ...</p>
        ) : (
          <p className="text-center text-gray-700">
            Drag & drop files here, or click to browse
          </p>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <ul>
            {files.map((file, index) => (
              <li key={index} className="text-center text-gray-700">
                {file.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default NOIFileUpload;
