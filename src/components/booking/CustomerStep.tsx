import React, { useEffect, useRef } from "react";
import { CustomerDetails } from "./types";
import { User, Phone, Mail, FileText, Lock } from "lucide-react";
import gsap from "gsap";

interface Props {
  customer: CustomerDetails;
  onChangeCustomer: (updated: Partial<CustomerDetails>) => void;
}

const FIELDS = [
  {
    key: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "e.g. Max Mustermann",
    icon: User,
    span: 2,
    required: true,
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+49 170 123 4567",
    icon: Phone,
    span: 1,
    required: true,
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    placeholder: "max@example.com",
    icon: Mail,
    span: 1,
    required: true,
  },
];

export const CustomerStep: React.FC<Props> = ({ customer, onChangeCustomer }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={ref} className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        >
          Contact Details
        </p>
        <h3
          style={{
            fontSize: "clamp(1.4rem,3vw,1.875rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 6,
          }}
        >
          Your details
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 400 }}>
          Used to confirm your appointment. Never shared with third parties.
        </p>
      </div>

      {/* Form card */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1.5px solid rgba(255,255,255,0.1)",
          background: "#141414",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.1rem",
          }}
        >
          {FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.key}
                style={{
                  gridColumn: field.span === 2 ? "span 2" : "span 1",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                  }}
                >
                  <Icon style={{ width: 11, height: 11, color: "rgba(255,255,255,0.3)" }} />
                  {field.label}
                  {field.required && (
                    <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>*</span>
                  )}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={customer[field.key as keyof CustomerDetails] as string}
                  onChange={(e) =>
                    onChangeCustomer({ [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "#0d0d0d",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.65rem",
                    padding: "0.8rem 1rem",
                    fontSize: "0.9rem",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.18s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            );
          })}

          {/* Notes */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 6,
              }}
            >
              <FileText style={{ width: 11, height: 11, color: "rgba(255,255,255,0.3)" }} />
              Notes
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: "0.72rem",
                }}
              >
                (optional)
              </span>
            </label>
            <textarea
              value={customer.notes}
              onChange={(e) => onChangeCustomer({ notes: e.target.value })}
              rows={3}
              placeholder="Special requests, PPF present, access instructions…"
              style={{
                width: "100%",
                background: "#0d0d0d",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "0.65rem",
                padding: "0.8rem 1rem",
                fontSize: "0.9rem",
                color: "#fff",
                outline: "none",
                resize: "none",
                transition: "border-color 0.18s",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>

        {/* Privacy note */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock style={{ width: 12, height: 12, color: "rgba(255,255,255,0.3)" }} />
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, paddingTop: 2 }}>
            Your data is encrypted and processed confidentially. Not shared with third parties.
            Deletion available on request.
          </p>
        </div>
      </div>
    </div>
  );
};
