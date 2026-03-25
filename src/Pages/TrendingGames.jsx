import React, { useEffect, useState } from "react";
import "./TrendingGames.css";
import GradientText from "../Components/GradientText";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TrendingGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  useEffect(() => {
    axios.get("https://nexus-server-0fku.onrender.com/trending").then((response) => {
      setGames(response.data);
    });
  }, []);

  return (
    <div className="container ">
      <GradientText
        colors={["#00ff33", "#34d9ef", "#4732ec"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class fs-1 my-5"
      >
        Trending Games
      </GradientText>

      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img
              onClick={() => navigate(`/game/${game.id}`)}
              src={game.image}
              alt={game.title}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=Game";
              }}
            />
            <div className="game-overlay">
              <h4 className="text-center my-3">{game.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingGames;
