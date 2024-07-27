import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import NOIFileUpload from "../NOI/NOIFileUpload";
import {
  fetchNoiById,
  updateNoiById,
  deleteNoiById,
  closeNoiById,
  reopenNoiById,
} from "../../controllers/noisController";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../../controllers/favoritesController";
import Map from "../components/Map";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "react-modal";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  getCoordinatesFromAddress,
  getAddressSuggestions,
} from "../../views/NOI/NOICreate";
import { PDFDocument } from "pdf-lib";
import { StandardFonts, rgb } from "pdf-lib";
import ShareButton from "../components/ShareButton";
import ScrollFABs from "../components/ScrollFABs";
const NOIDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noi, setNoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(""); // State for the selected template
  const applicationVariables = [
    "client",
    "clientAndClientAddress",
    "registeredOwner",
    "lienHolder",
    "assetYear",
    "assetMake",
    "assetModel",
    "assetColour",
    "VIN/serialNum",
    "licensePlate",
    "licenseExpiry",
    "daysOfStorage",
    "storageRate",
    "amountOfArrears",
    "bailiffCosts",
    "towingCost",
    "storageCosts",
    "NOICosts",
    "totalOfStorageRate",
    "dateOfAdditionalCharges",
    "formDate",
    "repoDate",
    "dateNOISent",
  ];

  // Remove automatic PDF generation
  useEffect(() => {
    if (selectedTemplate) {
      setShowPdfModal(true); // Open the modal when a template is selected
    }
  }, [selectedTemplate]);

  const [templates, setTemplates] = useState([
    // Example templates; adjust as needed
    {
      name: "NOI Lien Only.pdf",
      url: "https://firebasestorage.googleapis.com/v0/b/napier-firebase.appspot.com/o/NOI%20Lien%20Only.pdf?alt=media",
    },
    {
      name: "NOI Retain Vehicle",
      url: "https://firebasestorage.googleapis.com/v0/b/napier-firebase.appspot.com/o/NOI%20Retain%20Vehicle.pdf?alt=media",
    },
    {
      name: "NOI Sell Vehicle",
      url: "https://firebasestorage.googleapis.com/v0/b/napier-firebase.appspot.com/o/NOI%20Sell%20Vehicle.pdf?alt=media",
    },
    {
      name: "NOI Sell Vessel",
      url: "https://firebasestorage.googleapis.com/v0/b/napier-firebase.appspot.com/o/NOI%20Sell%20Vessel.pdf?alt=media",
    },
    {
      name: "NOI Retain Vessel",
      url: "https://firebasestorage.googleapis.com/v0/b/napier-firebase.appspot.com/o/NOI%20Retain%20Vessel.pdf?alt=media",
    },
  ]);
  useEffect(() => {
    const loadNoi = async () => {
      try {
        const fetchedNoi = await fetchNoiById(id);
        setNoi(fetchedNoi);
        const isFav = await isFavorite(user.uid, id);
        setFavorite(isFav);
      } catch (error) {
        console.error("Error fetching NOI details: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadNoi();
  }, [id, user.uid]);
  async function extractPdfFields(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldData = {};
    fields.forEach((field) => {
      fieldData[field.getName()] = field.getValue();
    });

    return fieldData;
  }
  async function extractPdfFields(pdfBytes) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    // Log each field's name and value
    fields.forEach((field) => {
      const fieldName = field.getName();
      const fieldValue = field.getValue();
      console.log(`Field Name: ${fieldName}, Field Value: ${fieldValue}`);
    });

    // Optionally, return the field data
    const fieldData = {};
    fields.forEach((field) => {
      fieldData[field.getName()] = field.getValue();
    });

    return fieldData;
  }

  const handleGeneratePdf = async () => {
    if (selectedTemplate) {
      try {
        const response = await fetch(selectedTemplate);
        const existingPdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Create a mapping of NOI fields to PDF fields
        const fieldMapping = {
          client: "client",
          clientAndClientAddress: "clientAndClientAddress",
          registeredOwner: "registeredOwner",
          lienHolder: "lienHolder",
          // Only map the concatenated assetDescription
          assetDescription: "assetDescription",
          VIN_serialNum: "VIN/serialNum",
          licensePlate: "licensePlate",
          licenseExpiry: "licenseExpiry",
          daysOfStorage: "daysOfStorage",
          storageRate: "storageRate",
          amountOfArrears: "amountOfArrears",
          bailiffCosts: "bailiffCosts",
          towingCost: "towingCost",
          storageCosts: "storageCosts",
          NOICosts: "NOICosts",
          totalOfStorageRate: "totalOfStorageRate",
          dateOfAdditionalCharges: "dateOfAdditionalCharges",
          formDate: "formDate",
          repoDate: "repoDate",
          dateNOISent: "dateNOISent",
        };

        // Special handling for assetDescription
        const assetDescription = `${noi.assetYear || ""} ${
          noi.assetMake || ""
        } ${noi.assetModel || ""} ${noi.assetColour || ""}`;
        const assetDescField = form.getTextField("assetDescription");
        if (assetDescField) {
          assetDescField.setText(assetDescription);
          assetDescField.updateAppearances(helveticaFont);
        } else {
          console.warn('Field "assetDescription" not found in PDF.');
        }

        const clientAndClientAddress = `${noi.client || ""} ${
          noi.clientAndClientAddress || ""
        }`;
        const clientAndClientAddressField = form.getTextField(
          "clientAndClientAddress"
        );
        if (clientAndClientAddressField) {
          clientAndClientAddressField.setText(clientAndClientAddress);
          clientAndClientAddressField.updateAppearances(helveticaFont);
        } else {
          console.warn("field client and client address not found");
        }
        const fields = form.getFields();

        fields.forEach((field) => {
          console.log(`Field Name: ${field.getName()}`);
        });

        // Iterate through the mapping and set PDF field values
        for (const [noiField, pdfField] of Object.entries(fieldMapping)) {
          if (noiField !== "assetDescription") {
            const field = form.getTextField(pdfField);
            if (field) {
              field.setText(noi[noiField] || "");
              field.updateAppearances(helveticaFont);
            } else {
              console.warn(`Field "${pdfField}" not found in PDF.`);
            }
          }
        }

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);

        await updateNoiById(id, { ...noi, pdfTemplate: selectedTemplate });
        setShowPdfModal(false);
        toast.success("PDF generated successfully.");
      } catch (error) {
        toast.error("Error generating PDF.");
        console.error("Error generating PDF: ", error);
      }
    } else {
      toast.error("Please select a PDF template first.");
    }
  };

  const handleSave = async () => {
    try {
      await updateNoiById(id, noi);
      setIsEdit(false);
      toast.success("NOI details updated successfully.");
    } catch (error) {
      toast.error("Error updating NOI.");
      console.error("Error updating NOI: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNoiById(id);
      toast.success("NOI deleted successfully.");
      navigate("/cases");
    } catch (error) {
      toast.error("Error deleting NOI.");
      console.error("Error deleting NOI: ", error);
    }
  };

  const handleCloseOrReopenCase = async () => {
    try {
      if (noi.closed) {
        await reopenNoiById(id);
        toast.success("NOI case reopened successfully.");
      } else {
        await closeNoiById(id);
        toast.success("NOI case closed successfully.");
      }
      navigate("/cases");
    } catch (error) {
      toast.error("Error updating NOI case status.");
      console.error("Error updating NOI case status: ", error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (favorite) {
        await removeFavorite(user.uid, id);
        setFavorite(false);
      } else {
        await addFavorite(user.uid, id);
        setFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoi({ ...noi, [name]: value });
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <CircularProgress />
      </div>
    );

  if (!noi)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">No data available.</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <ScrollFABs />

      <Modal
        isOpen={showPdfModal}
        onRequestClose={() => setShowPdfModal(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Generate PDF</h2>
          <p>
            Are you sure you want to generate a PDF with the selected template?
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowPdfModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleGeneratePdf}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex-1">
                  NOI Details{" "}
                  <span
                    className={`text-xl  font-semibold ${
                      noi.closed ? "text-red-500" : "text-green-500"
                    } ml-4`}
                  >
                    {noi.closed ? "Closed" : "Open"}
                  </span>
                </h1>

                <button
                  onClick={handleFavorite}
                  className="absolute top-6 right-6 text-3xl"
                >
                  {favorite ? (
                    <AiFillStar className="text-yellow-500" />
                  ) : (
                    <AiOutlineStar className="text-gray-500" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-8">
                  <div>
                    {/* Template Selection Dropdown in the first column */}
                    <div className="space-y-8">
                      <div className="mb-6">
                        <ShareButton link={noi.link} />

                        <label className="text-lg mb-2 block font-semibold">
                          Generate PDF:
                        </label>
                        <select
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select a template</option>
                          {templates.map((template) => (
                            <option key={template.name} value={template.url}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <hr className="py-2" />
                    <h2 className="text-2xl font-semibold mb-2">Client Info</h2>
                    {[
                      "client",
                      "clientAndClientAddress",
                      "registeredOwner",
                      "lienHolder",
                    ].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="text-lg mb-2 block font-semibold">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={noi[field] || "N/A"}
                          onChange={handleInputChange}
                          disabled={!isEdit}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <hr className="py-2" />

                    <h2 className="text-2xl font-semibold mb-2">Asset Info</h2>
                    {[
                      "assetYear",
                      "assetMake",
                      "assetModel",
                      "assetColour",
                      "VIN/serialNum",
                      "licensePlate",
                      "licenseExpiry",
                    ].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="text-lg mb-2 block font-semibold">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={noi[field] || "N/A"}
                          onChange={handleInputChange}
                          disabled={!isEdit}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <hr className="py-2" />
                    <h2 className="text-2xl font-semibold mb-2">Costs</h2>
                    {[
                      "daysOfStorage",
                      "storageRate",
                      "amountOfArrears",
                      "bailiffCosts",
                      "towingCost",
                      "storageCosts",
                      "NOICosts",
                      "totalOfStorageRate",
                      "dateOfAdditionalCharges",
                    ].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="text-lg mb-2 block font-semibold">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={noi[field] || "N/A"}
                          onChange={handleInputChange}
                          disabled={!isEdit}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <hr className="py-2" />

                    <h2 className="text-2xl font-semibold mb-2">Dates</h2>
                    {["formDate", "repoDate", "dateNOISent"].map((field) => (
                      <div key={field} className="mb-4">
                        <label className="text-lg mb-2 block font-semibold">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={noi[field] || "N/A"}
                          onChange={handleInputChange}
                          disabled={!isEdit}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold mb-4">
                    Location/Mapping
                  </h2>
                  <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden z-0">
                    <Map location={noi.NOILocation} />
                  </div>
                  <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Location Address
                    </h3>
                    {isEdit ? (
                      <textarea
                        name="location"
                        value={noi.location || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    ) : (
                      <p>{noi.location || "No location address available"}</p>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Location Description
                    </h3>
                    {isEdit ? (
                      <textarea
                        name="locationDescription"
                        value={noi.locationDescription || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    ) : (
                      <p>
                        {noi.locationDescription || "No description available"}
                      </p>
                    )}
                  </div>
                  <NOIFileUpload caseId={id} />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                {!isEdit ? (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-[#007bff] text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowCloseModal(true)}
                  className={`${
                    noi.closed ? "bg-green-500" : "bg-yellow-500"
                  } text-white px-4 py-2 rounded`}
                >
                  {noi.closed ? "Reopen Case" : "Close Case"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this NOI?</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showCloseModal}
        onRequestClose={() => setShowCloseModal(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">
            {noi.closed ? "Confirm Reopen" : "Confirm Close"}
          </h2>
          <p>
            {noi.closed
              ? "Are you sure you want to reopen this NOI case?"
              : "Are you sure you want to close this NOI case?"}
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowCloseModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCloseOrReopenCase}
              className={`${
                noi.closed ? "bg-green-500" : "bg-yellow-500"
              } text-white px-4 py-2 rounded`}
            >
              {noi.closed ? "Reopen Case" : "Close Case"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NOIDetails;
