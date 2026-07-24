import React, { useEffect, useRef } from "react";
import { CustomerDetails } from "./types";
import gsap from "gsap";

interface CustomerStepProps {
  customer: CustomerDetails;
  onChangeCustomer: (updated: Partial<CustomerDetails>) => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({ customer, onChangeCustomer }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          Step 6 — Contact Details
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          Who is this booking for?
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 400 }}>
          Enter your details so we can confirm your appointment.
        </p>
      </div>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Full Name */}
        <div className="group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
            }}
          >
            Full Name *
          </label>
          <input
            type="text"
            required
            value={customer.fullName}
            onChange={(e) => onChangeCustomer({ fullName: e.target.value })}
            placeholder="e.g. Max Mustermann"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "1.1rem 1.25rem",
              fontSize: "0.95rem",
              color: "#ffffff",
              outline: "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(96,165,250,0.6)";
              e.target.style.background = "rgba(96,165,250,0.03)";
              e.target.style.boxShadow = "0 0 20px rgba(96,165,250,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.background = "rgba(255,255,255,0.02)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Email & Phone in 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              required
              value={customer.email}
              onChange={(e) => onChangeCustomer({ email: e.target.value })}
              placeholder="max@example.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "1.1rem 1.25rem",
                fontSize: "0.95rem",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(96,165,250,0.6)";
                e.target.style.background = "rgba(96,165,250,0.03)";
                e.target.style.boxShadow = "0 0 20px rgba(96,165,250,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                e.target.style.background = "rgba(255,255,255,0.02)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
              }}
            >
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) => onChangeCustomer({ phone: e.target.value })}
              placeholder="+49 170 123 4567"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "1.1rem 1.25rem",
                fontSize: "0.95rem",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(96,165,250,0.6)";
                e.target.style.background = "rgba(96,165,250,0.03)";
                e.target.style.boxShadow = "0 0 20px rgba(96,165,250,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                e.target.style.background = "rgba(255,255,255,0.02)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Optional Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
            }}
          >
            Notes <span style={{ textTransform: "none", letterSpacing: "normal", color: "rgba(255,255,255,0.2)" }}>(optional)</span>
          </label>
          <textarea
            value={customer.notes}
            onChange={(e) => onChangeCustomer({ notes: e.target.value })}
            rows={3}
            placeholder="Any specific requests or vehicle details..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "1.1rem 1.25rem",
              fontSize: "0.95rem",
              color: "#ffffff",
              outline: "none",
              resize: "none",
              lineHeight: 1.6,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(96,165,250,0.6)";
              e.target.style.background = "rgba(96,165,250,0.03)";
              e.target.style.boxShadow = "0 0 20px rgba(96,165,250,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.background = "rgba(255,255,255,0.02)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
};
