import React from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, ADDONS_DATA, VEHICLE_SIZES } from "./bookingData";
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
  const chosenAddOns = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));
  const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === bookingData.vehicle.sizeCategory);

  const basePrice = mainService?.startingPrice ?? 0;
  const multiplier = vehicleCategory?.multiplier ?? 1.0;
  const adjustedBase = Math.round(basePrice * multiplier);
  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = bookingData.selectedServiceId ? adjustedBase + addOnsTotal : 0;

  if (currentStep >= 7) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(8,8,12,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 -20px 50px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Estimated Price */}
        <div>
          {totalPrice > 0 ? (
            <div>
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  display: "block",
                  marginBottom: 2,
                }}
              >
                Estimated Price
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    fontFamily: "monospace",
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  €{totalPrice}
                </span>
                {chosenAddOns.length > 0 && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontFamily: "monospace",
                      color: "rgba(96,165,250,0.7)",
                    }}
                  >
                    +{chosenAddOns.length} add-on{chosenAddOns.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>
              Select a service to begin
            </span>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          id="drawer-continue-btn"
          disabled={!canContinue}
          onClick={onContinue}
          style={{
            padding: "0.85rem 2rem",
            borderRadius: 99,
            background: canContinue ? "#ffffff" : "rgba(255,255,255,0.06)",
            color: canContinue ? "#000000" : "rgba(255,255,255,0.2)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border: "none",
            cursor: canContinue ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: canContinue ? "0 0 30px rgba(255,255,255,0.12)" : "none",
          }}
          onMouseEnter={(e) => {
            if (canContinue) {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
              (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
            }
          }}
          onMouseLeave={(e) => {
            if (canContinue) {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.background = "#ffffff";
            }
          }}
        >
          <span>{canContinue ? `Continue to ${stepName}` : "Complete step"}</span>
          {canContinue && <ArrowRight size={13} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
};
