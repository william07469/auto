import React from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, DYNAMIC_QUESTIONS, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
import { Sparkles, Clock } from "lucide-react";

interface BookingSummaryDrawerProps {
  bookingData: BookingState;
  onContinue: () => void;
  canContinue: boolean;
  stepName: string;
}

export const BookingSummaryDrawer: React.FC<BookingSummaryDrawerProps> = ({
  bookingData,
  onContinue,
  canContinue,
  stepName,
}) => {
  const mainService = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const dynamicGroup = bookingData.selectedServiceId ? DYNAMIC_QUESTIONS[bookingData.selectedServiceId] : null;
  const subOption = dynamicGroup?.options.find((o) => o.id === bookingData.selectedSubOptionId);

  const chosenAddOns = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));
  const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === bookingData.vehicle.sizeCategory);

  // Price calculation
  const basePrice = subOption?.price || mainService?.startingPrice || 0;
  const multiplier = vehicleCategory?.multiplier || 1.0;
  const vehicleAdjustedPrice = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = bookingData.selectedServiceId ? vehicleAdjustedPrice + addOnsTotal : 0;

  // Duration calculation
  const baseDurationMinutes = subOption?.durationMinutes || 180;
  const addOnsDurationMinutes = chosenAddOns.reduce((sum, a) => sum + a.durationMinutes, 0);
  const totalHours = bookingData.selectedServiceId ? ((baseDurationMinutes + addOnsDurationMinutes) / 60).toFixed(1) : "0";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-white/10 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Info Summary */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Preisschätzung
            </span>
            <div className="flex items-baseline gap-3 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                €{totalPrice}
              </span>
              {totalPrice > 0 && (
                <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  ca. {totalHours} Std.
                </span>
              )}
            </div>
          </div>

          {/* Quick breakdown tags */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            {mainService && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300">
                {subOption?.title || mainService.name}
              </span>
            )}
            {chosenAddOns.length > 0 && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono">
                +{chosenAddOns.length} Add-Ons
              </span>
            )}
          </div>
        </div>

        {/* Right CTA Button */}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-extrabold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
            canContinue
              ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black shadow-[0_0_25px_rgba(52,211,153,0.6)] hover:brightness-110 cursor-pointer"
              : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
          }`}
        >
          <span>Weiter zu {stepName}</span>
        </button>
      </div>
    </div>
  );
};
