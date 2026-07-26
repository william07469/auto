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
        background: "#fff",
        borderTop: "1.5px solid #e5e7eb",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ padding: "0.875rem 1.5rem" }}
      >
        {/* Price & context */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, minWidth: 0 }}>
          <div>
            {total > 0 ? (
              <>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 1 }}>
                  Estimate
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      letterSpacing: "-0.03em",
                      color: "#111827",
                    }}
                  >
                    €{total}
                  </span>
                  {addons.length > 0 && (
                    <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>
                      incl. {addons.length} extra{addons.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#d1d5db" }}>Select a service to see pricing</p>
            )}
          </div>

          {/* Context pills */}
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
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
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
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                  whiteSpace: "nowrap",
                }}
              >
                {bookingData.selectedDate}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
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
            background: canContinue ? "#111827" : "#f3f4f6",
            color: canContinue ? "#fff" : "#9ca3af",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: "none",
            cursor: canContinue ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            width: "100%",
            maxWidth: 240,
            boxShadow: canContinue ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <span>{canContinue ? `Continue to ${stepName}` : "Complete this step"}</span>
          {canContinue && <ArrowRight style={{ width: 13, height: 13, strokeWidth: 2.5 }} />}
        </button>
      </div>
    </div>
  );
};
