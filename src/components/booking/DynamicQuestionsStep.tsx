import React, { useEffect, useRef } from "react";
import { ServiceId } from "./types";
import { DYNAMIC_QUESTIONS, SERVICES_DATA } from "./bookingData";
import { Check, Info } from "lucide-react";
import gsap from "gsap";

interface DynamicQuestionsStepProps {
  selectedServiceId: ServiceId;
  selectedSubOptionId: string | null;
  customServiceNote: string;
  onSelectSubOption: (id: string) => void;
  onChangeCustomNote: (note: string) => void;
}

export const DynamicQuestionsStep: React.FC<DynamicQuestionsStepProps> = ({
  selectedServiceId,
  selectedSubOptionId,
  customServiceNote,
  onSelectSubOption,
  onChangeCustomNote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeService = SERVICES_DATA.find((s) => s.id === selectedServiceId);
  const dynamicGroup = DYNAMIC_QUESTIONS[selectedServiceId] ?? DYNAMIC_QUESTIONS.paint_correction;

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".option-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 22, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [selectedServiceId]);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Service Options</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          {dynamicGroup.title}
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          {activeService?.name} · {dynamicGroup.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dynamicGroup.options.map((option) => {
          const isSelected = selectedSubOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              id={`option-${option.id}`}
              onClick={() => onSelectSubOption(option.id)}
              className={`option-card group relative text-left p-6 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between min-h-[260px] ${
                isSelected
                  ? "bg-blue-950/20 border-blue-400/60 shadow-[0_0_40px_rgba(96,165,250,0.15)] ring-1 ring-blue-400/30"
                  : "bg-white/[0.02] border-white/8 hover:border-white/16 hover:bg-white/[0.04]"
              }`}
            >
              {/* Recommended badge */}
              {option.recommended && (
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
              )}
              {option.recommended && (
                <div className="absolute top-3 right-3">
                  <span className="text-[8px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-300">
                    Recommended
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pr-20">
                  <h4 className={`text-sm font-semibold tracking-tight leading-snug transition-colors ${isSelected ? "text-white" : "text-white/75 group-hover:text-white"}`}>
                    {option.title}
                  </h4>
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border transition-all mt-0.5 ${
                      isSelected
                        ? "bg-blue-400 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]"
                        : "border-white/16 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] text-white/35 leading-relaxed group-hover:text-white/45 transition-colors">
                  {option.description}
                </p>

                {/* Feature bullets */}
                <ul className="space-y-2">
                  {option.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[10px] text-white/40 group-hover:text-white/50 transition-colors">
                      <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 transition-colors ${isSelected ? "bg-blue-400" : "bg-white/20"}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price footer */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/6">
                <span className={`text-xl font-bold font-mono tracking-tight transition-colors ${isSelected ? "text-white" : "text-white/55 group-hover:text-white/75"}`}>
                  €{option.price}
                </span>
                <span className="text-[9px] text-white/25 font-mono uppercase tracking-wide">
                  ~{Math.round(option.durationMinutes / 60)}h
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom note for "other" service */}
      {selectedServiceId === "other" && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-blue-400/20">
          <div className="flex items-center gap-2 text-blue-400/80 mb-3">
            <Info className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">Special Requirements</h4>
          </div>
          <textarea
            value={customServiceNote}
            onChange={(e) => onChangeCustomNote(e.target.value)}
            rows={3}
            placeholder="Describe specific requirements (e.g. matte paint, colour sanding, fleet prep)…"
            className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all resize-none"
          />
        </div>
      )}
    </div>
  );
};
