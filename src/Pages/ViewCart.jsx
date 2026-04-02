import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GradientText from "../Components/GradientText";
import "./ViewCart.css";

function ViewCart() {
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://nexus-server-0fku.onrender.com/cart").then((res) => {
      setCart(res.data);
    });
  }, []);

  const removeItem = (id) => {
    axios.delete(`https://nexus-server-0fku.onrender.com/cart/${id}`)
      .then(() => setCart((prev) => prev.filter((g) => g.id !== id)))
      .catch((err) => console.error("Failed to remove item:", err));
  };

  const clearCart = () => {
    Promise.all(cart.map((g) => axios.delete(`https://nexus-server-0fku.onrender.com/cart/${g.id}`)))
      .then(() => setCart([]))
      .catch((err) => console.error("Failed to clear cart:", err));
  };

  const subtotal = cart.reduce((sum, g) => sum + (Number(g.price) || 0), 0);
  const total    = subtotal - discount;

  const applyPromo = () => {
    if (promo.toUpperCase() === "NEXUS10") {
      setDiscount(subtotal * 0.1);
      setPromoMsg("10% discount applied!");
    } else {
      setDiscount(0);
      setPromoMsg("Invalid promo code.");
    }
  };

  return (
    <div className="vc-page">
      {/* Breadcrumb */}
      <div className="vc-breadcrumb">
        <GradientText colors={["#00ff33", "#34d9ef", "#4732ec"]} animationSpeed={10} showBorder={false}>
          <span style={{ fontSize: "15px", fontWeight: 700 }}>NEXUS</span>
        </GradientText>
        <span className="vc-sep">›</span>
        <span className="vc-crumb vc-crumb-active">Cart</span>
        <span className="vc-sep">›</span>
        <span className="vc-crumb">Checkout</span>
        <span className="vc-sep">›</span>
        <span className="vc-crumb">Payment</span>
      </div>

      <div className="vc-layout">
        {/* Left — cart items */}
        <div className="vc-left">
          <div className="vc-card-header">
            <div>
              <h2 className="vc-title">Cart</h2>
              <span className="vc-count">{cart.length} product{cart.length !== 1 ? "s" : ""}</span>
            </div>
            {cart.length > 0 && (
              <button className="vc-clear" onClick={clearCart}>✕ Clear cart</button>
            )}
          </div>

          {cart.length > 0 ? (
            <>
              <div className="vc-table-head">
                <span>Product</span>
                <span>Price</span>
              </div>
              <div className="vc-items">
                {cart.map((game, i) => (
                  <div className="vc-item" key={game.id} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="vc-item-left" onClick={() => navigate(`/game/${game.gameId}`)}>
                      <img
                        src={game.image}
                        alt={game.title}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/64x48?text=Game"; }}
                      />
                      <div>
                        <p className="vc-game-title">{game.title}</p>
                        <p className="vc-game-sub">Digital Download</p>
                      </div>
                    </div>
                    <div className="vc-item-right">
                      <p className="vc-price">${(Number(game.price) || 0).toFixed(2)}</p>
                      <button className="vc-remove" onClick={() => removeItem(game.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="vc-empty">
              <span>🎮</span>
              <p>Your cart is empty</p>
              <button className="vc-browse" onClick={() => navigate("/")}>Browse Games</button>
            </div>
          )}
        </div>

        {/* Right — summary */}
        {cart.length > 0 && (
          <div className="vc-right">
            <div className="vc-promo-box">
              <p className="vc-section-label">Promo code</p>
              <div className="vc-promo-row">
                <input
                  className="vc-promo-input"
                  placeholder="Type here…"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                />
                <button className="vc-promo-btn" onClick={applyPromo}>Apply</button>
              </div>
              {promoMsg && (
                <p className={`vc-promo-msg ${discount > 0 ? "success" : "error"}`}>{promoMsg}</p>
              )}
            </div>

            <div className="vc-totals">
              <div className="vc-totals-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="vc-totals-row">
                <span>Discount</span>
                <span className="vc-discount">-${discount.toFixed(2)}</span>
              </div>
              <div className="vc-totals-row vc-totals-final">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="vc-checkout-btn" onClick={() => navigate("/payment")}>
              Continue to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCart;