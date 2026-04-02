import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Payment.css";

function Payment() {
  const [flipped, setFlipped]   = useState(false);
  const [paid, setPaid]         = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const v = watch(); // live values for card preview

  // Redirect countdown
  useEffect(() => {
    if (!paid) return;
    const t = setTimeout(() => navigate("/"), 5000);
    const i = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, [paid]);

  const fmtNumber = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    setValue("number", val, { shouldValidate: true });
  };

  const fmtExpiry = (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 4);
    setValue("expiry", d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d, { shouldValidate: true });
  };

  return (
    <div className="page">
      <div className="layout">

        {/* Card Preview */}
        <div className="card-side">
          <div className={`card-scene ${flipped ? "flipped" : ""}`}>
            <div className="card-inner">
              <div className="card-face card-front">
                <div className="card-top">
                  <div className="chip" />
                  <div className="circles">
                    <div className="circle circle-red" />
                    <div className="circle circle-orange" />
                  </div>
                </div>
                <div className="card-number">{v.number || "•••• •••• •••• ••••"}</div>
                <div className="card-bottom">
                  <div>
                    <p className="card-label">Card Holder</p>
                    <p className="card-value">{v.name?.toUpperCase().slice(0, 20) || "YOUR NAME"}</p>
                  </div>
                  <div>
                    <p className="card-label">Expires</p>
                    <p className="card-value">{v.expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>
              <div className="card-face card-back">
                <div className="magnetic-stripe" />
                <div className="cvv-row">
                  <span className="card-label">CVV</span>
                  <div className="cvv-box">{v.cvv || "•••"}</div>
                </div>
                <p className="card-disclaimer">AUTHORIZED SIGNATURE — NOT VALID UNLESS SIGNED</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-side">
          {paid ? (
            <div className="success">
              <div className="success-icon">✓</div>
              <p className="success-title">Payment Successful</p>
              <p className="success-sub">Your transaction has been processed securely.</p>
              <div className="countdown-ring">
                <svg viewBox="0 0 40 40">
                  <circle className="countdown-track" cx="20" cy="20" r="17" />
                  <circle className="countdown-fill" cx="20" cy="20" r="17"
                    style={{ strokeDashoffset: 107 - (107 * (5 - countdown) / 5) }} />
                </svg>
                <span className="countdown-num">{countdown}</span>
              </div>
              <p className="redirect-note">Redirecting in {countdown}s…</p>
            </div>
          ) : (
            <>
              <h2 className="form-title">Payment Details</h2>
              <p className="form-sub">Enter your card information below</p>

              <div className="field">
                <label className="label">Card Number</label>
                <input className={`input mono ${errors.number ? "input-error" : ""}`}
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  {...register("number", {
                    required: "Card number is required",
                    validate: (v) => v.replace(/\s/g, "").length === 16 || "Must be 16 digits",
                  })}
                  onChange={fmtNumber}
                />
                {errors.number && <p className="error-msg">{errors.number.message}</p>}
              </div>

              <div className="field">
                <label className="label">Cardholder Name</label>
                <input className={`input ${errors.name ? "input-error" : ""}`}
                  placeholder="John Doe" maxLength={40}
                  {...register("name", { required: "Name is required" })}
                  onKeyDown={(e) => /\d/.test(e.key) && e.preventDefault()}
                />
                {errors.name && <p className="error-msg">{errors.name.message}</p>}
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Expiry</label>
                  <input className={`input mono ${errors.expiry ? "input-error" : ""}`}
                    placeholder="MM/YY" maxLength={5}
                    {...register("expiry", {
                      required: "Expiry is required",
                      pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "Use MM/YY format" },
                      validate: (v) => {
                        const [mm, yy] = v.split("/");
                        return new Date(2000 + +yy, +mm - 1, 1) >= new Date() || "Card has expired";
                      },
                    })}
                    onChange={fmtExpiry}
                  />
                  {errors.expiry && <p className="error-msg">{errors.expiry.message}</p>}
                </div>

                <div className="field">
                  <label className="label">CVV</label>
                  <input className={`input mono ${errors.cvv ? "input-error" : ""}`}
                    placeholder="•••" maxLength={4}
                    {...register("cvv", {
                      required: "CVV is required",
                      pattern: { value: /^\d{3,4}$/, message: "Must be 3 or 4 digits" },
                    })}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                  />
                  {errors.cvv && <p className="error-msg">{errors.cvv.message}</p>}
                </div>
              </div>

              <button className="pay-btn" type="button" onClick={handleSubmit(() => setPaid(true))}>
                Pay Now
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Payment;