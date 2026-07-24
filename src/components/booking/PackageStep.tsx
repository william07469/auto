import React, { useEffect, useRef } from "react";
import { ServiceId, PackageId } from "./types";
import { PACKAGES_DATA } from "./bookingData";
import { Check, Clock } from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedServiceId: ServiceId;
  selectedPackageId: PackageId | null;
  onSelectPackage: (id: PackageId) => void;
}

export const PackageStep: React.FC<Props> = ({
  selectedServiceId,
  selectedPackageId,
  onSelectPackage,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const packages = PACKAGES_DATA[selectedServiceId] ?? [];

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".pkg-card"),
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: "power3.out" }
    );
  }, [selectedServiceId]);

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 02
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          Select your package
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          Each package builds on the previous. Choose the level of care your vehicle deserves.
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg, idx) => {
          const selected = selectedPackageId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              className="pkg-card group relative text-left flex flex-col"
              style={{
                padding: "1.75rem 1.5rem",
                borderRadius: "1rem",
                border: selected
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: selected
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                boxShadow: selected
                  ? "0 0 40px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "none",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                }
              }}
            >
              {/* Recommended top accent line */}
              {pkg.recommended && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "15%",
                    right: "15%",
                    height: 1,
                    background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                />
              )}

              {/* Recommended badge */}
              {pkg.recommended && (
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  Recommended
                </div>
              )}

              {/* Tier number */}
              <div
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  marginBottom: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {idx === 0 ? "Tier 01" : idx === 1 ? "Tier 02" : "Tier 03"}
              </div>

              {/* Name & tagline */}
              <h4
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: selected ? "#fff" : "rgba(255,255,255,0.75)",
                  marginBottom: 4,
                  transition: "color 0.3s",
                }}
              >
                {pkg.name}
              </h4>
              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: selected ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.22)",
                  marginBottom: "1rem",
                  transition: "color 0.3s",
                }}
              >
                {pkg.tagline}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.32)",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                }}
              >
                {pkg.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, marginBottom: "1.5rem" }}>
                {pkg.features.map((feat, fi) => (
                  <li
                    key={fi}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.38)",
                      padding: "5px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: selected ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                        marginTop: 5,
                        flexShrink: 0,
                        transition: "background 0.3s",
                      }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Price & duration */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 2 }}>
                    from
                  </p>
                  <span
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      letterSpacing: "-0.03em",
                      color: selected ? "#fff" : "rgba(255,255,255,0.55)",
                      transition: "color 0.3s",
                    }}
                  >
                    €{pkg.price}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.25)", fontSize: "0.68rem" }}>
                  <Clock style={{ width: 11, height: 11 }} />
                  <span style={{ fontFamily: "monospace" }}>{pkg.duration}</span>
                </div>
              </div>

              {/* Selected indicator */}
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: selected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                  transition: "color 0.3s",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: selected ? "#fff" : "transparent",
                    border: selected ? "none" : "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                  }}
                >
                  {selected && <Check style={{ width: 9, height: 9, color: "#000", strokeWidth: 3 }} />}
                </div>
                {selected ? "Selected" : "Choose"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
