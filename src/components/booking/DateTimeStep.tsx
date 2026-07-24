import React, { useMemo, useEffect, useRef } from "react";
import { TIME_SLOTS } from "./bookingData";
import { Check } from "lucide-react";
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

// ─── Step 4: Choose Date ───────────────────────────────────────────────────────

export const DateStep: React.FC<DateStepProps> = ({ selectedDate, onSelectDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const availableDates = useMemo(() => {
    const list: { iso: string; dayName: string; dayNum: number; monthName: string; isWeekend: boolean }[] = [];
    const today = new Date();

    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString("en-GB", { month: "long" });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      list.push({ iso, dayName, dayNum, monthName, isWeekend });
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
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  const selectedInfo = availableDates.find((d) => d.iso === selectedDate);

  return (
    <div ref={containerRef} style={{ maxWidth: 840, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          Step 4 — Date Selection
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          {selectedDate && selectedInfo ? (
            <>
              {selectedInfo.dayName}, {selectedInfo.dayNum} {selectedInfo.monthName}
            </>
          ) : (
            "Select an appointment date"
          )}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 420 }}>
          Choose your preferred service date. Time slots are selected on the next step.
        </p>
      </div>

      {/* Calendar Strip */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {grouped.map(([month, days]) => (
          <div key={month}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "monospace",
                }}
              >
                {month}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
                gap: "0.6rem",
              }}
            >
              {days.map((item) => {
                const isSelected = selectedDate === item.iso;

                return (
                  <button
                    key={item.iso}
                    type="button"
                    id={`date-${item.iso}`}
                    onClick={() => onSelectDate(item.iso)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem 0.5rem",
                      borderRadius: 14,
                      border: isSelected
                        ? "1px solid rgba(96,165,250,0.8)"
                        : "1px solid rgba(255,255,255,0.07)",
                      background: isSelected
                        ? "rgba(96,165,250,0.15)"
                        : "rgba(255,255,255,0.02)",
                      boxShadow: isSelected ? "0 0 25px rgba(96,165,250,0.2)" : "none",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: isSelected ? "rgba(96,165,250,0.9)" : "rgba(255,255,255,0.3)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.dayName}
                    </span>
                    <span
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        color: isSelected ? "#ffffff" : "rgba(255,255,255,0.75)",
                        lineHeight: 1,
                      }}
                    >
                      {item.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Step 5: Choose Time ───────────────────────────────────────────────────────

export const TimeStep: React.FC<TimeStepProps> = ({ selectedDate, selectedTimeSlot, onSelectTimeSlot }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }
    );
  }, []);

  const periodOrder = ["Morning", "Afternoon", "Evening"];
  const grouped = periodOrder
    .map((period) => ({
      period,
      slots: TIME_SLOTS.filter((ts) => ts.period === period),
    }))
    .filter((g) => g.slots.length > 0);

  return (
    <div ref={containerRef} style={{ maxWidth: 840, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          Step 5 — Time Slot
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          {selectedTimeSlot ? `Drop-off at ${selectedTimeSlot}` : "Choose drop-off time"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 420 }}>
          {selectedDate ? (
            <>Available arrival times for <span style={{ color: "#fff", fontFamily: "monospace" }}>{selectedDate}</span>.</>
          ) : (
            "Please select a date on step 4 first."
          )}
        </p>
      </div>

      {/* Time Slots Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {grouped.map(({ period, slots }) => (
          <div key={period}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "monospace",
                }}
              >
                {period}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              {slots.map((ts) => {
                const isSelected = selectedTimeSlot === ts.slot;

                return (
                  <button
                    key={ts.slot}
                    type="button"
                    id={`time-${ts.slot}`}
                    disabled={!ts.available}
                    onClick={() => ts.available && onSelectTimeSlot(ts.slot)}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.25rem 1.5rem",
                      borderRadius: 16,
                      border: !ts.available
                        ? "1px solid rgba(255,255,255,0.04)"
                        : isSelected
                        ? "1px solid rgba(96,165,250,0.8)"
                        : "1px solid rgba(255,255,255,0.07)",
                      background: !ts.available
                        ? "rgba(255,255,255,0.01)"
                        : isSelected
                        ? "rgba(96,165,250,0.12)"
                        : "rgba(255,255,255,0.02)",
                      boxShadow: isSelected ? "0 0 25px rgba(96,165,250,0.15)" : "none",
                      opacity: ts.available ? 1 : 0.25,
                      cursor: ts.available ? "pointer" : "not-allowed",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                      if (ts.available && !isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (ts.available && !isSelected) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 600,
                          fontFamily: "monospace",
                          color: isSelected ? "#ffffff" : ts.available ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                          letterSpacing: "-0.02em",
                          display: "block",
                        }}
                      >
                        {ts.slot}
                      </span>
                      <span
                        style={{
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: isSelected ? "rgba(96,165,250,0.8)" : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {ts.available ? "Available" : "Booked"}
                      </span>
                    </div>

                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSelected ? "1px solid rgba(96,165,250,0.8)" : "1px solid rgba(255,255,255,0.12)",
                        background: isSelected ? "rgba(96,165,250,0.2)" : "transparent",
                      }}
                    >
                      {isSelected && <Check size={10} color="rgba(96,165,250,1)" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DateTimeStep = DateStep;
