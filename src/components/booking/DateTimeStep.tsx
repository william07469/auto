import React, { useMemo, useEffect, useRef } from "react";
import { TIME_SLOTS } from "./bookingData";
import { Check } from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectDate: (iso: string) => void;
  onSelectTimeSlot: (slot: string) => void;
}

export const DateTimeStep: React.FC<Props> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const dates = useMemo(() => {
    const list: {
      iso: string;
      dayName: string;
      dayNum: number;
      monthName: string;
      isWeekend: boolean;
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

  const periods = ["Morning", "Afternoon", "Evening"];
  const groupedSlots = periods
    .map((p) => ({ period: p, slots: TIME_SLOTS.filter((s) => s.period === p) }))
    .filter((g) => g.slots.length > 0);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      Array.from(ref.current.children),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const selDate = dates.find((d) => d.iso === selectedDate);

  return (
    <div ref={ref} className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "#9ca3af", marginBottom: 8 }}>
          Step 4 of 5
        </p>
        <h3 style={{ fontSize: "clamp(1.6rem,3.5vw,2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#111827", lineHeight: 1.15, marginBottom: 8 }}>
          Pick a date & time
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.65, maxWidth: 440 }}>
          Select an available date, then choose your preferred drop-off time.
        </p>
      </div>

      {/* ── DATE PICKER ── */}
      <div
        style={{
          borderRadius: "1rem",
          border: "1.5px solid #e5e7eb",
          background: "#fff",
          padding: "1.5rem",
        }}
      >
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#374151", marginBottom: "1.25rem" }}>
          Date
        </p>

        <div className="space-y-6">
          {grouped.map(([month, days]) => (
            <div key={month}>
              {/* Month label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {month}
                </span>
                <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
              </div>

              {/* Day buttons */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {days.map((item) => {
                  const active = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => onSelectDate(item.iso)}
                      style={{
                        flexShrink: 0,
                        width: 58,
                        height: 72,
                        borderRadius: "0.75rem",
                        border: active ? "2px solid #111827" : "1.5px solid #e5e7eb",
                        background: active ? "#111827" : "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: active ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: active ? "rgba(255,255,255,0.55)" : "#9ca3af",
                        }}
                      >
                        {item.dayName}
                      </span>
                      <span
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          fontFamily: "monospace",
                          letterSpacing: "-0.02em",
                          color: active ? "#fff" : "#111827",
                          lineHeight: 1,
                        }}
                      >
                        {item.dayNum}
                      </span>
                      {item.isWeekend && (
                        <span
                          style={{
                            fontSize: "0.42rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: active ? "rgba(255,255,255,0.4)" : "#d1d5db",
                          }}
                        >
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

        {selDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #f3f4f6",
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            <Check style={{ width: 13, height: 13, color: "#111827", strokeWidth: 2.5 }} />
            <span>
              Selected:{" "}
              <strong>
                {selDate.dayName}, {selDate.dayNum} {selDate.monthName}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* ── TIME PICKER ── */}
      <div
        style={{
          borderRadius: "1rem",
          border: selectedDate ? "1.5px solid #e5e7eb" : "1.5px solid #f3f4f6",
          background: selectedDate ? "#fff" : "#fafafa",
          padding: "1.5rem",
          transition: "all 0.2s ease",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: selectedDate ? "#374151" : "#d1d5db",
            marginBottom: "1.25rem",
          }}
        >
          Time {!selectedDate && "— select a date first"}
        </p>

        {!selectedDate ? (
          <p style={{ fontSize: "0.82rem", color: "#d1d5db", fontStyle: "italic" }}>
            Choose a date above to see available time slots.
          </p>
        ) : (
          <div className="space-y-5">
            {groupedSlots.map(({ period, slots }) => (
              <div key={period}>
                {/* Period label */}
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    marginBottom: 8,
                  }}
                >
                  {period}
                </p>

                {/* Slots grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: 8,
                  }}
                >
                  {slots.map((ts) => {
                    const active = selectedTimeSlot === ts.slot;
                    return (
                      <button
                        key={ts.slot}
                        type="button"
                        disabled={!ts.available}
                        onClick={() => ts.available && onSelectTimeSlot(ts.slot)}
                        style={{
                          padding: "0.75rem 0.875rem",
                          borderRadius: "0.65rem",
                          border: active ? "2px solid #111827" : "1.5px solid #e5e7eb",
                          background: active ? "#111827" : "#fff",
                          opacity: ts.available ? 1 : 0.35,
                          cursor: ts.available ? "pointer" : "not-allowed",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          transition: "all 0.18s ease",
                          position: "relative",
                        }}
                      >
                        {active && (
                          <div
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check style={{ width: 8, height: 8, color: "#111827", strokeWidth: 3 }} />
                          </div>
                        )}
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            fontFamily: "monospace",
                            letterSpacing: "-0.02em",
                            color: active ? "#fff" : "#111827",
                          }}
                        >
                          {ts.slot}
                        </span>
                        <span
                          style={{
                            fontSize: "0.52rem",
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: active ? "rgba(255,255,255,0.5)" : ts.available ? "#9ca3af" : "#d1d5db",
                          }}
                        >
                          {ts.available ? "Free" : "Taken"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Keep legacy named exports so any leftover imports don't break
export const DateStep = DateTimeStep;
export const TimeStep = DateTimeStep;
