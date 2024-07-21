import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Ensure correct path
import Sidebar from "../components/Sidebar"; // Ensure correct path
import EmptyHeader from "../components/EmptyHeader"; // Ensure correct path

const Documents = ({ user }) => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pdfTemplates"));
        const pdfsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setPdfs(pdfsList);
        if (pdfsList.length > 0) {
          setSelectedPdf(pdfsList[0].templateFileUrl);
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

  const handlePdfSelect = (event) => {
    const url = event.target.value;
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
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Documents</h1>
            <div className="relative mb-6">
              <select
                onChange={handlePdfSelect}
                className="block w-1/3 h-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                <option value="" disabled selected>
                  Select a PDF
                </option>
                {pdfs.map((pdf) => (
                  <option key={pdf.id} value={pdf.templateFileUrl}>
                    {pdf.templateName}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  style={{ width: "100%", height: "80vh" }}
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
