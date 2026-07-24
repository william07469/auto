import React, { useEffect, useRef } from "react";
import { ADDONS_DATA } from "./bookingData";
import { Check, Plus } from "lucide-react";
import gsap from "gsap";

interface AddOnStepProps {
  selectedAddOnIds: string[];
  onToggleAddOn: (id: string) => void;
}

export const AddOnStep: React.FC<AddOnStepProps> = ({ selectedAddOnIds, onToggleAddOn }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".addon-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }
    );
  }, []);

  const totalSelected = selectedAddOnIds.length;
  const totalAdded = ADDONS_DATA.filter((a) => selectedAddOnIds.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );

  return (
    <div ref={containerRef} style={{ maxWidth: 840, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
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
          Step 3 — Optional Add-ons
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
          Enhance your treatment
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 460 }}>
            Select additional services. You can select multiple items or skip this step entirely.
          </p>

          {totalSelected > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.4rem 0.9rem",
                borderRadius: 99,
                background: "rgba(96,165,250,0.08)",
                border: "1px solid rgba(96,165,250,0.25)",
              }}
            >
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)" }}>
                {totalSelected} selected
              </span>
              <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "rgb(96,165,250)", fontWeight: 600 }}>
                +€{totalAdded}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Add-on Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {ADDONS_DATA.map((addon) => {
          const isSelected = selectedAddOnIds.includes(addon.id);

          return (
            <button
              key={addon.id}
              type="button"
              id={`addon-${addon.id}`}
              onClick={() => onToggleAddOn(addon.id)}
              className="addon-card group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "left",
                borderRadius: 18,
                padding: "1.5rem",
                background: isSelected ? "rgba(96,165,250,0.06)" : "rgba(255,255,255,0.018)",
                border: isSelected
                  ? "1px solid rgba(96,165,250,0.45)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isSelected
                  ? "0 0 30px rgba(96,165,250,0.12)"
                  : "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                minHeight: 150,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.018)";
                }
              }}
            >
              <div>
                {/* Header row: name & badge/price */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 500 : 400,
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                      lineHeight: 1.3,
                      transition: "color 0.25s",
                    }}
                  >
                    {addon.name}
                  </h3>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: isSelected ? "1px solid rgba(96,165,250,0.8)" : "1px solid rgba(255,255,255,0.15)",
                      background: isSelected ? "rgba(96,165,250,0.2)" : "transparent",
                      transition: "all 0.3s",
                    }}
                  >
                    {isSelected ? (
                      <Check size={11} color="rgba(96,165,250,1)" strokeWidth={3} />
                    ) : (
                      <Plus size={11} color="rgba(255,255,255,0.3)" />
                    )}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.32)",
                    lineHeight: 1.5,
                  }}
                >
                  {addon.description}
                </p>
              </div>

              {/* Price footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1.25rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  Add-on
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    fontFamily: "monospace",
                    color: isSelected ? "rgb(96,165,250)" : "rgba(255,255,255,0.6)",
                  }}
                >
                  +€{addon.price}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
