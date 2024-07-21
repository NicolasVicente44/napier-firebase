import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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

const NOIDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noi, setNoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [favorite, setFavorite] = useState(false);

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
      <ToastContainer />
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <h1 className="text-3xl font-bold mb-6">NOI Details</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    "id",
                    "clientName",
                    "assetMake",
                    "assetModel",
                    "dateNOISent",
                    "amountOfArrears",
                  ].map((field) => (
                    <div key={field}>
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
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-4">
                    Location/Mapping
                  </h2>
                  <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden z-0">
                    <Map location={noi.NOILocation} />
                  </div>
                  {/* Add the Location Description below the map */}
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
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                {!isEdit ? (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
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
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
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
              onClick={handleCloseOrReopenCase}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {noi.closed ? "Reopen" : "Close"}
            </button>
            <button
              onClick={() => setShowCloseModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NOIDetails;
