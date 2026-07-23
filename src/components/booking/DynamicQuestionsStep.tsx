import React, { useEffect, useRef } from "react";
import { ServiceId } from "./types";
import { DYNAMIC_QUESTIONS, ADDONS_DATA, SERVICES_DATA } from "./bookingData";
import { Sparkles, ShieldCheck, Sun, Armchair, Gauge, Check, Plus, Info } from "lucide-react";
import gsap from "gsap";

interface DynamicQuestionsStepProps {
  selectedServiceId: ServiceId;
  selectedSubOptionId: string | null;
  selectedAddOnIds: string[];
  customServiceNote: string;
  onSelectSubOption: (id: string) => void;
  onToggleAddOn: (id: string) => void;
  onChangeCustomNote: (note: string) => void;
}

const ADDON_ICON_MAP: Record<string, React.ReactNode> = {
  Gauge: <Gauge className="w-5 h-5 text-amber-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-300" />,
  Sparkles: <Sparkles className="w-5 h-5 text-emerald-400" />,
  Armchair: <Armchair className="w-5 h-5 text-teal-300" />,
};

export const DynamicQuestionsStep: React.FC<DynamicQuestionsStepProps> = ({
  selectedServiceId,
  selectedSubOptionId,
  selectedAddOnIds,
  customServiceNote,
  onSelectSubOption,
  onToggleAddOn,
  onChangeCustomNote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeService = SERVICES_DATA.find((s) => s.id === selectedServiceId);
  const dynamicGroup = DYNAMIC_QUESTIONS[selectedServiceId] || DYNAMIC_QUESTIONS.paint_correction;

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [selectedServiceId]);

  return (
    <div ref={containerRef} className="space-y-10">
      {/* Header */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
            Schritt 2 — Spezifikationen & Pakete
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
            {dynamicGroup.title}
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Service: <span className="text-emerald-400 font-semibold">{activeService?.name}</span> — {dynamicGroup.subtitle}
          </p>
        </div>

        {/* Dynamic Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {dynamicGroup.options.map((option) => {
            const isSelected = selectedSubOptionId === option.id;

            return (
              <div
                key={option.id}
                onClick={() => onSelectSubOption(option.id)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-900/95 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.2)] ring-2 ring-emerald-400/40 -translate-y-1"
                    : "bg-zinc-950/70 border-white/10 hover:border-white/25 hover:bg-zinc-900/60 hover:-translate-y-1"
                }`}
              >
                {/* Recommended Badge Container (Placed nicely at top) */}
                {option.recommended && (
                  <div className="mb-3">
                    <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                      Empfohlenes Paket
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-lg font-bold text-white leading-snug">{option.title}</h4>
                    <div
                      className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border transition-all mt-0.5 ${
                        isSelected
                          ? "bg-emerald-400 border-emerald-400 text-black shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{option.description}</p>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <span className="text-xl font-extrabold font-mono text-white">€{option.price}</span>
                  <span className="text-xs text-zinc-400 font-mono">
                    ca. {Math.round(option.durationMinutes / 60)} Std.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Note Input */}
      {selectedServiceId === "other" && (
        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-emerald-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Info className="w-4 h-4" />
            <h4 className="text-sm font-semibold">Spezielle Wünsche / Fahrzeugbesonderheiten</h4>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Beschreiben Sie spezifische Anforderungen (z.B. Farbnebel, Pulverbeschichtung, Keramikfolie):
          </p>
          <textarea
            value={customServiceNote}
            onChange={(e) => onChangeCustomNote(e.target.value)}
            rows={3}
            placeholder="Z.B. Matthersteller-Lackierung, Bremsscheiben-Schutz..."
            className="w-full bg-zinc-900/90 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
          />
        </div>
      )}

      {/* Optional Add-Ons Section */}
      <div className="pt-6 border-t border-white/10">
        <div className="mb-6">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Optionale Zusatztreatments / Add-Ons
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Wählen Sie zusätzliche Spezialbehandlungen passend zu Ihrer Buchung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADDONS_DATA.map((addon) => {
            const isSelected = selectedAddOnIds.includes(addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddOn(addon.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md border flex items-start gap-4 ${
                  isSelected
                    ? "bg-emerald-950/40 border-emerald-400/70 shadow-[0_0_20px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/30"
                    : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/60"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                    isSelected
                      ? "bg-emerald-500/20 border-emerald-400/40"
                      : "bg-zinc-900 border-white/10"
                  }`}
                >
                  {ADDON_ICON_MAP[addon.iconName]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-white truncate">{addon.name}</h5>
                    <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0">
                      +€{addon.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{addon.description}</p>
                </div>

                <div
                  className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-emerald-400 border-emerald-400 text-black shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      : "border-zinc-700 bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
