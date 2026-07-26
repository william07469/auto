import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import {
  BookingState,
  ServiceId,
  PackageId,
  IndividualServiceId,
  VehicleType,
  BookingMode,
  CustomerDetails,
} from "@/components/booking/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { PackageStep } from "@/components/booking/PackageStep";
import { VehicleStep } from "@/components/booking/VehicleStep";
import { AddOnStep } from "@/components/booking/AddOnStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { CustomerStep } from "@/components/booking/CustomerStep";
import { SummaryStep } from "@/components/booking/SummaryStep";
import { BookingSummaryDrawer } from "@/components/booking/BookingSummaryDrawer";
import {
  SERVICES_DATA,
  ADDONS_DATA,
  PACKAGES_DATA,
  INDIVIDUAL_SERVICES,
  VEHICLE_OPTIONS,
} from "@/components/booking/bookingData";
import { createBooking } from "@/functions/createBooking";
import { supabase } from "@/integrations/client";

export const Route = createFileRoute("/buchen")({
  ssr: false,
  component: BookingPage,
  head: () => ({
    meta: [
      { title: "Termin buchen — WV Detailing" },
      {
        name: "description",
        content:
          "Buchen Sie Ihren Premium-Fahrzeugpflegetermin bei WV Detailing.",
      },
    ],
  }),
});

// ── Flow config ───────────────────────────────────────────────────────────────
// 7-step flow:
//  1 → Kategorie (Service)
//  2 → Paket oder Einzelleistung
//  3 → Fahrzeug
//  4 → Extras (Add-ons)
//  5 → Datum & Uhrzeit
//  6 → Kontaktdaten
//  7 → Übersicht & Bestätigung

const TOTAL_STEPS = 7;

const NEXT_LABELS: Record<number, string> = {
  1: "Leistung",
  2: "Fahrzeug",
  3: "Extras",
  4: "Termin",
  5: "Kontakt",
  6: "Übersicht",
};

const INITIAL_STATE: BookingState = {
  step: 1,
  selectedServiceId: null,
  bookingMode: null,
  selectedPackageId: null,
  selectedIndividualServiceId: null,
  selectedVehicleId: null,
  selectedAddOnIds: [],
  selectedDate: null,
  selectedTimeSlot: null,
  customer: { fullName: "", phone: "", email: "", notes: "" },
  questionAnswers: [],
};

// ── Component ─────────────────────────────────────────────────────────────────

function BookingPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  // Sync admin prices from pricing_packages into PACKAGES_DATA
  useEffect(() => {
    supabase
      .from("pricing_packages")
      .select("category,tier,price")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data?.length) return;
        for (const row of data as any[]) {
          const cat = (row.category ?? "").toLowerCase();
          const svc = SERVICES_DATA.find(
            (s) => s.id === cat || s.name.toLowerCase().includes(cat)
          );
          if (!svc) continue;
          const tierMap: Record<string, PackageId> = {
            basic: "basic",
            deluxe: "deluxe",
            premium: "premium",
          };
          const pkgId = tierMap[row.tier as string];
          if (!pkgId || row.price <= 0) continue;
          const pkgs = PACKAGES_DATA[svc.id];
          const pkg = pkgs.find((p) => p.id === pkgId);
          if (pkg) pkg.price = row.price;
        }
      });
  }, []);

  // Pre-fill email from auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setBooking((p) => ({
          ...p,
          customer: { ...p.customer, email: user.email! },
        }));
      }
    });
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectService = (id: ServiceId) => {
    setBooking((p) => ({
      ...p,
      selectedServiceId: id,
      selectedPackageId: null,
      selectedIndividualServiceId: null,
      bookingMode: null,
      questionAnswers: [],
    }));
  };

  const handleSelectPackage = (id: PackageId) => {
    setBooking((p) => ({
      ...p,
      selectedPackageId: id,
      selectedIndividualServiceId: null,
    }));
  };

  const handleSelectIndividualService = (id: IndividualServiceId) => {
    setBooking((p) => ({
      ...p,
      selectedIndividualServiceId: id,
      selectedPackageId: null,
    }));
  };

  const handleSetBookingMode = (mode: BookingMode) => {
    setBooking((p) => ({ ...p, bookingMode: mode }));
  };

  const handleSelectVehicle = (id: VehicleType) => {
    setBooking((p) => ({ ...p, selectedVehicleId: id }));
  };

  const handleToggleAddOn = (id: string) => {
    setBooking((p) => ({
      ...p,
      selectedAddOnIds: p.selectedAddOnIds.includes(id)
        ? p.selectedAddOnIds.filter((x) => x !== id)
        : [...p.selectedAddOnIds, id],
    }));
  };

  const handleChangeCustomer = (updated: Partial<CustomerDetails>) => {
    setBooking((p) => ({ ...p, customer: { ...p.customer, ...updated } }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!booking.selectedServiceId;
      case 2:
        if (booking.bookingMode === "package") return !!booking.selectedPackageId;
        if (booking.bookingMode === "individual") return !!booking.selectedIndividualServiceId;
        return false;
      case 3:
        return !!booking.selectedVehicleId;
      case 4:
        return true; // add-ons optional
      case 5:
        return !!booking.selectedDate && !!booking.selectedTimeSlot;
      case 6:
        return true; // validated on submit
      case 7:
        return true;
      default:
        return false;
    }
  };

  // ── Animated step transition ──────────────────────────────────────────────

  const goToStep = (next: number) => {
    if (next < 1 || next > TOTAL_STEPS) return;
    if (stepRef.current) {
      gsap.to(stepRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setBooking((p) => ({ ...p, step: next }));
          window.scrollTo({ top: 0, behavior: "smooth" });
          gsap.fromTo(
            stepRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" }
          );
        },
      });
    } else {
      setBooking((p) => ({ ...p, step: next }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!isStepValid(booking.step)) {
      const msgs: Record<number, string> = {
        1: "Bitte wählen Sie eine Kategorie aus.",
        2: "Bitte wählen Sie ein Paket oder eine Einzelleistung.",
        3: "Bitte wählen Sie Ihr Fahrzeug aus.",
        5: "Bitte wählen Sie ein Datum und eine Uhrzeit.",
      };
      const msg = msgs[booking.step];
      if (msg) toast.error(msg);
      return;
    }
    if (booking.step < TOTAL_STEPS) goToStep(booking.step + 1);
  };

  const handleBack = () => {
    if (booking.step > 1) goToStep(booking.step - 1);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleConfirmBooking = async () => {
    if (
      !booking.customer.fullName.trim() ||
      !booking.customer.phone.trim() ||
      !booking.customer.email.trim()
    ) {
      toast.error("Bitte geben Sie Ihren Namen, Ihre Telefonnummer und E-Mail an.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/kunden-login", search: { redirect: "/buchen" } });
        return;
      }

      const category = SERVICES_DATA.find(
        (s) => s.id === booking.selectedServiceId
      );
      const packages = booking.selectedServiceId
        ? PACKAGES_DATA[booking.selectedServiceId]
        : [];
      const pkg = packages.find((p) => p.id === booking.selectedPackageId);
      const individualSvc = INDIVIDUAL_SERVICES.find(
        (s) => s.id === booking.selectedIndividualServiceId
      );
      const vehicle = VEHICLE_OPTIONS.find(
        (v) => v.id === booking.selectedVehicleId
      );
      const addons = ADDONS_DATA.filter((a) =>
        booking.selectedAddOnIds.includes(a.id)
      );

      const isIndividual = booking.bookingMode === "individual";
      const basePrice = isIndividual
        ? (individualSvc?.price ?? 0)
        : (pkg?.price ?? 0);
      const vehicleSurcharge = vehicle?.surcharge ?? 0;
      const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
      const estimatedPrice = basePrice + vehicleSurcharge + addonsTotal;

      const serviceStr = isIndividual
        ? `${individualSvc?.name ?? ""}${
            addons.length > 0
              ? ` + [${addons.map((a) => a.name).join(", ")}]`
              : ""
          }`
        : `${category?.name ?? ""}${pkg ? ` — ${pkg.name}` : ""}${
            addons.length > 0
              ? ` + [${addons.map((a) => a.name).join(", ")}]`
              : ""
          }`;

      const vehicleStr = vehicle?.name ?? "—";

      const result = await createBooking({
        data: {
          service: serviceStr,
          vehicle: vehicleStr,
          booking_date: booking.selectedDate ?? "",
          booking_time: booking.selectedTimeSlot ?? "",
          customer_name: booking.customer.fullName,
          email: booking.customer.email,
          phone: booking.customer.phone,
          notes: booking.customer.notes || null,
          estimated_price: estimatedPrice,
        },
      });

      if (result.success) {
        setDone(true);
        toast.success("Buchung bestätigt! Sie erhalten eine Bestätigungs-E-Mail.");
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        WebkitFontSmoothing: "antialiased",
        paddingBottom: "9rem",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#000",
          borderBottom: "1px solid #1f1f1f",
        }}
      >
        <div
          className="max-w-3xl mx-auto flex items-center justify-between"
          style={{ padding: "0 1.5rem", height: 56 }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.75)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.35)")
            }
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
            Zurück
          </Link>

          <Link
            to="/kunden-login"
            search={{ redirect: "/buchen" }}
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.75)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.35)")
            }
          >
            Anmelden
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto" style={{ padding: "2.5rem 1.5rem 0" }}>
        {/* Step indicator */}
        {!done && (
          <StepIndicator
            currentStep={booking.step}
            totalSteps={TOTAL_STEPS}
            onStepClick={(s) => s < booking.step && goToStep(s)}
          />
        )}

        {/* Step content */}
        <div ref={stepRef} style={{ minHeight: 480 }}>
          {/* Step 1 — Kategorie */}
          {booking.step === 1 && (
            <ServiceStep
              selectedServiceId={booking.selectedServiceId}
              onSelectService={handleSelectService}
            />
          )}

          {/* Step 2 — Paket oder Einzelleistung */}
          {booking.step === 2 && booking.selectedServiceId && (
            <PackageStep
              selectedServiceId={booking.selectedServiceId}
              selectedPackageId={booking.selectedPackageId}
              selectedIndividualServiceId={booking.selectedIndividualServiceId}
              bookingMode={booking.bookingMode}
              onSelectPackage={handleSelectPackage}
              onSelectIndividualService={handleSelectIndividualService}
              onSetBookingMode={handleSetBookingMode}
            />
          )}

          {/* Step 3 — Fahrzeug */}
          {booking.step === 3 && (
            <VehicleStep
              selectedVehicleId={booking.selectedVehicleId}
              onSelectVehicle={handleSelectVehicle}
            />
          )}

          {/* Step 4 — Extras */}
          {booking.step === 4 && (
            <AddOnStep
              selectedAddOnIds={booking.selectedAddOnIds}
              onToggleAddOn={handleToggleAddOn}
            />
          )}

          {/* Step 5 — Datum & Uhrzeit */}
          {booking.step === 5 && (
            <DateTimeStep
              selectedDate={booking.selectedDate}
              selectedTimeSlot={booking.selectedTimeSlot}
              onSelectDate={(d) =>
                setBooking((p) => ({
                  ...p,
                  selectedDate: d,
                  selectedTimeSlot: null,
                }))
              }
              onSelectTimeSlot={(t) =>
                setBooking((p) => ({ ...p, selectedTimeSlot: t }))
              }
            />
          )}

          {/* Step 6 — Kontaktdaten */}
          {booking.step === 6 && (
            <CustomerStep
              customer={booking.customer}
              onChangeCustomer={handleChangeCustomer}
            />
          )}

          {/* Step 7 — Übersicht & Bestätigung */}
          {booking.step === 7 && !done && (
            <SummaryStep
              bookingData={booking}
              onEditStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              submitting={submitting}
              done={done}
            />
          )}

          {/* Done state */}
          {done && (
            <SummaryStep
              bookingData={booking}
              onEditStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              submitting={submitting}
              done={done}
            />
          )}
        </div>
      </main>

      {/* ── Bottom nav ── */}
      {!done && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid #1f1f1f",
            padding: "1rem 1.5rem",
          }}
        >
          <div
            className="max-w-3xl mx-auto flex items-center justify-between gap-4"
          >
            {/* Back */}
            <button
              type="button"
              onClick={handleBack}
              disabled={booking.step === 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0.75rem 1.25rem",
                borderRadius: "0.65rem",
                border: "1.5px solid rgba(255,255,255,0.12)",
                background: "transparent",
                color:
                  booking.step === 1
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.55)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: booking.step === 1 ? "not-allowed" : "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <ArrowLeft style={{ width: 13, height: 13 }} />
              Zurück
            </button>

            {/* Step counter */}
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              {booking.step} / {TOTAL_STEPS}
            </span>

            {/* Next — hidden on last step (confirm button is in summary) */}
            {booking.step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.65rem",
                  border: "none",
                  background: "#fff",
                  color: "#000",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                {NEXT_LABELS[booking.step] ?? "Weiter"}
                <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            ) : (
              <div style={{ width: 120 }} />
            )}
          </div>
        </div>
      )}

      {/* Booking summary drawer (floating cart) */}
      <BookingSummaryDrawer bookingData={booking} />
    </div>
  );
}
