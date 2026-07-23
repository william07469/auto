import React, { useEffect, useRef } from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, DYNAMIC_QUESTIONS, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
import { Sparkles, ShieldCheck, Car, Calendar, User, Clock, CheckCircle2, ArrowRight, Award } from "lucide-react";
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

  // Price calculations
  const basePrice = subOption?.price || mainService?.startingPrice || 0;
  const multiplier = vehicleCategory?.multiplier || 1.0;
  const vehicleAdjustedPrice = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = vehicleAdjustedPrice + addOnsTotal;

  // Duration calculation
  const baseDurationMinutes = subOption?.durationMinutes || 240;
  const addOnsDurationMinutes = chosenAddOns.reduce((sum, a) => sum + a.durationMinutes, 0);
  const totalDurationHours = (baseDurationMinutes + addOnsDurationMinutes) / 60;

  useEffect(() => {
    if (containerRef.current && !done) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, scale: 0.97, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [done]);

  useEffect(() => {
    if (done && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
      );
    }
  }, [done]);

  if (done) {
    return (
      <div ref={successRef} className="max-w-2xl mx-auto text-center py-12 px-6">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_50px_rgba(52,211,153,0.5)]">
          <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 stroke-[2.5]" />
          </div>
        </div>

        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3.5 py-1 rounded-full">
          Termin Bestätigt
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Ihre Buchung ist erfolgreich reserviert!
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base mt-3 leading-relaxed">
          Vielen Dank, <span className="text-white font-semibold">{bookingData.customer.fullName}</span>. Ein Aufbereitungsexperte wurde für Ihren Termin am{" "}
          <span className="text-emerald-400 font-semibold">{bookingData.selectedDate}</span> um{" "}
          <span className="text-emerald-400 font-semibold">{bookingData.selectedTimeSlot} Uhr</span> eingeteilt.
        </p>

        <div className="mt-8 p-6 rounded-2xl bg-zinc-950/80 border border-white/10 text-left space-y-3">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Buchungscode:</span>
            <span className="font-mono text-emerald-400 font-bold">WV-{(Math.random() * 899999 + 100000).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Fahrzeug:</span>
            <span className="text-white font-medium">{bookingData.vehicle.year} {bookingData.vehicle.make} {bookingData.vehicle.model}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Gewählter Service:</span>
            <span className="text-white font-medium">{subOption?.title || mainService?.name}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-white/10 font-bold">
            <span className="text-white">Geschätzter Gesamtpreis:</span>
            <span className="text-emerald-400 font-mono text-base">€{totalPrice}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 mt-6">
          Eine Bestätigung wurde an <span className="text-zinc-300">{bookingData.customer.email}</span> gesendet.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
          Finaler Schritt — Übersicht & Bestätigung
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
          Buchungsübersicht kontrollieren
        </h3>
        <p className="text-zinc-400 text-sm mt-1">
          Bitte überprüfen Sie alle Angaben vor dem Absenden Ihrer Buchung.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Details (Left 2 cols) */}
        <div className="md:col-span-2 space-y-5">
          {/* Card 1: Selected Service */}
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Service & Behandlung
              </div>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
              >
                Ändern
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-lg font-extrabold text-white">{mainService?.name}</h4>
              <p className="text-xs text-emerald-400/90 font-medium">{subOption?.title || "Standard Paket"}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{subOption?.description}</p>
              
              {bookingData.customServiceNote && (
                <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300">
                  <span className="text-emerald-400 font-semibold block mb-0.5">Sonderwünsche:</span>
                  {bookingData.customServiceNote}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Add-Ons */}
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Gewählte Zusatzleistungen ({chosenAddOns.length})
              </div>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
              >
                Bearbeiten
              </button>
            </div>

            <div className="mt-4">
              {chosenAddOns.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">Keine zusätzlichen Add-Ons gewählt.</p>
              ) : (
                <div className="space-y-2">
                  {chosenAddOns.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-zinc-200 font-medium">{addon.name}</span>
                      <span className="font-mono text-emerald-400 font-semibold">+€{addon.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Vehicle & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vehicle Card */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-teal-400" />
                  Fahrzeug
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(3)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Ändern
                </button>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold text-white">
                  {bookingData.vehicle.year || "Jahr"} {bookingData.vehicle.make || "Marke"} {bookingData.vehicle.model || "Modell"}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Farbe: {bookingData.vehicle.color || "N/A"}</p>
                <p className="text-[10px] text-emerald-400/80 mt-1 uppercase tracking-wider font-semibold">
                  Klasse: {vehicleCategory?.label}
                </p>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Termin
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(4)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Ändern
                </button>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold text-white font-mono">{bookingData.selectedDate || "Nicht gewählt"}</p>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">Uhrzeit: {bookingData.selectedTimeSlot || "N/A"}</p>
                <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Geschätzte Dauer: ca. {totalDurationHours.toFixed(1)} Std.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Confirmation Panel */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-emerald-500/30 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Preiszusammenfassung</h4>
            </div>

            {/* Line items */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Grundpreis Service:</span>
                <span className="text-white font-mono">€{basePrice}</span>
              </div>

              {multiplier > 1.0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Größenzuschlag ({vehicleCategory?.label}):</span>
                  <span className="text-emerald-400 font-mono">+€{vehicleAdjustedPrice - basePrice}</span>
                </div>
              )}

              {chosenAddOns.length > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Add-Ons Gesamt ({chosenAddOns.length}):</span>
                  <span className="text-emerald-400 font-mono">+€{addOnsTotal}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-white">Gesamtschätzung:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  €{totalPrice}
                </span>
              </div>
            </div>

            {/* Customer Quick View */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs space-y-1 mb-6">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                {bookingData.customer.fullName || "Kundenname"}
              </div>
              <p className="text-[11px] text-zinc-400">{bookingData.customer.email}</p>
              <p className="text-[11px] text-zinc-400">{bookingData.customer.phone}</p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirmBooking}
            className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black hover:brightness-110 active:scale-98 shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span>Termin wird gebucht...</span>
            ) : (
              <>
                <span>Jetzt Verbindlich Buchen</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
