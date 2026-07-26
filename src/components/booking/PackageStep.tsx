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
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.09, ease: "power3.out" }
    );
  }, [selectedServiceId]);

  return (
    <div ref={ref} className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
          Step 2 of 5
        </p>
        <h3 style={{ fontSize: "clamp(1.6rem,3.5vw,2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
          Choose your package
        </h3>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 440 }}>
          Each package builds on the previous level. Pick the level of care your vehicle deserves.
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg, idx) => {
          const selected = selectedPackageId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              className="pkg-card text-left flex flex-col"
              style={{
                borderRadius: "1rem",
                border: selected ? "2px solid #fff" : "1.5px solid rgba(255,255,255,0.1)",
                background: selected ? "#fff" : "#141414",
                boxShadow: selected ? "0 6px 28px rgba(255,255,255,0.08)" : "none",
                transition: "all 0.22s ease",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Recommended top bar */}
              {pkg.recommended && (
                <div
                  style={{
                    background: selected ? "rgba(0,0,0,0.08)" : "#fff",
                    padding: "0.45rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: selected ? "#374151" : "#111827",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Tier */}
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: selected ? "#6b7280" : "rgba(255,255,255,0.3)",
                    marginBottom: 6,
                  }}
                >
                  Tier 0{idx + 1}
                </p>

                {/* Name */}
                <h4
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: selected ? "#111827" : "#fff",
                    marginBottom: 3,
                  }}
                >
                  {pkg.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    color: selected ? "#9ca3af" : "rgba(255,255,255,0.3)",
                    marginBottom: 12,
                  }}
                >
                  {pkg.tagline}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: selected ? "#6b7280" : "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                    marginBottom: "1.1rem",
                  }}
                >
                  {pkg.description}
                </p>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, marginBottom: "1.25rem" }}>
                  {pkg.features.map((feat, fi) => (
                    <li
                      key={fi}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.78rem",
                        color: selected ? "#374151" : "rgba(255,255,255,0.5)",
                        padding: "5px 0",
                        borderBottom: selected
                          ? "1px solid rgba(0,0,0,0.06)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Check
                        style={{
                          width: 13,
                          height: 13,
                          flexShrink: 0,
                          marginTop: 2,
                          color: selected ? "#374151" : "rgba(255,255,255,0.4)",
                          strokeWidth: 2.5,
                        }}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* Price row */}
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: selected ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: selected ? "#9ca3af" : "rgba(255,255,255,0.25)", marginBottom: 2 }}>
                      From
                    </p>
                    <span
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        fontFamily: "monospace",
                        color: selected ? "#111827" : "#fff",
                      }}
                    >
                      €{pkg.price}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: "0.7rem",
                      color: selected ? "#9ca3af" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    <Clock style={{ width: 12, height: 12 }} />
                    <span style={{ fontFamily: "monospace" }}>{pkg.duration}</span>
                  </div>
                </div>

                {/* Select indicator */}
                <div
                  style={{
                    marginTop: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: selected ? "#111827" : "transparent",
                      border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected && <Check style={{ width: 11, height: 11, color: "#fff", strokeWidth: 3 }} />}
                  </div>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: selected ? "#374151" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {selected ? "Selected" : "Select"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
