import React, { useEffect, useRef } from "react";
import { ServiceId } from "./types";
import { SERVICES_DATA } from "./bookingData";
import { Car, Armchair, Star, Sparkles, ShieldCheck, Check } from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedServiceId: ServiceId | null;
  onSelectService: (id: ServiceId) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  Car: <Car className="w-6 h-6" />,
  Armchair: <Armchair className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
};

export const ServiceStep: React.FC<Props> = ({ selectedServiceId, onSelectService }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".svc-card"),
      { opacity: 0, y: 32, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 01
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          Choose your service
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          Select the primary treatment for your vehicle. Package options follow in the next step.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES_DATA.map((svc) => {
          const selected = selectedServiceId === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => onSelectService(svc.id)}
              className="svc-card group relative text-left flex flex-col"
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                border: selected
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: selected
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                boxShadow: selected ? "0 0 40px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer",
                minHeight: 200,
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
              {/* Badge */}
              {svc.badge && (
                <span
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
                    border: svc.popular ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
                    color: svc.popular ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                    background: svc.popular ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  {svc.badge}
                </span>
              )}

              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "0.65rem",
                  border: selected ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                  background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "#fff" : "rgba(255,255,255,0.38)",
                  marginBottom: "1rem",
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
              >
                {ICONS[svc.iconName]}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.02em", color: selected ? "#fff" : "rgba(255,255,255,0.75)", marginBottom: 4, transition: "color 0.3s" }}>
                  {svc.name}
                </h4>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: selected ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)", marginBottom: 10, transition: "color 0.3s" }}>
                  {svc.tagline}
                </p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  {svc.description}
                </p>
              </div>

              {/* Selected indicator */}
              <div
                style={{
                  marginTop: "1.2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: selected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                  transition: "color 0.3s",
                }}
              >
                {selected ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check style={{ width: 9, height: 9, color: "#000", strokeWidth: 3 }} />
                    </div>
                    Selected
                  </>
                ) : (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
                    Select
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
