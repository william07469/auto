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
  Car: <Car className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

export const ServiceStep: React.FC<Props> = ({ selectedServiceId, onSelectService }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".svc-card"),
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" }
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
          Schritt 1
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
          Was benötigen Sie?
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            maxWidth: 480,
          }}
        >
          Wählen Sie eine Kategorie. Im nächsten Schritt können Sie ein{" "}
          <strong style={{ color: "rgba(255,255,255,0.7)" }}>Paket</strong> oder eine{" "}
          <strong style={{ color: "rgba(255,255,255,0.7)" }}>Einzelleistung</strong> buchen.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES_DATA.map((svc) => {
          const selected = selectedServiceId === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => onSelectService(svc.id)}
              className="svc-card text-left flex flex-col"
              style={{
                padding: "1.25rem",
                borderRadius: "0.875rem",
                border: selected
                  ? "2px solid #fff"
                  : "1.5px solid rgba(255,255,255,0.1)",
                background: selected ? "#fff" : "#141414",
                boxShadow: selected
                  ? "0 4px 24px rgba(255,255,255,0.08)"
                  : "none",
                transition: "all 0.22s ease",
                cursor: "pointer",
              }}
            >
              {/* Badge — inline at top, not absolute */}
              {svc.badge && (
                <div style={{ marginBottom: "0.625rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: selected
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.07)",
                      color: selected ? "#111827" : "rgba(255,255,255,0.5)",
                      border: selected
                        ? "1px solid rgba(0,0,0,0.12)"
                        : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {svc.badge}
                  </span>
                </div>
              )}

              {/* Icon box */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "0.6rem",
                  background: selected
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.06)",
                  border: selected
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "#111827" : "rgba(255,255,255,0.6)",
                  marginBottom: "0.875rem",
                  flexShrink: 0,
                }}
              >
                {ICONS[svc.iconName]}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: selected ? "#111827" : "#fff",
                    marginBottom: 3,
                  }}
                >
                  {svc.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: selected ? "#6b7280" : "rgba(255,255,255,0.35)",
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {svc.tagline}
                </p>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: selected ? "#6b7280" : "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                  }}
                >
                  {svc.description}
                </p>
              </div>

              {/* Selected row */}
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.875rem",
                  borderTop: selected
                    ? "1px solid rgba(0,0,0,0.08)"
                    : "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: selected ? "#111827" : "transparent",
                    border: selected
                      ? "none"
                      : "1.5px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected && (
                    <Check
                      style={{ width: 10, height: 10, color: "#fff", strokeWidth: 3 }}
                    />
                  )}
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
                  {selected ? "Ausgewählt" : "Auswählen"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
