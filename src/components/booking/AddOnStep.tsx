import React, { useEffect, useRef } from "react";
import { ADDONS_DATA } from "./bookingData";
import {
  Gauge, Lightbulb, Wind, Circle, Sparkles, ShieldCheck, Check, Plus,
} from "lucide-react";
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
      ref.current.querySelectorAll(".addon-card"),
      { opacity: 0, y: 22, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" }
    );
  }, []);

  const totalSelected = selectedAddOnIds.length;
  const totalPrice = ADDONS_DATA.filter((a) => selectedAddOnIds.includes(a.id)).reduce(
    (s, a) => s + a.price,
    0
  );

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 04
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          Recommended add-ons
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 460, marginTop: 8, lineHeight: 1.6 }}>
          Enhance your appointment with specialist treatments performed by the same technician. All optional.
        </p>
      </div>

      {/* Selection bar */}
      {totalSelected > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
            {totalSelected} add-on{totalSelected > 1 ? "s" : ""} selected
          </span>
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.65)", marginLeft: "auto" }}>
            +€{totalPrice}
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ADDONS_DATA.map((addon) => {
          const selected = selectedAddOnIds.includes(addon.id);
          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggleAddOn(addon.id)}
              className="addon-card group relative text-left"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.2rem 1.25rem",
                borderRadius: "0.875rem",
                border: selected
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: selected
                  ? "rgba(255,255,255,0.055)"
                  : "rgba(255,255,255,0.02)",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.13)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.032)";
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
              {addon.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 44,
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.45)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {addon.badge}
                </span>
              )}

              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "0.6rem",
                  border: selected
                    ? "1px solid rgba(255,255,255,0.22)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: selected
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "#fff" : "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {ICONS[addon.iconName] ?? <Sparkles className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <h5
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: selected ? "#fff" : "rgba(255,255,255,0.65)",
                      transition: "color 0.3s",
                    }}
                  >
                    {addon.name}
                  </h5>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.28)",
                      flexShrink: 0,
                      transition: "color 0.3s",
                    }}
                  >
                    +€{addon.price}
                  </span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>
                  {addon.description}
                </p>
              </div>

              {/* Toggle */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "0.35rem",
                  border: selected ? "none" : "1px solid rgba(255,255,255,0.14)",
                  background: selected ? "#fff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                  transition: "all 0.28s",
                }}
              >
                {selected
                  ? <Check style={{ width: 12, height: 12, color: "#000", strokeWidth: 3 }} />
                  : <Plus style={{ width: 12, height: 12, color: "rgba(255,255,255,0.25)" }} />
                }
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
        You can skip add-ons by pressing{" "}
        <span style={{ color: "rgba(255,255,255,0.35)" }}>Continue</span> below.
      </p>
    </div>
  );
};
