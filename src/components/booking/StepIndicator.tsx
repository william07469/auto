import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, title: "Leistung", subtitle: "Service wählen" },
  { id: 2, title: "Optionen", subtitle: "Paket & Add-Ons" },
  { id: 3, title: "Fahrzeug", subtitle: "Marke & Modell" },
  { id: 4, title: "Termin", subtitle: "Datum & Zeit" },
  { id: 5, title: "Kontakt", subtitle: "Ihre Daten" },
  { id: 6, title: "Übersicht", subtitle: "Prüfen & Buchen" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentage = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${percentage}%`,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [percentage]);

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 px-2 sm:px-4">
      {/* Header bar info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            LUXURY BOOKING CONCIERGE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Schritt {currentStep} von {STEPS.length} — <span className="text-zinc-400 font-normal">{STEPS[currentStep - 1]?.title}</span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs sm:text-sm font-mono font-medium text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            {percentage}% Abgeschlossen
          </span>
        </div>
      </div>

      {/* Glassmorphic step container */}
      <div className="relative p-3 sm:p-4 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Background glow bar track */}
        <div className="relative w-full h-1.5 bg-zinc-800/60 rounded-full overflow-hidden mb-5">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all"
            style={{ width: "0%" }}
          />
        </div>

        {/* Step Nodes Grid */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2 relative z-10">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isCompleted && onStepClick(step.id)}
                disabled={!isCompleted && !isCurrent}
                className={`group flex flex-col items-center text-center py-2 px-1 rounded-xl transition-all duration-300 ${
                  isCompleted ? "cursor-pointer hover:bg-white/5" : "cursor-default"
                }`}
              >
                {/* Circle step badge */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-xs sm:text-sm transition-all duration-500 ${
                    isCurrent
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-[0_0_20px_rgba(52,211,153,0.6)] scale-110 ring-2 ring-emerald-400/50"
                      : isCompleted
                      ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40 group-hover:scale-105"
                      : "bg-zinc-900/80 text-zinc-600 border border-white/5"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Step title */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-medium tracking-wide transition-colors ${
                    isCurrent
                      ? "text-emerald-400 font-semibold"
                      : isCompleted
                      ? "text-zinc-300"
                      : "text-zinc-600"
                  }`}
                >
                  {step.title}
                </span>
                <span className="hidden md:block text-[9px] text-zinc-500 mt-0.5 font-light">
                  {step.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
