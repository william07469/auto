import React, { useMemo, useEffect, useRef } from "react";
import { TIME_SLOTS } from "./bookingData";
import { Calendar, Clock, Check, AlertCircle } from "lucide-react";
import gsap from "gsap";

// ─── Date Step ────────────────────────────────────────────────────────────────
interface DateProps {
  selectedDate: string | null;
  onSelectDate: (iso: string) => void;
}

export const DateStep: React.FC<DateProps> = ({ selectedDate, onSelectDate }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => {
    const list: {
      iso: string; dayName: string; dayNum: number;
      monthName: string; isWeekend: boolean;
    }[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        iso: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("en-GB", { weekday: "short" }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString("en-GB", { month: "long" }),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      });
    }
    return list;
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof dates>();
    dates.forEach((d) => {
      if (!map.has(d.monthName)) map.set(d.monthName, []);
      map.get(d.monthName)!.push(d);
    });
    return Array.from(map.entries());
  }, [dates]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const sel = dates.find((d) => d.iso === selectedDate);

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 05
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          {selectedDate
            ? <><span style={{ color: "rgba(255,255,255,0.5)" }}>{sel?.dayName}, </span>{sel?.dayNum} {sel?.monthName}</>
            : "Choose a date"}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          All available dates shown below. Weekends are accepted.
        </p>
      </div>

      {/* Calendar */}
      <div className="space-y-8">
        {grouped.map(([month, days]) => (
          <div key={month}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>
                {month}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
              {days.map((item) => {
                const active = selectedDate === item.iso;
                return (
                  <button
                    key={item.iso}
                    type="button"
                    onClick={() => onSelectDate(item.iso)}
                    style={{
                      flexShrink: 0,
                      width: 64,
                      height: 80,
                      borderRadius: "0.75rem",
                      border: active
                        ? "1px solid rgba(255,255,255,0.0)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: active ? "#fff" : "rgba(255,255,255,0.02)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      cursor: "pointer",
                      transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                      boxShadow: active ? "0 0 24px rgba(255,255,255,0.18)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.18)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: active ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.28)" }}>
                      {item.dayName}
                    </span>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "monospace", color: active ? "#000" : "rgba(255,255,255,0.65)", lineHeight: 1 }}>
                      {item.dayNum}
                    </span>
                    {item.isWeekend && (
                      <span style={{ fontSize: "0.45rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: active ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.2)" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
          <Calendar style={{ width: 13, height: 13 }} />
          <span>Selected: <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{selectedDate}</span></span>
        </div>
      )}
    </div>
  );
};

// ─── Time Step ────────────────────────────────────────────────────────────────
interface TimeProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (slot: string) => void;
}

export const TimeStep: React.FC<TimeProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectTimeSlot,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const periods = ["Morning", "Afternoon", "Evening"];
  const grouped = periods
    .map((p) => ({ period: p, slots: TIME_SLOTS.filter((s) => s.period === p) }))
    .filter((g) => g.slots.length > 0);

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 06
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          {selectedTimeSlot
            ? <><span style={{ color: "rgba(255,255,255,0.5)" }}>Drop-off at </span>{selectedTimeSlot}</>
            : "Choose a time slot"}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          {selectedDate
            ? <>Available slots for <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.55)" }}>{selectedDate}</span></>
            : "Go back and select a date first."}
        </p>
      </div>

      {!selectedDate ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "1.2rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.85rem",
          }}
        >
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
          Please go back and select a date.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ period, slots }) => (
            <div key={period}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Clock style={{ width: 12, height: 12, color: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
                  {period}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                {slots.map((ts) => {
                  const active = selectedTimeSlot === ts.slot;
                  return (
                    <button
                      key={ts.slot}
                      type="button"
                      disabled={!ts.available}
                      onClick={() => ts.available && onSelectTimeSlot(ts.slot)}
                      style={{
                        padding: "1.1rem 1rem",
                        borderRadius: "0.75rem",
                        border: active
                          ? "1px solid rgba(255,255,255,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                        background: active
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(255,255,255,0.02)",
                        opacity: ts.available ? 1 : 0.25,
                        cursor: ts.available ? "pointer" : "not-allowed",
                        textAlign: "left",
                        position: "relative",
                        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!active && ts.available) {
                          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.16)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active && ts.available) {
                          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                        }
                      }}
                    >
                      {active && (
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check style={{ width: 9, height: 9, color: "#000", strokeWidth: 3 }} />
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          fontFamily: "monospace",
                          letterSpacing: "-0.02em",
                          color: active ? "#fff" : ts.available ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
                        }}
                      >
                        {ts.slot}
                      </div>
                      <div
                        style={{
                          fontSize: "0.58rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)",
                          marginTop: 4,
                        }}
                      >
                        {ts.available ? "Available" : "Booked"}
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

export const DateTimeStep = DateStep;
