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
  if (currentStep >= 8) return null;

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
        background: "rgba(8,8,12,0.96)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ padding: "1rem 1.5rem" }}
      >
        {/* Price summary */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1 }}>
          <div>
            {total > 0 ? (
              <>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 2, fontWeight: 500 }}>
                  Estimated total
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: "1.65rem", fontWeight: 700, fontFamily: "monospace", letterSpacing: "-0.03em", color: "#fff" }}>
                    €{total}
                  </span>
                  {addons.length > 0 && (
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                      incl. {addons.length} add-on{addons.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.22)" }}>
                Select a service to see pricing
              </p>
            )}
          </div>

          {/* Context pills */}
          <div className="hidden md:flex items-center gap-2">
            {service && (
              <span
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {pkg ? `${service.name} · ${pkg.name}` : service.name}
              </span>
            )}
            {bookingData.selectedDate && (
              <span
                style={{
                  fontSize: "0.58rem",
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {bookingData.selectedDate}
              </span>
            )}
          </div>
        </div>

        {/* CTA button */}
        <button
          type="button"
          id="drawer-continue-btn"
          disabled={!canContinue}
          onClick={onContinue}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "0.85rem 2rem",
            borderRadius: 999,
            background: canContinue ? "#fff" : "rgba(255,255,255,0.06)",
            color: canContinue ? "#000" : "rgba(255,255,255,0.2)",
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            border: canContinue ? "none" : "1px solid rgba(255,255,255,0.06)",
            cursor: canContinue ? "pointer" : "not-allowed",
            boxShadow: canContinue ? "0 0 30px rgba(255,255,255,0.08)" : "none",
            transition: "all 0.25s",
            whiteSpace: "nowrap",
            width: "100%",
            maxWidth: 260,
          }}
          onMouseEnter={(e) => { if (canContinue) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
          onMouseLeave={(e) => { if (canContinue) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
        >
          <span>{canContinue ? `Continue to ${stepName}` : "Complete this step"}</span>
          {canContinue && <ArrowRight style={{ width: 13, height: 13, strokeWidth: 2.5 }} />}
        </button>
      </div>
    </div>
  );
};
