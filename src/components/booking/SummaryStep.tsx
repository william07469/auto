import React, { useEffect, useRef } from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, PACKAGES_DATA, ADDONS_DATA } from "./bookingData";
import { CheckCircle2, ArrowRight, Pencil } from "lucide-react";
import gsap from "gsap";

interface Props {
  bookingData: BookingState;
  onEditStep: (step: number) => void;
  onConfirmBooking: () => void;
  submitting: boolean;
  done: boolean;
}

export const SummaryStep: React.FC<Props> = ({
  bookingData,
  onEditStep,
  onConfirmBooking,
  submitting,
  done,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const service = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const packages = bookingData.selectedServiceId ? PACKAGES_DATA[bookingData.selectedServiceId] : [];
  const pkg = packages.find((p) => p.id === bookingData.selectedPackageId);
  const addons = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));

  const basePrice = pkg?.price ?? 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = basePrice + addonsTotal;

  useEffect(() => {
    if (ref.current && !done) {
      gsap.fromTo(
        Array.from(ref.current.children),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [done]);

  useEffect(() => {
    if (done && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [done]);

  if (done) {
    return (
      <div ref={successRef} className="max-w-lg mx-auto text-center py-16 px-6">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <CheckCircle2 style={{ width: 32, height: 32, color: "#000", strokeWidth: 1.5 }} />
        </div>

        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
          Booking Confirmed
        </p>
        <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
          You're all set.
        </h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto 2rem" }}>
          Thank you, <strong style={{ color: "#fff" }}>{bookingData.customer.fullName}</strong>. Your appointment is confirmed for{" "}
          <strong style={{ color: "#fff" }}>{bookingData.selectedDate}</strong> at{" "}
          <strong style={{ color: "#fff" }}>{bookingData.selectedTimeSlot}</strong>.
        </p>

        <div
          style={{
            textAlign: "left",
            padding: "1.5rem",
            borderRadius: "1rem",
            border: "1.5px solid rgba(255,255,255,0.1)",
            background: "#0d0d0d",
          }}
        >
          {[
            {
              label: "Reference",
              value: `WV-${(Math.random() * 899999 + 100000).toFixed(0)}`,
              bold: true,
            },
            {
              label: "Service",
              value: `${service?.name ?? ""}${pkg ? ` — ${pkg.name}` : ""}`,
              bold: false,
            },
            {
              label: "Date & Time",
              value: `${bookingData.selectedDate} · ${bookingData.selectedTimeSlot}`,
              bold: false,
            },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{row.label}</span>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: row.bold ? 700 : 500,
                  color: row.bold ? "#fff" : "rgba(255,255,255,0.6)",
                  textAlign: "right",
                  maxWidth: "55%",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingTop: "1rem",
              marginTop: "0.25rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Estimated total</span>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "-0.04em",
                color: "#fff",
              }}
            >
              €{total}
            </span>
          </div>
        </div>

        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: "1.25rem" }}>
          Confirmation sent to{" "}
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>{bookingData.customer.email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-6 max-w-3xl mx-auto">
      <div>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
          Step 5 of 5
        </p>
        <h3 style={{ fontSize: "clamp(1.6rem,3.5vw,2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
          Review & confirm
        </h3>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 440 }}>
          Check everything looks right before booking. Hit edit to go back and change anything.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <SummaryCard title="Service" onEdit={() => onEditStep(1)}>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 2 }}>
              {service?.name ?? "—"}
            </p>
            {pkg && (
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                {pkg.name} Package · {pkg.duration}
              </p>
            )}
          </SummaryCard>

          <SummaryCard title="Extras" onEdit={() => onEditStep(3)}>
            {addons.length === 0 ? (
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                None selected
              </p>
            ) : (
              <div>
                {addons.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>{a.name}</span>
                    <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                      +€{a.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SummaryCard>

          <SummaryCard title="Date & Time" onEdit={() => onEditStep(4)}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>
                  Date
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace", color: "rgba(255,255,255,0.9)" }}>
                  {bookingData.selectedDate ?? "—"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>
                  Time
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace", color: "rgba(255,255,255,0.9)" }}>
                  {bookingData.selectedTimeSlot ?? "—"}
                </p>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard title="Contact" onEdit={() => onEditStep(5)}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 3 }}>
              {bookingData.customer.fullName || "—"}
            </p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{bookingData.customer.email}</p>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{bookingData.customer.phone}</p>
          </SummaryCard>
        </div>

        <div
          style={{
            borderRadius: "1rem",
            border: "1.5px solid rgba(255,255,255,0.1)",
            background: "#0d0d0d",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1.25rem",
            }}
          >
            Price Estimate
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
            <PriceLine
              label={pkg ? `${pkg.name} Package` : "Base service"}
              value={`€${basePrice}`}
            />
            {addons.map((a) => (
              <PriceLine key={a.id} label={a.name} value={`+€${a.price}`} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>Total estimate</span>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "-0.04em",
                color: "#fff",
              }}
            >
              €{total}
            </span>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onConfirmBooking}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              background: submitting ? "rgba(255,255,255,0.15)" : "#fff",
              color: "#000",
              fontWeight: 800,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            {submitting ? (
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Processing…</span>
            ) : (
              <>
                Book Appointment
                <ArrowRight style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              </>
            )}
          </button>

          <p
            style={{
              fontSize: "0.62rem",
              color: "rgba(255,255,255,0.25)",
              textAlign: "center",
              marginTop: "0.875rem",
              lineHeight: 1.55,
            }}
          >
            Free cancellation up to 24h before.
            <br />
            Final price confirmed at appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <div
    style={{
      padding: "1.25rem",
      borderRadius: "0.875rem",
      border: "1.5px solid rgba(255,255,255,0.08)",
      background: "#0d0d0d",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {title}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
        >
          <Pencil style={{ width: 10, height: 10 }} />
          Edit
        </button>
      )}
    </div>
    {children}
  </div>
);

const PriceLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>{label}</span>
    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.65)" }}>
      {value}
    </span>
  </div>
);
