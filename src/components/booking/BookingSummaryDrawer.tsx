import React from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, DYNAMIC_QUESTIONS, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
import { ArrowRight } from "lucide-react";

interface BookingSummaryDrawerProps {
  bookingData: BookingState;
  onContinue: () => void;
  canContinue: boolean;
  stepName: string;
  currentStep: number;
}

export const BookingSummaryDrawer: React.FC<BookingSummaryDrawerProps> = ({
  bookingData,
  onContinue,
  canContinue,
  stepName,
  currentStep,
}) => {
  const mainService = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const dynamicGroup = bookingData.selectedServiceId ? DYNAMIC_QUESTIONS[bookingData.selectedServiceId] : null;
  const subOption = dynamicGroup?.options.find((o) => o.id === bookingData.selectedSubOptionId);
  const chosenAddOns = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));
  const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === bookingData.vehicle.sizeCategory);

  const basePrice = subOption?.price ?? mainService?.startingPrice ?? 0;
  const multiplier = vehicleCategory?.multiplier ?? 1.0;
  const vehicleAdjustedPrice = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = bookingData.selectedServiceId ? vehicleAdjustedPrice + addOnsTotal : 0;

  // Don't show drawer on summary step itself
  if (currentStep >= 8) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#08080c]/95 border-t border-white/8 backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.7)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Price summary */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div>
            {totalPrice > 0 ? (
              <>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-0.5">Estimated total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                    €{totalPrice}
                  </span>
                  {chosenAddOns.length > 0 && (
                    <span className="text-[10px] text-white/40 font-mono">
                      incl. {chosenAddOns.length} add-on{chosenAddOns.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-white/25">Select a service to see pricing</p>
            )}
          </div>

          {/* Context tags */}
          <div className="hidden md:flex items-center gap-2">
            {mainService && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-white/40 uppercase tracking-[0.15em]">
                {subOption?.title ?? mainService.name}
              </span>
            )}
            {bookingData.selectedDate && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-white/40 font-mono">
                {bookingData.selectedDate}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          id="drawer-continue-btn"
          disabled={!canContinue}
          onClick={onContinue}
          className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
            canContinue
              ? "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.08)] cursor-pointer"
              : "bg-white/8 text-white/20 border border-white/6 cursor-not-allowed"
          }`}
        >
          <span>{canContinue ? `Continue to ${stepName}` : `Complete this step`}</span>
          {canContinue && <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>
      </div>
    </div>
  );
};
