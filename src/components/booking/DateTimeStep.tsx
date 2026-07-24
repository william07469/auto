import React, { useMemo, useEffect, useRef } from "react";
import { TIME_SLOTS } from "./bookingData";
import { Calendar as CalendarIcon, Clock, Check, AlertCircle } from "lucide-react";
import gsap from "gsap";

interface DateStepProps {
  selectedDate: string | null;
  onSelectDate: (dateISO: string) => void;
}

interface TimeStepProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (slot: string) => void;
}

// ─── Date Step ───────────────────────────────────────────────────────────────
export const DateStep: React.FC<DateStepProps> = ({ selectedDate, onSelectDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const availableDates = useMemo(() => {
    const list: { iso: string; dayName: string; dayNum: number; monthName: string; monthShort: string; isWeekend: boolean }[] = [];
    const today = new Date();
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-GB", { month: "long" });
      const monthShort = d.toLocaleDateString("en-GB", { month: "short" });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      list.push({ iso, dayName, dayNum, monthName, monthShort, isWeekend });
    }
    return list;
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof availableDates>();
    availableDates.forEach((d) => {
      if (!map.has(d.monthName)) map.set(d.monthName, []);
      map.get(d.monthName)!.push(d);
    });
    return Array.from(map.entries());
  }, [availableDates]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        Array.from(containerRef.current.children),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  const selectedInfo = availableDates.find((d) => d.iso === selectedDate);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Appointment Date</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          {selectedDate
            ? <>
                <span className="text-white/70">{selectedInfo?.dayName}</span>
                {", "}
                {selectedInfo?.dayNum} {selectedInfo?.monthName}
              </>
            : "Choose a date"}
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          All available dates are shown below. Weekends are accepted.
        </p>
      </div>

      {/* Calendar by month */}
      <div className="space-y-8">
        {grouped.map(([month, days]) => (
          <div key={month}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">{month}</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
              {days.map((item) => {
                const isSelected = selectedDate === item.iso;
                return (
                  <button
                    key={item.iso}
                    type="button"
                    id={`date-${item.iso}`}
                    onClick={() => onSelectDate(item.iso)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "bg-white/[0.02] border-white/8 hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`text-[9px] font-medium uppercase tracking-[0.15em] ${isSelected ? "text-black/60" : "text-white/30"}`}>
                      {item.dayName}
                    </span>
                    <span className={`text-2xl font-bold font-mono my-0.5 ${isSelected ? "text-black" : "text-white/70"}`}>
                      {item.dayNum}
                    </span>
                    {item.isWeekend && (
                      <span className={`text-[7px] font-medium uppercase tracking-wide ${isSelected ? "text-black/40" : "text-white/25"}`}>
                        WE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="flex items-center gap-3 text-xs text-white/30">
          <CalendarIcon className="w-3.5 h-3.5 text-white/40" />
          <span>Selected: <span className="text-white/50 font-mono">{selectedDate}</span></span>
        </div>
      )}
    </div>
  );
};

// ─── Time Step ────────────────────────────────────────────────────────────────
export const TimeStep: React.FC<TimeStepProps> = ({ selectedDate, selectedTimeSlot, onSelectTimeSlot }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        Array.from(containerRef.current.children),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  const periodOrder = ["Morning", "Afternoon", "Evening"];
  const grouped = periodOrder.map((period) => ({
    period,
    slots: TIME_SLOTS.filter((ts) => ts.period === period),
  })).filter((g) => g.slots.length > 0);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Drop-off Time</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          {selectedTimeSlot
            ? <><span className="text-white/70">{selectedTimeSlot}</span></>
            : "Choose a time slot"}
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          {selectedDate
            ? <>Available slots for <span className="text-white/70 font-mono">{selectedDate}</span></>
            : "Please go back and select a date first."}
        </p>
      </div>

      {!selectedDate ? (
        <div className="flex items-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/8 text-white/40 text-sm">
          <AlertCircle className="w-4 h-4 text-white/30 shrink-0" />
          <span>Select a date on the previous step to see available times.</span>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ period, slots }) => (
            <div key={period}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-3.5 h-3.5 text-white/20" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">{period}</span>
                <div className="flex-1 h-px bg-white/6" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {slots.map((ts) => {
                  const isSelected = selectedTimeSlot === ts.slot;
                  return (
                    <button
                      key={ts.slot}
                      type="button"
                      id={`time-${ts.slot}`}
                      disabled={!ts.available}
                      onClick={() => ts.available && onSelectTimeSlot(ts.slot)}
                      className={`relative p-5 rounded-xl border text-left transition-all duration-300 ${
                        !ts.available
                          ? "opacity-25 cursor-not-allowed bg-white/[0.01] border-white/5"
                          : isSelected
                          ? "bg-white/[0.08] border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.08)] ring-1 ring-white/20"
                          : "bg-white/[0.02] border-white/8 hover:border-white/18 hover:bg-white/[0.04] cursor-pointer"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                        </div>
                      )}
                      <div className={`text-2xl font-bold font-mono tracking-tight transition-colors ${isSelected ? "text-white" : ts.available ? "text-white/65" : "text-white/20"}`}>
                        {ts.slot}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[9px] uppercase tracking-[0.2em] transition-colors ${isSelected ? "text-white/60" : "text-white/25"}`}>
                          {ts.available ? "Available" : "Booked"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Legacy export
export const DateTimeStep = DateStep;
