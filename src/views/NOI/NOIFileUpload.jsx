import React, { useState } from 'react';
import { storage, db } from '../../firebase/firebase'; // Import storage and db
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import storage functions
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions

const NOIFileUpload = ({ caseId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
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
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        // Handle successful uploads on complete
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Update Firestore with the file URL
        const caseRef = doc(db, 'cases', caseId); // Replace 'cases' with your collection name and caseId with your case ID
        await updateDoc(caseRef, {
          files: arrayUnion(downloadURL)
        });

        setUploading(false);
        setSelectedFile(null);
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default NOIFileUpload;
