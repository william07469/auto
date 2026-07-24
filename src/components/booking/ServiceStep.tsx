import React, { useEffect, useRef } from "react";
import { ServiceId } from "./types";
import { SERVICES_DATA } from "./bookingData";
import { Check } from "lucide-react";
import gsap from "gsap";

interface ServiceStepProps {
  selectedServiceId: ServiceId | null;
  onSelectService: (serviceId: ServiceId) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({ selectedServiceId, onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".service-row");
    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Heading */}
      <div style={{ marginBottom: "3.5rem" }}>
        <p style={{
          fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", fontWeight: 500, marginBottom: "1rem"
        }}>
          Step 1 — Service
        </p>
        <h2 style={{
          fontSize: "clamp(2rem, 5vw, 3.25rem)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
          color: "#ffffff",
          lineHeight: 1,
          marginBottom: "1rem"
        }}>
          What does your vehicle<br />need today?
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 380 }}>
          Select the primary treatment to get started. Add-ons are configured in the next step.
        </p>
      </div>

      {/* Service list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {SERVICES_DATA.map((service, idx) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              id={`service-${service.id}`}
              onClick={() => onSelectService(service.id)}
              className="service-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
                padding: "1.75rem 0",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                borderTop: idx === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.paddingLeft = "0.75rem";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                }
              }}
            >
              {/* Left: number + name */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", flex: 1 }}>
                <span style={{
                  fontSize: "0.65rem", fontFamily: "monospace",
                  color: isSelected ? "rgba(96,165,250,0.7)" : "rgba(255,255,255,0.2)",
                  minWidth: 20, transition: "color 0.25s",
                }}>
                  0{idx + 1}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.3rem" }}>
                    <h3 style={{
                      fontSize: "1.1rem", fontWeight: isSelected ? 500 : 400,
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.65)",
                      letterSpacing: "-0.01em", transition: "all 0.25s",
                    }}>
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span style={{
                        fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase",
                        padding: "0.2rem 0.6rem", borderRadius: 4,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.35)",
                      }}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: "0.75rem", color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.5, transition: "color 0.25s",
                  }}>
                    {service.tagline}
                  </p>
                </div>
              </div>

              {/* Right: duration + price + check */}
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", shrink: 0 } as any}>
                <span style={{
                  fontSize: "0.7rem", color: "rgba(255,255,255,0.22)",
                  display: "none",
                }} className="hidden sm:block">
                  {service.duration}
                </span>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    display: "block", fontSize: "0.55rem", letterSpacing: "0.2em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.15rem"
                  }}>from</span>
                  <span style={{
                    fontSize: "1.1rem", fontWeight: 600, fontFamily: "monospace",
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "color 0.25s",
                  }}>
                    €{service.startingPrice}
                  </span>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isSelected ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(255,255,255,0.1)",
                  background: isSelected ? "rgba(96,165,250,0.12)" : "transparent",
                  transition: "all 0.3s",
                }}>
                  {isSelected
                    ? <Check size={13} color="rgba(96,165,250,1)" strokeWidth={2.5} />
                    : <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected duration note */}
      {selectedServiceId && (() => {
        const s = SERVICES_DATA.find(x => x.id === selectedServiceId);
        return s ? (
          <div style={{
            marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.75rem",
          }}>
            <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
              Estimated time: <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{s.duration}</span>
            </span>
          </div>
        ) : null;
      })()}
    </div>
  );
};
