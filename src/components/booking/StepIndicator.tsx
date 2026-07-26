import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Package" },
  { id: 3, label: "Extras" },
  { id: 4, label: "Date & Time" },
  { id: 5, label: "Summary" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center">
        {STEPS.map((step, idx) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          const clickable = done;

          return (
            <React.Fragment key={step.id}>
              {/* Step node */}
              <button
                type="button"
                onClick={() => clickable && onStepClick(step.id)}
                disabled={!clickable}
                className="flex flex-col items-center gap-2"
                style={{ cursor: clickable ? "pointer" : "default", minWidth: 0 }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: active
                      ? "2px solid #fff"
                      : done
                      ? "2px solid #fff"
                      : "2px solid rgba(255,255,255,0.15)",
                    background: active ? "#fff" : done ? "#fff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  {done ? (
                    <Check
                      style={{ width: 14, height: 14, color: "#000", strokeWidth: 2.5 }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: active ? "#000" : "rgba(255,255,255,0.3)",
                        lineHeight: 1,
                      }}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="hidden sm:block text-center"
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: active
                      ? "#fff"
                      : done
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s",
                  }}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginBottom: 22,
                    background: done ? "#fff" : "rgba(255,255,255,0.1)",
                    transition: "background 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
