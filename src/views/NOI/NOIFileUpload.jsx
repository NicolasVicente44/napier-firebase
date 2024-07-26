import React, { useState, useEffect } from 'react';
import { storage, db } from '../../firebase/firebase'; // Import storage and db
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage'; // Import storage functions
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'; // Import Firestore functions

const NOIFileUpload = ({ caseId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const caseRef = doc(db, 'cases', caseId);
        const caseDoc = await getDoc(caseRef);
        if (caseDoc.exists()) {
          const fileUrls = caseDoc.data().files || [];
          setUploadedFiles(fileUrls);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [caseId]);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const storageRef = ref(storage, `files/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can monitor the progress here
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload error:', error);
        setUploading(false);
      },
      async () => {
        // Handle successful uploads on complete
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Update Firestore with the file URL
        const caseRef = doc(db, 'cases', caseId);
        await updateDoc(caseRef, {
          files: arrayUnion(downloadURL)
        });

        setUploadedFiles((prevFiles) => [...prevFiles, downloadURL]);
        setUploading(false);
        setSelectedFile(null);
      }
    );
  };

  const handleFileClick = (url) => {
    setSelectedFileUrl(url);
  };

  const renderPreview = () => {
    if (!selectedFileUrl) return null;

    const fileExtension = selectedFileUrl.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      return <img src={selectedFileUrl} alt="Preview" className="w-full h-auto max-h-80" />;
    } else if (fileExtension === 'pdf') {
      return <iframe src={selectedFileUrl} className="w-full h-80" title="PDF Preview" />;
    } else {
      return <p className="text-gray-500">No preview available</p>;
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-all">
      <div
        className="flex flex-col items-center justify-center h-48 bg-gray-100 border border-gray-300 rounded-lg relative cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="text-gray-500">Drag & drop files here or click to browse</p>
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
      {selectedFile && (
        <div className="mt-4 text-gray-700">
          <p>Selected file: {selectedFile.name}</p>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg ${
          uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      
      {/* File List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Uploaded Files:</h3>
        <ul className="list-disc pl-5 mt-2">
          {uploadedFiles.map((url, index) => (
            <li key={index} className="mt-2">
              <button 
                className="text-blue-500 hover:underline"
                onClick={() => handleFileClick(url)}
              >
                {url.split('/').pop()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* File Preview */}
      <div className="mt-4">
        {renderPreview()}
      </div>
    </div>
  );
};

export default NOIFileUpload;
