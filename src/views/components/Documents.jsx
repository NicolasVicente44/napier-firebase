import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Ensure correct path

const Documents = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pdfs"));
        const pdfsList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const url = await getDownloadURL(ref(getStorage(), data.filePath));
            return { id: doc.id, ...data, url };
          })
        );
        setPdfs(pdfsList);
        if (pdfsList.length > 0) {
          setSelectedPdf(pdfsList[0].url);
        }
      } catch (error) {
        toast.error("Error fetching documents.");
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const handlePdfSelect = (url) => {
    setSelectedPdf(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Documents</h1>
            <div className="flex space-x-4 mb-6">
              {pdfs.map((pdf) => (
                <button
                  key={pdf.id}
                  onClick={() => handlePdfSelect(pdf.url)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {pdf.name}
                </button>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  style={{ width: "100%", height: "80vh" }}
                  frameBorder="0"
                  title="PDF Viewer"
                ></iframe>
              ) : (
                <p className="text-xl text-gray-700">No PDF selected.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
