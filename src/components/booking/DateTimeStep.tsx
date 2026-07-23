import React, { useMemo, useEffect, useRef } from "react";
import { TIME_SLOTS } from "./bookingData";
import { Calendar as CalendarIcon, Clock, Check, AlertCircle } from "lucide-react";
import gsap from "gsap";

interface DateTimeStepProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectDate: (dateISO: string) => void;
  onSelectTimeSlot: (slot: string) => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate next 21 days
  const availableDates = useMemo(() => {
    const list: { iso: string; dayName: string; dayNum: number; monthName: string; isWeekend: boolean }[] = [];
    const today = new Date();

    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("de-DE", { weekday: "short" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("de-DE", { month: "short" });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      list.push({ iso, dayName, dayNum, monthName, isWeekend });
    }

    return list;
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
          Schritt 4 — Termin & Uhrzeit
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
          Wunschtermin & Uhrzeit wählen
        </h3>
        <p className="text-zinc-400 text-sm mt-1">
          Wählen Sie Ihr gewünschtes Datum und ein verfügbares Zeitfenster für die Fahrzeugabgabe.
        </p>
      </div>

      {/* Date Carousel Picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            1. Datum auswählen
          </label>

          <span className="text-xs text-emerald-400/90 font-mono">
            {selectedDate ? `Gewählt: ${selectedDate}` : "Bitte Datum wählen"}
          </span>
        </div>

        {/* Scrollable Horizontal Calendar Strip */}
        <div className="relative">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-zinc-700">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.iso;

              return (
                <button
                  key={item.iso}
                  type="button"
                  onClick={() => onSelectDate(item.iso)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                    isSelected
                      ? "bg-gradient-to-b from-emerald-500/20 to-teal-900/40 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] scale-105"
                      : "bg-zinc-950/60 border-white/10 hover:border-white/25 hover:bg-zinc-900/60"
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isSelected ? "text-emerald-300" : "text-zinc-400"}`}>
                    {item.dayName}
                  </span>
                  <span className={`text-2xl font-black my-0.5 font-mono ${isSelected ? "text-white" : "text-zinc-200"}`}>
                    {item.dayNum}
                  </span>
                  <span className={`text-[10px] uppercase font-medium ${isSelected ? "text-emerald-400" : "text-zinc-500"}`}>
                    {item.monthName}
                  </span>
                  {item.isWeekend && (
                    <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded mt-1 font-mono">
                      Wochenende
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Slot Picker */}
      <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          2. Abgabe-Uhrzeit wählen
        </label>

        {!selectedDate ? (
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Wählen Sie zuerst oben ein Datum aus, um die verfügbaren Zeiten zu sehen.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TIME_SLOTS.map((ts) => {
              const isSelected = selectedTimeSlot === ts.slot;

              return (
                <button
                  key={ts.slot}
                  type="button"
                  disabled={!ts.available}
                  onClick={() => ts.available && onSelectTimeSlot(ts.slot)}
                  className={`p-4 rounded-xl border flex flex-col justify-between text-left transition-all duration-300 ${
                    !ts.available
                      ? "bg-zinc-950/30 border-white/5 opacity-40 cursor-not-allowed"
                      : isSelected
                      ? "bg-zinc-900 border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/40"
                      : "bg-zinc-900/60 border-white/10 hover:border-white/25 hover:bg-zinc-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                      {ts.period === "Morning" ? "Vormittag" : ts.period === "Afternoon" ? "Nachmittag" : "Abend"}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-black shadow-[0_0_6px_rgba(52,211,153,0.8)]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-baseline justify-between w-full">
                    <span className="text-lg font-bold font-mono text-white">{ts.slot} Uhr</span>
                    <span
                      className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded ${
                        ts.available ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {ts.available ? "Frei" : "Belegt"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
