import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../../controllers/favoritesController"; // Adjust path as needed
import Sidebar from "../components/Sidebar"; // Ensure correct path
import EmptyHeader from "../components/EmptyHeader"; // Ensure correct path

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const favs = await fetchFavorites(user.uid);
        setFavorites(favs);
      } catch (error) {
        toast.error("Error fetching favorites.");
        console.error("Error fetching favorites: ", error);
      } finally {
        setLoading(false);
      }
    };
    getFavorites();
  }, [user.uid]);

  const handleAddFavorite = async (noiId) => {
    try {
      await addFavorite(user.uid, noiId);
      setFavorites((prev) => [...prev, noiId]);
    } catch (error) {
      toast.error("Error adding favorite.");
      console.error("Error adding favorite: ", error);
    }
  };

  const handleRemoveFavorite = async (noiId) => {
    try {
      await removeFavorite(user.uid, noiId);
      setFavorites((prev) => prev.filter((id) => id !== noiId));
    } catch (error) {
      toast.error("Error removing favorite.");
      console.error("Error removing favorite: ", error);
    }
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
            <h1 className="text-3xl font-bold mb-6">Favourites</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {favorites.length > 0 ? (
                <ul>
                  {favorites.map((noiId) => (
                    <li
                      key={noiId}
                      className="flex items-center justify-between mb-4"
                    >
                      <Link
                        to={`/noidetails/${noiId}`}
                        className="text-blue-500 underline"
                      >
                        NOI ID: {noiId}
                      </Link>
                      <p>NOI COLLATERAL: {}</p>
                      <button
                        onClick={() => handleRemoveFavorite(noiId)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xl text-gray-700">No favorites found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Favorites;
