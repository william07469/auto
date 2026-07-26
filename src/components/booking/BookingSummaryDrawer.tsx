import React from "react";
import { BookingState } from "./types";
import {
  SERVICES_DATA,
  PACKAGES_DATA,
  ADDONS_DATA,
  INDIVIDUAL_SERVICES,
  VEHICLE_OPTIONS,
} from "./bookingData";

interface Props {
  bookingData: BookingState;
}

export const BookingSummaryDrawer: React.FC<Props> = ({ bookingData }) => {
  // Only show a mini summary pill from step 3 onward, and hide on last two steps
  if (bookingData.step < 3 || bookingData.step >= 6) return null;

  const category = SERVICES_DATA.find((s) => s.id === bookingData.selectedServiceId);
  const packages = bookingData.selectedServiceId
    ? PACKAGES_DATA[bookingData.selectedServiceId]
    : [];
  const pkg = packages.find((p) => p.id === bookingData.selectedPackageId);
  const individualSvc = INDIVIDUAL_SERVICES.find(
    (s) => s.id === bookingData.selectedIndividualServiceId
  );
  const vehicle = VEHICLE_OPTIONS.find((v) => v.id === bookingData.selectedVehicleId);
  const addons = ADDONS_DATA.filter((a) =>
    bookingData.selectedAddOnIds.includes(a.id)
  );

  const isIndividual = bookingData.bookingMode === "individual";
  const basePrice = isIndividual
    ? (individualSvc?.price ?? 0)
    : (pkg?.price ?? 0);
  const vehicleSurcharge = vehicle?.surcharge ?? 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = basePrice + vehicleSurcharge + addonsTotal;

  const serviceLabel = isIndividual
    ? (individualSvc?.name ?? "")
    : pkg
    ? `${category?.name ?? ""} · ${pkg.name}`
    : (category?.name ?? "");

  if (!serviceLabel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 56,
        left: 0,
        right: 0,
        zIndex: 19,
        background: "rgba(10,10,10,0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.55rem 1.5rem",
      }}
    >
      <div
        className="max-w-3xl mx-auto flex items-center justify-between gap-4"
        style={{ flexWrap: "wrap" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {serviceLabel && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {serviceLabel}
            </span>
          )}
          {vehicle && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {vehicle.name}
            </span>
          )}
        </div>

        {total > 0 && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: "0.58rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Ab
            </span>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                fontFamily: "monospace",
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              €{total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
