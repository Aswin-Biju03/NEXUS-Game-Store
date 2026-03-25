import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GradientText from "../Components/GradientText";
import "./TrendingGames.css";

function GameLibrary() {
  const [owned, setOwned] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnedGames();
  }, []);

  const fetchOwnedGames = async () => {
    try {
      const res = await axios.get(
        "https://nexus-server-0fku.onrender.com/library"
      );
      setOwned(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔴 REMOVE WITH CONFIRMATION
  const removeGame = async (id, title, e) => {
    e.stopPropagation(); // prevent navigation

    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${title}" from your library?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://nexus-server-0fku.onrender.com/library/${id}`
      );

      setOwned((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <GradientText
        colors={["#00ff33", "#34d9ef", "#4732ec"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class head fs-0 ms-0 my-5"
      >
        Game Library
      </GradientText>

      <div className="games-grid">
        {owned && owned.length > 0 ? (
          owned.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => navigate(`/game/${game.gameId}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={game.image}
                alt={game.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Game";
                }}
              />

              <div className="game-overlay">
                <h4 className="text-center my-2">{game.title}</h4>

                {/* 🔴 REMOVE BUTTON */}
                <button
                  className="btn-remove"
                  onClick={(e) =>
                    removeGame(game.id, game.title, e)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3 className="m-2">No games available</h3>
        )}
      </div>
    </div>
  );
}

export default GameLibrary;