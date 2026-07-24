import React, { useEffect, useRef } from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, PACKAGES_DATA, ADDONS_DATA, SERVICE_QUESTIONS } from "./bookingData";
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

  // Resolve question answers to readable text
  const questionSummary = bookingData.selectedServiceId
    ? (SERVICE_QUESTIONS[bookingData.selectedServiceId] ?? []).map((q) => {
        const ans = bookingData.questionAnswers.find((a) => a.questionId === q.id);
        const opt = q.options.find((o) => o.id === ans?.answerId);
        return { question: q.question, answer: opt?.label ?? null };
      }).filter((r) => r.answer !== null)
    : [];

  const basePrice = pkg?.price ?? 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = basePrice + addonsTotal;

  useEffect(() => {
    if (ref.current && !done) {
      gsap.fromTo(
        Array.from(ref.current.children),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" }
      );
    }
  }, [done]);

  useEffect(() => {
    if (done && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.9, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" }
      );
    }
  }, [done]);

  // ─── Success ───────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div ref={successRef} className="max-w-lg mx-auto text-center py-16 px-6 space-y-8">
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            boxShadow: "0 0 60px rgba(255,255,255,0.07)",
          }}
        >
          <CheckCircle2 style={{ width: 36, height: 36, color: "rgba(255,255,255,0.75)", strokeWidth: 1.5 }} />
        </div>

        <div className="space-y-3">
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>
            Appointment Confirmed
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 500, letterSpacing: "-0.04em", color: "#fff", lineHeight: 0.95 }}>
            You're all set.
          </h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
            Thank you, <span style={{ color: "rgba(255,255,255,0.7)" }}>{bookingData.customer.fullName}</span>.
            Your appointment is confirmed for{" "}
            <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{bookingData.selectedDate}</span>{" "}
            at{" "}
            <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{bookingData.selectedTimeSlot}</span>.
          </p>
        </div>

        <div
          style={{
            textAlign: "left",
            padding: "1.5rem",
            borderRadius: "0.875rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          {[
            { label: "Reference", value: `WV-${(Math.random() * 899999 + 100000).toFixed(0)}`, mono: true, highlight: true },
            { label: "Service", value: `${service?.name}${pkg ? ` — ${pkg.name}` : ""}`, mono: false },
            { label: "Date & Time", value: `${bookingData.selectedDate} · ${bookingData.selectedTimeSlot}`, mono: true },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>{row.label}</span>
              <span style={{ fontSize: "0.72rem", fontFamily: row.mono ? "monospace" : "inherit", color: row.highlight ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: row.highlight ? 600 : 400, textAlign: "right" }}>
                {row.value}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "1rem", marginTop: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Estimated total</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>€{total}</span>
          </div>
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.22)" }}>
          Confirmation sent to <span style={{ color: "rgba(255,255,255,0.4)" }}>{bookingData.customer.email}</span>
        </p>
      </div>
    );
  }

  // ─── Summary review ────────────────────────────────────────────────────────
  return (
    <div ref={ref} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.28)" }}>
          Step 08
        </p>
        <h3 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}>
          Review & confirm
        </h3>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          Verify your selections before booking. Click any edit button to revise.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }} className="lg:grid-cols-5-3">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.875rem" }}>
          {/* Service + Package */}
          <SummaryCard title="Service" onEdit={() => onEditStep(1)}>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: 2 }}>{service?.name}</p>
            {pkg && <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{pkg.name} Package</p>}
            {pkg && <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", lineHeight: 1.55 }}>{pkg.description}</p>}
          </SummaryCard>

          {/* Questions */}
          {questionSummary.length > 0 && (
            <SummaryCard title="Questions" onEdit={() => onEditStep(3)}>
              <div className="space-y-2">
                {questionSummary.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{r.question}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{r.answer}</span>
                  </div>
                ))}
              </div>
            </SummaryCard>
          )}

          {/* Add-ons */}
          <SummaryCard title={`Add-ons${addons.length > 0 ? ` (${addons.length})` : ""}`} onEdit={() => onEditStep(4)}>
            {addons.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>None selected</p>
            ) : (
              <div className="space-y-1">
                {addons.map((a) => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{a.name}</span>
                    <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "rgba(255,255,255,0.45)" }}>+€{a.price}</span>
                  </div>
                ))}
              </div>
            )}
          </SummaryCard>

          {/* Date & Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <SummaryCard title="Date" onEdit={() => onEditStep(5)}>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>{bookingData.selectedDate ?? "—"}</p>
            </SummaryCard>
            <SummaryCard title="Time" onEdit={() => onEditStep(6)}>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>{bookingData.selectedTimeSlot ?? "—"}</p>
            </SummaryCard>
          </div>

          {/* Contact */}
          <SummaryCard title="Contact" onEdit={() => onEditStep(7)}>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff", marginBottom: 2 }}>{bookingData.customer.fullName || "—"}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)" }}>{bookingData.customer.email}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)" }}>{bookingData.customer.phone}</p>
          </SummaryCard>
        </div>

        {/* Price + CTA */}
        <div
          style={{
            marginTop: "0",
            padding: "1.75rem",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1.25rem", fontWeight: 500 }}>
            Price Estimate
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.25rem" }}>
            <PriceLine label={pkg ? `${pkg.name} Package` : "Base service"} value={`€${basePrice}`} />
            {addons.map((a) => (
              <PriceLine key={a.id} label={a.name} value={`+€${a.price}`} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "1.75rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>Total estimate</span>
            <span style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: "-0.03em", color: "#fff" }}>€{total}</span>
          </div>

          {/* CTA */}
          <button
            type="button"
            id="confirm-booking-btn"
            disabled={submitting}
            onClick={onConfirmBooking}
            style={{
              width: "100%",
              padding: "1.1rem 1.5rem",
              borderRadius: "0.75rem",
              background: "#fff",
              color: "#000",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 8px 40px rgba(255,255,255,0.09)",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
            onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          >
            {submitting ? (
              <span style={{ color: "rgba(0,0,0,0.5)" }}>Processing…</span>
            ) : (
              <>
                <span>Book Appointment</span>
                <ArrowRight style={{ width: 15, height: 15, strokeWidth: 2.5 }} />
              </>
            )}
          </button>

          <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
            Free cancellation up to 24h before. Final price confirmed at appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const SummaryCard: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <div
    style={{
      padding: "1.25rem",
      borderRadius: "0.875rem",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
      <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.28)" }}>
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
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)")}
        >
          <Pencil style={{ width: 9, height: 9 }} />
          Edit
        </button>
      )}
    </div>
    {children}
  </div>
);

const PriceLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{label}</span>
    <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "rgba(255,255,255,0.55)" }}>{value}</span>
  </div>
);
