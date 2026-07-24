import React, { useEffect, useRef } from "react";
import { CustomerDetails } from "./types";
import { User, Phone, Mail, FileText, Lock } from "lucide-react";
import gsap from "gsap";

interface Props {
  customer: CustomerDetails;
  onChangeCustomer: (updated: Partial<CustomerDetails>) => void;
}

const FIELDS = [
  { key: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Max Mustermann", icon: User, span: 2, required: true },
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+49 170 123 4567", icon: Phone, span: 1, required: true },
  { key: "email", label: "Email Address", type: "email", placeholder: "max@example.com", icon: Mail, span: 1, required: true },
];

export const CustomerStep: React.FC<Props> = ({ customer, onChangeCustomer }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={ref} className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 07
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          Your details
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          Used to confirm your appointment and send a reminder. Never shared with third parties.
        </p>
      </div>

      {/* Form card */}
      <div
        style={{
          padding: "2rem",
          borderRadius: "1rem",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }}
          className="grid-cols-1 sm:grid-cols-2"
        >
          {FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.key}
                style={{ gridColumn: field.span === 2 ? "span 2" : "span 1" }}
                className="group"
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.32)",
                    marginBottom: 8,
                    transition: "color 0.2s",
                  }}
                  className="group-focus-within:!text-white/60"
                >
                  <Icon style={{ width: 11, height: 11 }} />
                  {field.label}
                  {field.required && <span style={{ color: "rgba(255,255,255,0.18)" }}>*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={customer[field.key as keyof CustomerDetails] as string}
                  onChange={(e) => onChangeCustomer({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "0.65rem",
                    padding: "0.9rem 1rem",
                    fontSize: "0.88rem",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                  className="placeholder-white/20"
                />
              </div>
            );
          })}

          {/* Notes */}
          <div style={{ gridColumn: "span 2" }} className="group">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.6rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "rgba(255,255,255,0.32)",
                marginBottom: 8,
              }}
              className="group-focus-within:!text-white/60"
            >
              <FileText style={{ width: 11, height: 11 }} />
              Notes
              <span style={{ color: "rgba(255,255,255,0.18)", textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>(optional)</span>
            </label>
            <textarea
              value={customer.notes}
              onChange={(e) => onChangeCustomer({ notes: e.target.value })}
              rows={3}
              placeholder="Special requests, PPF present, access instructions…"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "0.65rem",
                padding: "0.9rem 1rem",
                fontSize: "0.88rem",
                color: "#fff",
                outline: "none",
                resize: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              className="placeholder-white/20"
            />
          </div>
        </div>

        {/* Privacy */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock style={{ width: 13, height: 13, color: "rgba(255,255,255,0.28)" }} />
          </div>
          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.22)", lineHeight: 1.65, paddingTop: 2 }}>
            Your data is encrypted and processed confidentially. Not shared with third parties. Deletion available on request.
          </p>
        </div>
      </div>
    </div>
  );
};
