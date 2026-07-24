import React, { useEffect, useRef } from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
import { CheckCircle2, ArrowRight, Edit2 } from "lucide-react";
import gsap from "gsap";

interface SummaryStepProps {
  bookingData: BookingState;
  onEditStep: (step: number) => void;
  onConfirmBooking: () => void;
  submitting: boolean;
  done: boolean;
}

const VEHICLE_IMAGES: Record<string, string> = {
  coupe: "/vehicle-coupe.png",
  sedan: "/vehicle-sedan.png",
  suv: "/vehicle-suv.png",
  van: "/vehicle-van.png",
};

export const SummaryStep: React.FC<SummaryStepProps> = ({
  bookingData,
  onEditStep,
  onConfirmBooking,
  submitting,
  done,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const mainService = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const chosenAddOns = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));
  const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === bookingData.vehicle.sizeCategory);

  const basePrice = mainService?.startingPrice ?? 0;
  const multiplier = vehicleCategory?.multiplier ?? 1.0;
  const adjustedBase = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = adjustedBase + addOnsTotal;

  useEffect(() => {
    if (containerRef.current && !done) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [done]);

  useEffect(() => {
    if (done && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.95, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [done]);

  // ── Confirmation Screen ───────────────────────────────────────────────────
  if (done) {
    return (
      <div
        ref={successRef}
        style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "3rem 1rem" }}
      >
        <div
          style={{
            margin: "0 auto 2rem",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(96,165,250,0.08)",
            border: "1px solid rgba(96,165,250,0.25)",
            boxShadow: "0 0 60px rgba(96,165,250,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle2 size={32} color="rgb(96,165,250)" strokeWidth={1.5} />
        </div>

        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(96,165,250,0.8)",
            marginBottom: "0.75rem",
          }}
        >
          Booking Confirmed
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Your appointment is set
        </h2>
        <p
          style={{
            fontSize: "0.88rem",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Thank you, <span style={{ color: "#fff" }}>{bookingData.customer.fullName}</span>. A confirmation has been sent to{" "}
          <span style={{ color: "#fff" }}>{bookingData.customer.email}</span>.
        </p>

        {/* Receipt Box */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "1.75rem",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Service</span>
            <span style={{ color: "#fff", fontWeight: 500 }}>{mainService?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Vehicle</span>
            <span style={{ color: "#fff", fontWeight: 500 }}>{vehicleCategory?.label}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Date & Time</span>
            <span style={{ color: "#fff", fontFamily: "monospace" }}>
              {bookingData.selectedDate} @ {bookingData.selectedTimeSlot}
            </span>
          </div>
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Estimated Total</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 600, fontFamily: "monospace", color: "#fff" }}>
              €{totalPrice}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Summary Screen ────────────────────────────────────────────────────────
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
          Step 7 — Summary
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
          Review your booking
        </h2>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 420 }}>
          Verify your appointment details before confirming.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {/* Left Column — Summary Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Service Card */}
          <SummaryCard title="Selected Service" step={1} onEdit={onEditStep}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "#fff" }}>{mainService?.name}</span>
              <span style={{ fontSize: "0.9rem", fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>
                €{basePrice}
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>
              {mainService?.tagline}
            </p>
          </SummaryCard>

          {/* Vehicle Card */}
          <SummaryCard title="Vehicle Type" step={2} onEdit={onEditStep}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {vehicleCategory && VEHICLE_IMAGES[vehicleCategory.id] && (
                <img
                  src={VEHICLE_IMAGES[vehicleCategory.id]}
                  alt={vehicleCategory.label}
                  style={{ width: 64, height: 42, objectFit: "cover", borderRadius: 8, background: "#000" }}
                />
              )}
              <div>
                <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "#fff", display: "block" }}>
                  {vehicleCategory?.label}
                </span>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                  {vehicleCategory?.subtext}
                </span>
              </div>
            </div>
          </SummaryCard>

          {/* Add-ons Card */}
          <SummaryCard title={`Selected Add-ons (${chosenAddOns.length})`} step={3} onEdit={onEditStep}>
            {chosenAddOns.length === 0 ? (
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
                No add-ons selected
              </span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {chosenAddOns.map((addon) => (
                  <div key={addon.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{addon.name}</span>
                    <span style={{ color: "rgb(96,165,250)", fontFamily: "monospace" }}>+€{addon.price}</span>
                  </div>
                ))}
              </div>
            )}
          </SummaryCard>

          {/* Schedule & Contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <SummaryCard title="Date & Time" step={4} onEdit={onEditStep}>
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#fff", display: "block", fontFamily: "monospace" }}>
                {bookingData.selectedDate}
              </span>
              <span style={{ fontSize: "0.78rem", color: "rgba(96,165,250,0.9)", fontFamily: "monospace" }}>
                {bookingData.selectedTimeSlot}
              </span>
            </SummaryCard>

            <SummaryCard title="Contact" step={6} onEdit={onEditStep}>
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#fff", display: "block" }}>
                {bookingData.customer.fullName}
              </span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", display: "block" }}>
                {bookingData.customer.email}
              </span>
            </SummaryCard>
          </div>
        </div>

        {/* Right Column — Pricing & CTA Box */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              position: "sticky",
              top: "6rem",
              background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "1.25rem",
                }}
              >
                Estimated Breakdown
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Base service</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>€{basePrice}</span>
                </div>
                {multiplier > 1.0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Size adjustment</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>+€{adjustedBase - basePrice}</span>
                  </div>
                )}
                {chosenAddOns.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Add-ons ({chosenAddOns.length})</span>
                    <span style={{ color: "rgb(96,165,250)", fontFamily: "monospace" }}>+€{addOnsTotal}</span>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>Total Estimated</span>
                <span style={{ fontSize: "2.2rem", fontWeight: 600, fontFamily: "monospace", color: "#ffffff" }}>
                  €{totalPrice}
                </span>
              </div>
            </div>

            {/* Book Appointment CTA Button */}
            <button
              type="button"
              id="confirm-booking-btn"
              disabled={submitting}
              onClick={onConfirmBooking}
              style={{
                width: "100%",
                padding: "1.2rem",
                borderRadius: 99,
                background: "#ffffff",
                color: "#000000",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 10px 40px rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: submitting ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 50px rgba(255,255,255,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 40px rgba(255,255,255,0.15)";
                }
              }}
            >
              <span>{submitting ? "Processing..." : "Book Appointment"}</span>
              {!submitting && <ArrowRight size={14} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}> = ({ title, step, onEdit, children }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.018)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18,
      padding: "1.25rem 1.5rem",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
        {title}
      </span>
      <button
        type="button"
        onClick={() => onEdit(step)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(96,165,250,0.9)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
      >
        <Edit2 size={10} />
        Edit
      </button>
    </div>
    {children}
  </div>
);
