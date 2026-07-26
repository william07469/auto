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
        dayName: d.toLocaleDateString("de-DE", { weekday: "short" }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString("de-DE", { month: "long" }),
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

  // German period labels
  const periods = ["Morgen", "Nachmittag", "Abend"];
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
      <div>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        >
          Schritt 5
        </p>
        <h3
          style={{
            fontSize: "clamp(1.6rem,3.5vw,2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Datum & Uhrzeit wählen
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            maxWidth: 440,
          }}
        >
          Wählen Sie einen verfügbaren Termin und Ihre bevorzugte Anlieferungszeit.
        </p>
      </div>

      {/* Date picker */}
      <div
        style={{
          borderRadius: "1rem",
          border: "1.5px solid rgba(255,255,255,0.1)",
          background: "#0d0d0d",
          padding: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1.25rem",
          }}
        >
          Datum
        </p>

        <div className="space-y-6">
          {grouped.map(([month, days]) => (
            <div key={month}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {month}
                </span>
                <div
                  style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}
                />
              </div>

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
                        border: active
                          ? "2px solid #fff"
                          : "1.5px solid rgba(255,255,255,0.12)",
                        background: active ? "#fff" : "transparent",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: active
                          ? "0 2px 12px rgba(255,255,255,0.08)"
                          : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: active
                            ? "rgba(0,0,0,0.45)"
                            : "rgba(255,255,255,0.4)",
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
                          color: active ? "#000" : "rgba(255,255,255,0.85)",
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
                            color: active
                              ? "rgba(0,0,0,0.35)"
                              : "rgba(255,255,255,0.25)",
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
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <Check
              style={{
                width: 13,
                height: 13,
                color: "rgba(255,255,255,0.7)",
                strokeWidth: 2.5,
              }}
            />
            <span>
              Ausgewählt:{" "}
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>
                {selDate.dayName}, {selDate.dayNum} {selDate.monthName}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Time picker */}
      <div
        style={{
          borderRadius: "1rem",
          border: selectedDate
            ? "1.5px solid rgba(255,255,255,0.1)"
            : "1.5px solid rgba(255,255,255,0.05)",
          background: selectedDate ? "#0d0d0d" : "transparent",
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
            color: selectedDate
              ? "rgba(255,255,255,0.5)"
              : "rgba(255,255,255,0.2)",
            marginBottom: "1.25rem",
          }}
        >
          Uhrzeit {!selectedDate && "— erst Datum wählen"}
        </p>

        {!selectedDate ? (
          <p
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.2)",
              fontStyle: "italic",
            }}
          >
            Wählen Sie oben ein Datum, um verfügbare Zeitslots zu sehen.
          </p>
        ) : (
          <div className="space-y-5">
            {groupedSlots.map(({ period, slots }) => (
              <div key={period}>
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: 8,
                  }}
                >
                  {period}
                </p>

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
                          border: active
                            ? "2px solid #fff"
                            : "1.5px solid rgba(255,255,255,0.12)",
                          background: active ? "#fff" : "transparent",
                          opacity: ts.available ? 1 : 0.25,
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
                              background: "#000",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check
                              style={{
                                width: 8,
                                height: 8,
                                color: "#fff",
                                strokeWidth: 3,
                              }}
                            />
                          </div>
                        )}
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            fontFamily: "monospace",
                            letterSpacing: "-0.02em",
                            color: active ? "#000" : "rgba(255,255,255,0.85)",
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
                            color: active
                              ? "rgba(0,0,0,0.45)"
                              : ts.available
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(255,255,255,0.15)",
                          }}
                        >
                          {ts.available ? "Frei" : "Belegt"}
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

export const DateStep = DateTimeStep;
export const TimeStep = DateTimeStep;
