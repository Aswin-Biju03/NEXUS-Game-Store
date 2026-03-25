import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GamePage.css";

function StarRating({ rating = 4.2 }) {
  return (
    <div className="game-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`star ${s <= Math.round(rating) ? "" : "empty"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="rating-text">{rating} / 5.0 · 2.4k reviews</span>
    </div>
  );
}

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, cartRes, libraryRes] = await Promise.all([
          axios.get(`https://nexus-server-0fku.onrender.com/allgames/${id}`),
          axios.get("https://nexus-server-0fku.onrender.com/cart"),
          axios.get("https://nexus-server-0fku.onrender.com/library"),
        ]);

        setGame(gameRes.data);

        const cartItem = cartRes.data.find(
          (item) => String(item.gameId) === String(id),
        );
        if (cartItem) {
          setAlreadyInCart(true);
          setCartItemId(cartItem.id); // save json-server id for DELETE
        }

        setAlreadyOwned(
          libraryRes.data.some((item) => String(item.gameId) === String(id)),
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (alreadyInCart) return;
    try {
      const res = await axios.post("http://localhost:3000/cart", {
        ...game,
        gameId: String(game.id),
      });
      setAlreadyInCart(true);
      setCartItemId(res.data.id);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await axios.delete(`http://localhost:3000/cart/${cartItemId}`);
      setAlreadyInCart(false);
      setCartItemId(null);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const handleBuyNow = async () => {
    if (alreadyOwned) return;
    try {
      await axios.post("http://localhost:3000/library", {
        ...game,
        gameId: String(game.id),
        purchasedAt: new Date().toISOString(),
      });
      setAlreadyOwned(true);
      navigate("/payment");
    } catch (err) {
      console.error("Failed to add to library:", err);
    }
  };

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;
  if (!game) return <h2 className="text-center mt-5">Game not found</h2>;

  return (
    <div className="game-page">
      <div className="game-layout container">
        {/* Left: Image */}
        <div className="game-image-wrap">
          <img
            src={game.image}
            alt={game.title}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x400?text=Game";
            }}
          />
        </div>

        {/* Right: Details */}
        <div className="game-details">
          <span className="game-badge">🔥 Trending Now</span>
          <h1 className="game-title">{game.title}</h1>

          <div className="game-meta">
            <span className="meta-tag">Action RPG</span>
            <span className="meta-tag">Multiplayer</span>
            <span className="meta-tag">PC / Console</span>
          </div>

          <StarRating rating={game.rating || 4.3} />

          <p className="game-description">
            {game.description ||
              "Experience an epic open-world adventure with stunning visuals, deep lore, and endless gameplay possibilities."}
          </p>

          <div className="game-price-row">
            <span className="price-original">
              ${game.originalPrice || "79.99"}
            </span>
            <span className="price-current">${game.price || "49.99"}</span>
            <span className="price-discount">−38%</span>
          </div>

          <div className="game-actions">
            {alreadyOwned ? (
              <button className="btn btn-cart btn-cart-added" disabled>
                🛒 Add to Cart
              </button>
            ) : alreadyInCart ? (
              <button className="btn btn-remove" onClick={handleRemoveFromCart}>
                🗑 Remove from Cart
              </button>
            ) : (
              <button className="btn btn-cart" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            )}

            <button
              className={`btn btn-buy ${alreadyOwned ? "btn-owned" : ""}`}
              onClick={handleBuyNow}
              disabled={alreadyOwned}
            >
              {alreadyOwned ? "✔ Owned" : "⚡ Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
