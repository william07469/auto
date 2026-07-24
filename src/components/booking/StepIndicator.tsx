import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Package" },
  { id: 3, label: "Questions" },
  { id: 4, label: "Add-ons" },
  { id: 5, label: "Date" },
  { id: 6, label: "Time" },
  { id: 7, label: "Contact" },
  { id: 8, label: "Summary" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${pct}%`,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  }, [pct]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-14">
      {/* Top row */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "rgba(255,255,255,0.25)",
            }}
            className="mb-1.5"
          >
            WV Detailing · Booking
          </p>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {STEPS[currentStep - 1]?.label}
          </h2>
        </div>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.35)",
            paddingBottom: 2,
          }}
        >
          {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "relative",
          height: 1,
          background: "rgba(255,255,255,0.07)",
          marginBottom: 24,
          borderRadius: 999,
        }}
      >
        <div
          ref={barRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 999,
            width: "0%",
            boxShadow: "0 0 8px rgba(255,255,255,0.2)",
          }}
        />
      </div>

      {/* Dots row */}
      <div className="flex items-start justify-between">
        {STEPS.map((step) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          const clickable = done;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => clickable && onStepClick(step.id)}
              disabled={!clickable}
              className="flex flex-col items-center gap-2"
              style={{ cursor: clickable ? "pointer" : "default" }}
            >
              {/* Dot */}
              <div
                style={{
                  width: active ? 26 : done ? 18 : 12,
                  height: active ? 26 : done ? 18 : 12,
                  borderRadius: "50%",
                  background: active
                    ? "#fff"
                    : done
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.04)",
                  border: active
                    ? "none"
                    : done
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid rgba(255,255,255,0.09)",
                  boxShadow: active ? "0 0 16px rgba(255,255,255,0.22)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  flexShrink: 0,
                }}
              >
                {active && (
                  <span style={{ fontSize: 8, fontWeight: 800, color: "#000" }}>
                    {step.id}
                  </span>
                )}
                {done && (
                  <Check
                    style={{
                      width: 8,
                      height: 8,
                      color: "rgba(255,255,255,0.7)",
                      strokeWidth: 3,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="hidden sm:block"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: active
                    ? "rgba(255,255,255,0.85)"
                    : done
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.14)",
                  transition: "color 0.3s",
                }}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
