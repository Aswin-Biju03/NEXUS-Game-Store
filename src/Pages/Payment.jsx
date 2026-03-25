import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

function formatCardNumber(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function Payment() {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [flipped, setFlipped] = useState(false);
  const [paid, setPaid] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (!paid) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paid, navigate]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "number") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setCard((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="page">
      <div className="layout">

        {/* LEFT — Card */}
        <div className="card-side">
          <div className={`card-scene ${flipped ? "flipped" : ""}`}>
            <div className="card-inner">

              {/* Front */}
              <div className="card-face card-front">
                <div className="card-top">
                  <div className="chip" />
                  <div className="circles">
                    <div className="circle circle-red" />
                    <div className="circle circle-orange" />
                  </div>
                </div>
                <div className="card-number">
                  {card.number || "•••• •••• •••• ••••"}
                </div>
                <div className="card-bottom">
                  <div>
                    <p className="card-label">Card Holder</p>
                    <p className="card-value">
                      {card.name ? card.name.toUpperCase().slice(0, 20) : "YOUR NAME"}
                    </p>
                  </div>
                  <div>
                    <p className="card-label">Expires</p>
                    <p className="card-value">{card.expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="card-face card-back">
                <div className="magnetic-stripe" />
                <div className="cvv-row">
                  <span className="card-label">CVV</span>
                  <div className="cvv-box">{card.cvv || "•••"}</div>
                </div>
                <p className="card-disclaimer">AUTHORIZED SIGNATURE — NOT VALID UNLESS SIGNED</p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="form-side">
          {paid ? (
            <div className="success">
              <div className="success-icon">✓</div>
              <p className="success-title">Payment Successful</p>
              <p className="success-sub">Your transaction has been processed securely.</p>
              <div className="countdown-ring">
                <svg viewBox="0 0 40 40">
                  <circle className="countdown-track" cx="20" cy="20" r="17" />
                  <circle
                    className="countdown-fill"
                    cx="20" cy="20" r="17"
                    style={{ strokeDashoffset: 107 - (107 * (5 - countdown) / 5) }}
                  />
                </svg>
                <span className="countdown-num">{countdown}</span>
              </div>
              <p className="redirect-note">Redirecting to homepage in {countdown}s…</p>
            </div>
          ) : (
            <>
              <h2 className="form-title">Payment Details</h2>
              <p className="form-sub">Enter your card information below</p>

              <div className="field">
                <label className="label">Card Number</label>
                <input
                  className="input mono"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={handleChange}
                  maxLength={19}
                />
              </div>

              <div className="field">
                <label className="label">Cardholder Name</label>
                <input
                  className="input"
                  name="name"
                  placeholder="John Doe"
                  value={card.name}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Expiry</label>
                  <input
                    className="input mono"
                    name="expiry"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={handleChange}
                    maxLength={5}
                  />
                </div>
                <div className="field">
                  <label className="label">CVV</label>
                  <input
                    className="input mono"
                    name="cvv"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={handleChange}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    maxLength={4}
                  />
                </div>
              </div>

              <button className="pay-btn" onClick={() => setPaid(true)}>
                Pay Now
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}