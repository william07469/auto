import React, { useEffect, useRef } from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, DYNAMIC_QUESTIONS, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
import { CheckCircle2, ArrowRight, Pencil } from "lucide-react";
import gsap from "gsap";

interface SummaryStepProps {
  bookingData: BookingState;
  onEditStep: (step: number) => void;
  onConfirmBooking: () => void;
  submitting: boolean;
  done: boolean;
}

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
  const dynamicGroup = bookingData.selectedServiceId ? DYNAMIC_QUESTIONS[bookingData.selectedServiceId] : null;
  const subOption = dynamicGroup?.options.find((o) => o.id === bookingData.selectedSubOptionId);
  const chosenAddOns = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));
  const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === bookingData.vehicle.sizeCategory);

  const basePrice = subOption?.price ?? mainService?.startingPrice ?? 0;
  const multiplier = vehicleCategory?.multiplier ?? 1.0;
  const vehicleAdjustedPrice = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = vehicleAdjustedPrice + addOnsTotal;

  const baseDurationMinutes = subOption?.durationMinutes ?? 240;
  const addOnsDurationMinutes = chosenAddOns.reduce((sum, a) => sum + a.durationMinutes, 0);
  const totalDurationHours = ((baseDurationMinutes + addOnsDurationMinutes) / 60).toFixed(1);

  useEffect(() => {
    if (containerRef.current && !done) {
      gsap.fromTo(
        Array.from(containerRef.current.children),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" }
      );
    }
  }, [done]);

  useEffect(() => {
    if (done && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.88, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: "back.out(1.4)" }
      );
    }
  }, [done]);

  // ─── Success screen ────────────────────────────────────────────────────────
  if (done) {
    return (
      <div ref={successRef} className="max-w-lg mx-auto text-center py-16 px-6 space-y-8">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.08)]">
          <CheckCircle2 className="w-9 h-9 text-white/80 stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <p className="text-eyebrow text-white/40">Appointment Confirmed</p>
          <h2 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
            Your booking is confirmed.
          </h2>
          <p className="text-white/45 text-sm leading-relaxed max-w-sm mx-auto">
            Thank you, <span className="text-white/70">{bookingData.customer.fullName}</span>. A technician has been assigned for{" "}
            <span className="text-white/70 font-mono">{bookingData.selectedDate}</span> at{" "}
            <span className="text-white/70 font-mono">{bookingData.selectedTimeSlot}</span>.
          </p>
        </div>

        {/* Summary card */}
        <div className="text-left p-6 rounded-2xl bg-white/[0.03] border border-white/8 space-y-3">
          {[
            {
              label: "Booking reference",
              value: `WV-${(Math.random() * 899999 + 100000).toFixed(0)}`,
              mono: true,
              accent: true,
            },
            {
              label: "Vehicle",
              value: `${bookingData.vehicle.year} ${bookingData.vehicle.make} ${bookingData.vehicle.model}`,
              mono: false,
            },
            {
              label: "Service",
              value: subOption?.title ?? mainService?.name ?? "—",
              mono: false,
            },
          ].map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 text-xs py-1.5 border-b border-white/5 last:border-0">
              <span className="text-white/30">{row.label}</span>
              <span className={`text-right ${row.mono ? "font-mono" : ""} ${row.accent ? "text-white font-semibold" : "text-white/65"}`}>
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between pt-3 border-t border-white/8">
            <span className="text-xs text-white/40">Estimated total</span>
            <span className="text-2xl font-bold font-mono text-white">€{totalPrice}</span>
          </div>
        </div>

        <p className="text-[10px] text-white/25">
          Confirmation sent to <span className="text-white/40">{bookingData.customer.email}</span>
        </p>
      </div>
    );
  }

  // ─── Summary review screen ─────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2 mb-8">
        <p className="text-eyebrow">Review & Confirm</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          Booking summary
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          Review your selections before confirming. You can go back to edit any step.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Detail cards */}
        <div className="lg:col-span-3 space-y-4">
          {/* Service */}
          <SummaryCard title="Service" onEdit={() => onEditStep(1)} editLabel="Edit">
            <div>
              <p className="text-base font-semibold text-white">{mainService?.name}</p>
              <p className="text-xs text-white/50 mt-0.5">{subOption?.title ?? "Standard package"}</p>
              <p className="text-[11px] text-white/35 mt-2 leading-relaxed line-clamp-2">{subOption?.description}</p>
            </div>
          </SummaryCard>

          {/* Vehicle */}
          <SummaryCard title="Vehicle" onEdit={() => onEditStep(2)} editLabel="Edit">
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">
                {bookingData.vehicle.year} {bookingData.vehicle.make} {bookingData.vehicle.model}
              </p>
              <p className="text-[11px] text-white/35">
                {bookingData.vehicle.color} · {vehicleCategory?.label}
              </p>
            </div>
          </SummaryCard>

          {/* Add-ons */}
          <SummaryCard
            title={`Add-ons ${chosenAddOns.length > 0 ? `(${chosenAddOns.length})` : ""}`}
            onEdit={() => onEditStep(3)}
            editLabel="Edit"
          >
            {chosenAddOns.length === 0 ? (
              <p className="text-[11px] text-white/25 italic">No add-ons selected.</p>
            ) : (
              <div className="space-y-2">
                {chosenAddOns.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-white/60">{addon.name}</span>
                    <span className="font-mono text-white/60">+€{addon.price}</span>
                  </div>
                ))}
              </div>
            )}
          </SummaryCard>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard title="Date" onEdit={() => onEditStep(5)} editLabel="Edit" compact>
              <p className="text-sm font-bold font-mono text-white">{bookingData.selectedDate ?? "—"}</p>
            </SummaryCard>
            <SummaryCard title="Time" onEdit={() => onEditStep(6)} editLabel="Edit" compact>
              <p className="text-sm font-bold font-mono text-white">{bookingData.selectedTimeSlot ? `${bookingData.selectedTimeSlot}` : "—"}</p>
              <p className="text-[10px] text-white/25 mt-1">~{totalDurationHours}h estimated</p>
            </SummaryCard>
          </div>

          {/* Customer */}
          <SummaryCard title="Contact" onEdit={() => onEditStep(7)} editLabel="Edit">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">{bookingData.customer.fullName || "—"}</p>
              <p className="text-[11px] text-white/40">{bookingData.customer.email}</p>
              <p className="text-[11px] text-white/40">{bookingData.customer.phone}</p>
            </div>
          </SummaryCard>
        </div>

        {/* Right: Price & CTA */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
            {/* Price breakdown */}
            <div>
              <p className="text-eyebrow mb-4">Price estimate</p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-white/40">
                  <span>Base service</span>
                  <span className="font-mono text-white/60">€{basePrice}</span>
                </div>
                {multiplier > 1.0 && (
                  <div className="flex justify-between text-white/40">
                    <span>Size surcharge ({vehicleCategory?.label})</span>
                    <span className="font-mono text-white/60">+€{vehicleAdjustedPrice - basePrice}</span>
                  </div>
                )}
                {chosenAddOns.length > 0 && (
                  <div className="flex justify-between text-white/40">
                    <span>Add-ons ({chosenAddOns.length})</span>
                    <span className="font-mono text-white/60">+€{addOnsTotal}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 flex items-baseline justify-between">
                <span className="text-sm text-white/50">Total estimate</span>
                <span className="text-3xl font-bold font-mono text-white">€{totalPrice}</span>
              </div>
              <p className="text-[9px] text-white/20 mt-2">Final price confirmed at appointment.</p>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              id="confirm-booking-btn"
              disabled={submitting}
              onClick={onConfirmBooking}
              className="w-full py-5 px-6 rounded-xl font-semibold text-sm tracking-wide bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_40px_rgba(255,255,255,0.10)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="text-black/60">Processing…</span>
              ) : (
                <>
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            <p className="text-[9px] text-white/20 text-center leading-relaxed">
              By booking you agree to our service terms. Free cancellation up to 24h before.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Helper card component ────────────────────────────────────────────────────
const SummaryCard: React.FC<{
  title: string;
  onEdit?: () => void;
  editLabel?: string;
  compact?: boolean;
  children: React.ReactNode;
}> = ({ title, onEdit, editLabel, compact, children }) => (
  <div className={`p-5 rounded-xl bg-white/[0.025] border border-white/8 ${compact ? "" : ""}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">{title}</span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-white/25 hover:text-white/60 transition-colors"
        >
          <Pencil className="w-2.5 h-2.5" />
          {editLabel}
        </button>
      )}
    </div>
    {children}
  </div>
);
