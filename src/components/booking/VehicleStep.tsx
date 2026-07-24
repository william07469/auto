import React, { useEffect, useRef } from "react";
import { VehicleDetails, VehicleSizeCategory } from "./types";
import { VEHICLE_SIZES } from "./bookingData";
import { Check } from "lucide-react";
import gsap from "gsap";

interface VehicleStepProps {
  vehicle: VehicleDetails;
  onChangeVehicle: (updated: Partial<VehicleDetails>) => void;
}

const VEHICLE_IMAGES: Record<string, string> = {
  coupe: "/vehicle-coupe.png",
  sedan: "/vehicle-sedan.png",
  suv: "/vehicle-suv.png",
  van: "/vehicle-van.png",
};

export const VehicleStep: React.FC<VehicleStepProps> = ({ vehicle, onChangeVehicle }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".vehicle-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 900, margin: "0 auto" }}>
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
          Step 2 — Vehicle Class
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
          Select your vehicle
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 420 }}>
          Vehicle size determines treatment duration and pricing adjustment.
        </p>
      </div>

      {/* Grid of Vehicle Image Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {VEHICLE_SIZES.map((size) => {
          const isSelected = vehicle.sizeCategory === size.id;
          const imageSrc = VEHICLE_IMAGES[size.id];

          return (
            <button
              key={size.id}
              type="button"
              id={`vehicle-${size.id}`}
              onClick={() => onChangeVehicle({ sizeCategory: size.id as VehicleSizeCategory })}
              className="vehicle-card group"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                borderRadius: 20,
                padding: "1.25rem",
                background: isSelected
                  ? "linear-gradient(180deg, rgba(96,165,250,0.08) 0%, rgba(8,8,12,0.95) 100%)"
                  : "rgba(255,255,255,0.02)",
                border: isSelected
                  ? "1px solid rgba(96,165,250,0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isSelected
                  ? "0 0 35px rgba(96,165,250,0.15), inset 0 0 20px rgba(96,165,250,0.05)"
                  : "0 10px 30px rgba(0,0,0,0.4)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }
              }}
            >
              {/* Check badge */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isSelected ? "1px solid rgba(96,165,250,0.8)" : "1px solid rgba(255,255,255,0.12)",
                  background: isSelected ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.03)",
                  transition: "all 0.3s",
                  zIndex: 2,
                }}
              >
                {isSelected && <Check size={11} color="rgba(96,165,250,1)" strokeWidth={3} />}
              </div>

              {/* Large vehicle image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  borderRadius: 14,
                  overflow: "hidden",
                  marginBottom: "1.25rem",
                  background: "#0a0a0e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imageSrc}
                  alt={size.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    filter: isSelected ? "brightness(1.1) contrast(1.05)" : "brightness(0.85) contrast(1)",
                  }}
                  className="group-hover:scale-105"
                />
              </div>

              {/* Title & info */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: isSelected ? 500 : 400,
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.75)",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {size.label}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.32)",
                      marginBottom: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {size.subtext}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "0.62rem",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    color: isSelected ? "rgba(96,165,250,0.8)" : "rgba(255,255,255,0.25)",
                  }}
                >
                  <span>{size.example.split(",")[0]}</span>
                  <span>{size.multiplier > 1.0 ? `+${Math.round((size.multiplier - 1) * 100)}%` : "Base"}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
