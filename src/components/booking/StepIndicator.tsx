import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Vehicle" },
  { id: 3, label: "Add-ons" },
  { id: 4, label: "Date" },
  { id: 5, label: "Time" },
  { id: 6, label: "Contact" },
  { id: 7, label: "Summary" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  useEffect(() => {
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        width: `${percentage}%`,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [percentage]);

  return (
    <div style={{ maxWidth: 840, margin: "0 auto 4rem" }}>
      {/* Top Meta info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "monospace",
          }}
        >
          {STEPS[currentStep - 1]?.label}
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            fontFamily: "monospace",
            color: "rgba(96,165,250,0.8)",
          }}
        >
          0{currentStep} / 0{totalSteps}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          position: "relative",
          height: 1,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          marginBottom: "1.5rem",
        }}
      >
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "0%",
            background: "rgb(96,165,250)",
            boxShadow: "0 0 12px rgba(96,165,250,0.6)",
            borderRadius: 99,
          }}
        />
      </div>

      {/* Minimal Dots & Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => isCompleted && onStepClick(s.id)}
              disabled={!isCompleted}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: isCompleted ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <div
                style={{
                  width: isCurrent ? 8 : isCompleted ? 6 : 4,
                  height: isCurrent ? 8 : isCompleted ? 6 : 4,
                  borderRadius: "50%",
                  background: isCurrent
                    ? "rgb(96,165,250)"
                    : isCompleted
                    ? "rgba(96,165,250,0.4)"
                    : "rgba(255,255,255,0.12)",
                  boxShadow: isCurrent ? "0 0 12px rgba(96,165,250,0.8)" : "none",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isCurrent
                    ? "#ffffff"
                    : isCompleted
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.1)",
                  transition: "color 0.3s",
                }}
                className="hidden sm:inline"
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
