import React from "react";
import { BookingState } from "./types";
import { SERVICES_DATA, PACKAGES_DATA, ADDONS_DATA } from "./bookingData";
import { ArrowRight } from "lucide-react";

interface Props {
  bookingData: BookingState;
  onContinue: () => void;
  canContinue: boolean;
  stepName: string;
  currentStep: number;
}

export const BookingSummaryDrawer: React.FC<Props> = ({
  bookingData,
  onContinue,
  canContinue,
  stepName,
  currentStep,
}) => {
  if (currentStep >= 5) return null;

  const service = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const packages = bookingData.selectedServiceId ? PACKAGES_DATA[bookingData.selectedServiceId] : [];
  const pkg = packages.find((p) => p.id === bookingData.selectedPackageId);
  const addons = ADDONS_DATA.filter((a) => bookingData.selectedAddOnIds.includes(a.id));

  const basePrice = pkg?.price ?? 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = bookingData.selectedServiceId ? basePrice + addonsTotal : 0;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "#0d0d0d",
        borderTop: "1.5px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ padding: "0.875rem 1.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, minWidth: 0 }}>
          <div>
            {total > 0 ? (
              <>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 1 }}>
                  Estimate
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      letterSpacing: "-0.03em",
                      color: "#fff",
                    }}
                  >
                    €{total}
                  </span>
                  {addons.length > 0 && (
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                      incl. {addons.length} extra{addons.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)" }}>Select a service to see pricing</p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {service && (
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                {pkg ? `${service.name} · ${pkg.name}` : service.name}
              </span>
            )}
            {bookingData.selectedDate && (
              <span
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                {bookingData.selectedDate}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "0.8rem 1.75rem",
            borderRadius: 999,
            background: canContinue ? "#fff" : "rgba(255,255,255,0.06)",
            color: canContinue ? "#000" : "rgba(255,255,255,0.2)",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: canContinue ? "none" : "1px solid rgba(255,255,255,0.07)",
            cursor: canContinue ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            width: "100%",
            maxWidth: 240,
            boxShadow: canContinue ? "0 2px 12px rgba(255,255,255,0.09)" : "none",
          }}
        >
          <span>{canContinue ? `Continue to ${stepName}` : "Complete this step"}</span>
          {canContinue && <ArrowRight style={{ width: 13, height: 13, strokeWidth: 2.5 }} />}
        </button>
      </div>
    </div>
  );
};
