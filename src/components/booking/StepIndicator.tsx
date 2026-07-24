import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, title: "Service" },
  { id: 2, title: "Vehicle" },
  { id: 3, title: "Add-ons" },
  { id: 4, title: "Date" },
  { id: 5, title: "Time" },
  { id: 6, title: "Contact" },
  { id: 7, title: "Summary" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${percentage}%`,
        duration: 0.65,
        ease: "power3.out",
      });
    }
  }, [percentage]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "var(--color-muted-foreground)",
            }}
            className="mb-1"
          >
            WV Detailing · Book Now
          </p>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white leading-none">
            {STEPS[currentStep - 1]?.title}
          </h2>
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            fontFamily: "monospace",
          }}
          className="text-white/50 pb-0.5"
        >
          {currentStep} / {totalSteps}
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-px w-full bg-white/10 mb-7">
        <div
          ref={progressBarRef}
          className="absolute left-0 top-0 h-full bg-white rounded-full"
          style={{ width: "0%" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-start justify-between">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isCompleted && onStepClick(step.id)}
              disabled={!isCompleted}
              className="group flex flex-col items-center gap-2 transition-all duration-300"
              style={{ cursor: isCompleted ? "pointer" : "default" }}
            >
              <div
                className="relative flex items-center justify-center transition-all duration-500"
                style={{
                  width: isCurrent ? 28 : isCompleted ? 18 : 14,
                  height: isCurrent ? 28 : isCompleted ? 18 : 14,
                  borderRadius: "50%",
                  background: isCurrent
                    ? "rgba(255,255,255,1)"
                    : isCompleted
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.04)",
                  border: isCurrent
                    ? "none"
                    : isCompleted
                    ? "1px solid rgba(255,255,255,0.35)"
                    : "1px solid rgba(255,255,255,0.10)",
                  boxShadow: isCurrent ? "0 0 18px rgba(255,255,255,0.25)" : "none",
                }}
              >
                {isCurrent ? (
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#000" }}>{step.id}</span>
                ) : isCompleted ? (
                  <Check style={{ width: 9, height: 9, color: "rgba(255,255,255,0.8)", strokeWidth: 3 }} />
                ) : null}
              </div>
              <span
                className="hidden sm:block transition-colors duration-300"
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: isCurrent
                    ? "rgba(255,255,255,0.9)"
                    : isCompleted
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.16)",
                }}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
