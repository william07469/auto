import React, { useEffect, useRef } from "react";
import { VehicleType } from "./types";
import { VEHICLE_OPTIONS } from "./bookingData";
import { Check, Car, Truck, Bus, Zap } from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedVehicleId: VehicleType | null;
  onSelectVehicle: (id: VehicleType) => void;
}

// Simple icon map — no images, just lucide icons
const VEHICLE_ICONS: Record<string, React.ReactNode> = {
  sedan: <Car style={{ width: 22, height: 22 }} />,
  suv: <Car style={{ width: 22, height: 22 }} />,
  van: <Bus style={{ width: 22, height: 22 }} />,
  coupe: <Zap style={{ width: 22, height: 22 }} />,
  pickup: <Truck style={{ width: 22, height: 22 }} />,
};

export const VehicleStep: React.FC<Props> = ({ selectedVehicleId, onSelectVehicle }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".vehicle-card"),
      { opacity: 0, y: 22, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.07, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={ref} className="space-y-8 max-w-3xl mx-auto">
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
          Schritt 3
        </p>
        <h3
          style={{
            fontSize: "clamp(1.6rem,3.5vw,2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Welches Fahrzeug?
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            maxWidth: 440,
          }}
        >
          Wählen Sie die Fahrzeugklasse. Bei größeren Fahrzeugen kann ein kleiner Aufpreis anfallen.
        </p>
      </div>

      {/* Vehicle list — single column rows, no images */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {VEHICLE_OPTIONS.map((vehicle) => {
          const selected = selectedVehicleId === vehicle.id;
          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelectVehicle(vehicle.id)}
              className="vehicle-card w-full text-left"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderRadius: "0.875rem",
                border: selected
                  ? "2px solid #fff"
                  : "1.5px solid rgba(255,255,255,0.1)",
                background: selected ? "#fff" : "#141414",
                boxShadow: selected ? "0 4px 24px rgba(255,255,255,0.08)" : "none",
                transition: "all 0.22s ease",
                cursor: "pointer",
              }}
            >
              {/* Icon box */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "0.6rem",
                  background: selected ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)",
                  border: selected ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "#111827" : "rgba(255,255,255,0.55)",
                  flexShrink: 0,
                }}
              >
                {VEHICLE_ICONS[vehicle.id]}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: selected ? "#111827" : "#fff",
                    marginBottom: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {vehicle.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: selected ? "#6b7280" : "rgba(255,255,255,0.38)",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {vehicle.description}
                </p>
              </div>

              {/* Surcharge badge */}
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                {vehicle.surcharge > 0 ? (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: selected ? "#374151" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    +€{vehicle.surcharge}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: selected ? "#6b7280" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    Inklusive
                  </span>
                )}
              </div>

              {/* Check circle */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: selected ? "#111827" : "transparent",
                  border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                }}
              >
                {selected && (
                  <Check style={{ width: 12, height: 12, color: "#fff", strokeWidth: 3 }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
        * Aufpreise für größere Fahrzeuge werden im Preisüberblick berücksichtigt.
      </p>
    </div>
  );
};
