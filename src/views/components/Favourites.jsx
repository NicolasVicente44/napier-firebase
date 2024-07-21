import React, { useEffect, useState } from "react";
import {
  fetchFavourites,
  addFavourite,
  removeFavourite,
} from "../../controllers/noisController"; // Adjust path as needed

const Favourites = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const getFavourites = async () => {
      try {
        const favs = await fetchFavourites(userId);
        setFavourites(favs);
      } catch (error) {
        console.error("Error fetching favourites: ", error);
      }
    };
    getFavourites();
  }, [userId]);

  const handleAddFavourite = async (noiId) => {
    try {
      await addFavourite(userId, noiId);
      setFavourites((prev) => [...prev, noiId]);
    } catch (error) {
      console.error("Error adding favourite: ", error);
    }
  };

  const handleRemoveFavourite = async (noiId) => {
    try {
      await removeFavourite(userId, noiId);
      setFavourites((prev) => prev.filter((id) => id !== noiId));
    } catch (error) {
      console.error("Error removing favourite: ", error);
    }
  };

  return (
    <div>
      <h2>Favourites</h2>
      <ul>
        {favourites.map((noiId) => (
          <li key={noiId}>
            {/* Replace this with actual NOIs data fetching and display */}
            <span>NOI ID: {noiId}</span>
            <button onClick={() => handleRemoveFavourite(noiId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favourites;
