
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GradientText from "../Components/GradientText";
import "./TrendingGames.css";

function ViewCart(){
  const [owned, setOwned] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://nexus-server-0fku.onrender.com/cart").then((res) => {
      setOwned(res.data);
    });
  }, []);

  return (
    <div className="container">
      <GradientText
        colors={["#00ff33", "#34d9ef", "#4732ec"]}
        animationSpeed={10}
        showBorder={false}
        className="custom-class ms-0 my-5"
      >
        <h1 style={{fontSize:'50px'}}>Cart</h1>
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
                  e.target.src = "https://via.placeholder.com/300x200?text=Game";
                }}
              />
              <div className="game-overlay">
                <h4 className="text-center my-3">{game.title}</h4>
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
export default ViewCart