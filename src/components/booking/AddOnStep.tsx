import React, { useEffect, useRef } from "react";
import { ADDONS_DATA } from "./bookingData";
import { Gauge, Lightbulb, Wind, Circle, Sparkles, ShieldCheck, Check } from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedAddOnIds: string[];
  onToggleAddOn: (id: string) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  Gauge: <Gauge className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Circle: <Circle className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

export const AddOnStep: React.FC<Props> = ({ selectedAddOnIds, onToggleAddOn }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".addon-row"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" }
    );
  }, []);

  const selectedTotal = ADDONS_DATA.filter((a) => selectedAddOnIds.includes(a.id)).reduce(
    (s, a) => s + a.price,
    0
  );

  return (
    <div ref={ref} className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
          Step 3 of 5
        </p>
        <h3 style={{ fontSize: "clamp(1.6rem,3.5vw,2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
          Any extras?
        </h3>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 440 }}>
          Optional add-ons performed by the same technician during your appointment.
        </p>
      </div>

      {/* Running total pill */}
      {selectedAddOnIds.length > 0 && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "0.5rem 1rem",
            borderRadius: 999,
            background: "#111827",
            color: "#fff",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em" }}>
            {selectedAddOnIds.length} extra{selectedAddOnIds.length > 1 ? "s" : ""} — +€{selectedTotal}
          </span>
        </div>
      )}

      {/* Extras list */}
      <div
        style={{
          borderRadius: "1rem",
          border: "1.5px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          background: "#141414",
        }}
      >
        {ADDONS_DATA.map((addon, idx) => {
          const selected = selectedAddOnIds.includes(addon.id);
          const isLast = idx === ADDONS_DATA.length - 1;

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggleAddOn(addon.id)}
              className="addon-row w-full text-left"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.1rem 1.25rem",
                background: selected ? "rgba(255,255,255,0.06)" : "transparent",
                borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "background 0.18s ease",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "0.35rem",
                  border: selected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  background: selected ? "#fff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                }}
              >
                {selected && <Check style={{ width: 12, height: 12, color: "#000", strokeWidth: 3 }} />}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "0.55rem",
                  background: selected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                  border: "1px solid",
                  borderColor: selected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "#fff" : "rgba(255,255,255,0.4)",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                }}
              >
                {ICONS[addon.iconName] ?? <Sparkles className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                  <h5
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: selected ? "#fff" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    {addon.name}
                  </h5>
                  {addon.badge && (
                    <span
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {addon.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                  {addon.description}
                </p>
              </div>

              {/* Price */}
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    letterSpacing: "-0.02em",
                    color: selected ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  +€{addon.price}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
        All extras are optional — press <strong style={{ color: "rgba(255,255,255,0.5)" }}>Continue</strong> to skip.
      </p>
    </div>
  );
};
