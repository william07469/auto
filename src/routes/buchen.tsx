import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import {
  BookingState,
  ServiceId,
  PackageId,
  CustomerDetails,
} from "@/components/booking/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { PackageStep } from "@/components/booking/PackageStep";
import { AddOnStep } from "@/components/booking/AddOnStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { CustomerStep } from "@/components/booking/CustomerStep";
import { SummaryStep } from "@/components/booking/SummaryStep";
import { BookingSummaryDrawer } from "@/components/booking/BookingSummaryDrawer";
import { SERVICES_DATA, ADDONS_DATA, PACKAGES_DATA } from "@/components/booking/bookingData";
import { createBooking } from "@/functions/createBooking";
import { supabase } from "@/integrations/client";

export const Route = createFileRoute("/buchen")({
  ssr: false,
  component: BookingPage,
  head: () => ({
    meta: [
      { title: "Book an Appointment — WV Detailing" },
      {
        name: "description",
        content: "Book your premium vehicle detailing appointment with WV Detailing.",
      },
    ],
  }),
});

// ── Step config ───────────────────────────────────────────────────────────────
// 5-step flow: Service → Package → Extras → Date & Time → Summary
// Step 5 (Summary) also contains the contact form inline before confirming.

const TOTAL_STEPS = 5;

const NEXT_LABELS: Record<number, string> = {
  1: "Package",
  2: "Extras",
  3: "Date & Time",
  4: "Summary",
};

const INITIAL_STATE: BookingState = {
  step: 1,
  selectedServiceId: null,
  selectedPackageId: null,
  questionAnswers: [],
  selectedAddOnIds: [],
  selectedDate: null,
  selectedTimeSlot: null,
  customer: { fullName: "", phone: "", email: "", notes: "" },
};

// ── Component ─────────────────────────────────────────────────────────────────

function BookingPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  // Sync admin prices
  useEffect(() => {
    supabase
      .from("pricing_packages")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data?.length) return;
        data.forEach((pkg: any) => {
          const cat = (pkg.category ?? "").toLowerCase();
          const svc = SERVICES_DATA.find(
            (s) => s.id === cat || s.name.toLowerCase().includes(cat)
          );
          if (!svc) return;
          Object.values(PACKAGES_DATA)
            .flat()
            .forEach((p) => {
              if (p.id === "premium" && pkg.price > 0) p.price = pkg.price;
            });
        });
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
      questionAnswers: [],
    }));
  };

  const handleSelectPackage = (id: PackageId) => {
    setBooking((p) => ({ ...p, selectedPackageId: id }));
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
      case 1: return !!booking.selectedServiceId;
      case 2: return !!booking.selectedPackageId;
      case 3: return true;            // add-ons optional
      case 4: return !!booking.selectedDate && !!booking.selectedTimeSlot;
      case 5: return true;
      default: return false;
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
        1: "Please select a service to continue.",
        2: "Please choose a package.",
        4: "Please choose a date and a time slot.",
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
    // Validate contact details before submitting
    if (
      !booking.customer.fullName.trim() ||
      !booking.customer.phone.trim() ||
      !booking.customer.email.trim()
    ) {
      toast.error("Please fill in your name, phone and email.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/kunden-login", search: { redirect: "/buchen" } });
        return;
      }

      const service = SERVICES_DATA.find((s) => s.id === booking.selectedServiceId);
      const packages = booking.selectedServiceId
        ? PACKAGES_DATA[booking.selectedServiceId]
        : [];
      const pkg = packages.find((p) => p.id === booking.selectedPackageId);
      const addons = ADDONS_DATA.filter((a) =>
        booking.selectedAddOnIds.includes(a.id)
      );
      const basePrice = pkg?.price ?? 0;
      const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
      const estimatedPrice = basePrice + addonsTotal;

      const serviceStr = `${service?.name ?? ""}${pkg ? ` — ${pkg.name}` : ""}${
        addons.length > 0
          ? ` + [${addons.map((a) => a.name).join(", ")}]`
          : ""
      }`;

      const result = await createBooking({
        data: {
          service: serviceStr,
          vehicle: "—",
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
        toast.success("Booking confirmed! Check your email for a confirmation.");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Booking failed. Please try again.";
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
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")
            }
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
            Back
          </Link>

          {/* Logo — try SVG, fall back to text */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src="/logo.svg"
              alt="WV Detailing"
              style={{ height: 36, width: "auto" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "block";
              }}
            />
            <span
              style={{
                display: "none",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#111827",
              }}
            >
              WV Detailing
            </span>
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
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")
            }
          >
            Sign in
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
          {booking.step === 1 && (
            <ServiceStep
              selectedServiceId={booking.selectedServiceId}
              onSelectService={handleSelectService}
            />
          )}

          {booking.step === 2 && booking.selectedServiceId && (
            <PackageStep
              selectedServiceId={booking.selectedServiceId}
              selectedPackageId={booking.selectedPackageId}
              onSelectPackage={handleSelectPackage}
            />
          )}

          {booking.step === 3 && (
            <AddOnStep
              selectedAddOnIds={booking.selectedAddOnIds}
              onToggleAddOn={handleToggleAddOn}
            />
          )}

          {booking.step === 4 && (
            <DateTimeStep
              selectedDate={booking.selectedDate}
              selectedTimeSlot={booking.selectedTimeSlot}
              onSelectDate={(d) =>
                setBooking((p) => ({ ...p, selectedDate: d, selectedTimeSlot: null }))
              }
              onSelectTimeSlot={(t) =>
                setBooking((p) => ({ ...p, selectedTimeSlot: t }))
              }
            />
          )}

          {booking.step === 5 && !done && (
            <>
              {/* Contact details — inline above summary */}
              <div style={{ marginBottom: "2rem" }}>
                <CustomerStep
                  customer={booking.customer}
                  onChangeCustomer={handleChangeCustomer}
                />
              </div>

              <SummaryStep
                bookingData={booking}
                onEditStep={goToStep}
                onConfirmBooking={handleConfirmBooking}
                submitting={submitting}
                done={done}
              />
            </>
          )}

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

        {/* ── Back / Next navigation ── */}
        {!done && booking.step < TOTAL_STEPS && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #1f1f1f",
            }}
          >
            <button
              type="button"
              onClick={handleBack}
              disabled={booking.step === 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: booking.step === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)",
                background: "none",
                border: "none",
                cursor: booking.step === 1 ? "not-allowed" : "pointer",
                padding: 0,
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => {
                if (booking.step > 1)
                  (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  booking.step === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)";
              }}
            >
              <ArrowLeft style={{ width: 13, height: 13 }} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.75rem",
                borderRadius: 999,
                background: isStepValid(booking.step) ? "#111827" : "#e5e7eb",
                color: isStepValid(booking.step) ? "#fff" : "#9ca3af",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: isStepValid(booking.step) ? "pointer" : "default",
                boxShadow: isStepValid(booking.step)
                  ? "0 2px 12px rgba(0,0,0,0.12)"
                  : "none",
                transition: "all 0.2s ease",
              }}
            >
              Continue to {NEXT_LABELS[booking.step] ?? "Next"}
              <ArrowRight style={{ width: 13, height: 13, strokeWidth: 2.5 }} />
            </button>
          </div>
        )}
      </main>

      {/* ── Floating bottom drawer ── */}
      {!done && (
        <BookingSummaryDrawer
          bookingData={booking}
          onContinue={handleNext}
          canContinue={isStepValid(booking.step)}
          stepName={NEXT_LABELS[booking.step] ?? "Next"}
          currentStep={booking.step}
        />
      )}
    </div>
  );
}
