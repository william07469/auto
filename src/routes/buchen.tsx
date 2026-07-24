import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import { BookingState, ServiceId, PackageId, QuestionAnswer, CustomerDetails } from "@/components/booking/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { PackageStep } from "@/components/booking/PackageStep";
import { ServiceQuestionsStep } from "@/components/booking/ServiceQuestionsStep";
import { AddOnStep } from "@/components/booking/AddOnStep";
import { DateStep, TimeStep } from "@/components/booking/DateTimeStep";
import { CustomerStep } from "@/components/booking/CustomerStep";
import { SummaryStep } from "@/components/booking/SummaryStep";
import { BookingSummaryDrawer } from "@/components/booking/BookingSummaryDrawer";
import { SERVICES_DATA, ADDONS_DATA, PACKAGES_DATA } from "@/components/booking/bookingData";
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

const NEXT_LABELS: Record<number, string> = {
  1: "Package",
  2: "Questions",
  3: "Add-ons",
  4: "Date",
  5: "Time",
  6: "Contact",
  7: "Summary",
};

const TOTAL_STEPS = 8;

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

function BookingPage() {
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
          const svc = SERVICES_DATA.find((s) => s.id === cat || s.name.toLowerCase().includes(cat));
          if (!svc) return;
          // Update matching package price in PACKAGES_DATA
          Object.values(PACKAGES_DATA).flat().forEach((p) => {
            if (p.id === "premium" && pkg.price > 0) p.price = pkg.price;
          });
        });
      });
  }, []);

  // Pre-fill email
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setBooking((p) => ({ ...p, customer: { ...p.customer, email: user.email! } }));
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

  const handleAnswer = (questionId: string, answerId: string) => {
    setBooking((p) => {
      const filtered = p.questionAnswers.filter((a) => a.questionId !== questionId);
      return { ...p, questionAnswers: [...filtered, { questionId, answerId }] };
    });
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
      case 3: return true; // questions optional
      case 4: return true; // add-ons optional
      case 5: return !!booking.selectedDate;
      case 6: return !!booking.selectedTimeSlot;
      case 7:
        return (
          !!booking.customer.fullName.trim() &&
          !!booking.customer.phone.trim() &&
          !!booking.customer.email.trim()
        );
      case 8: return true;
      default: return false;
    }
  };

  // ── Animated step transition ──────────────────────────────────────────────

  const goToStep = (next: number) => {
    if (next < 1 || next > TOTAL_STEPS) return;
    if (stepRef.current) {
      gsap.to(stepRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setBooking((p) => ({ ...p, step: next }));
          window.scrollTo({ top: 0, behavior: "smooth" });
          gsap.fromTo(
            stepRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }
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
        5: "Please choose a date.",
        6: "Please select a time slot.",
        7: "Please fill in your name, phone and email.",
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
    setSubmitting(true);
    try {
      const service = SERVICES_DATA.find((s) => s.id === booking.selectedServiceId);
      const packages = booking.selectedServiceId ? PACKAGES_DATA[booking.selectedServiceId] : [];
      const pkg = packages.find((p) => p.id === booking.selectedPackageId);
      const addons = ADDONS_DATA.filter((a) => booking.selectedAddOnIds.includes(a.id));
      const basePrice = pkg?.price ?? 0;
      const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
      const estimatedPrice = basePrice + addonsTotal;

      const serviceStr = `${service?.name ?? ""}${pkg ? ` — ${pkg.name}` : ""}${
        addons.length > 0 ? ` + [${addons.map((a) => a.name).join(", ")}]` : ""
      }`;

      const { error } = await supabase.from("bookings").insert({
        service: serviceStr,
        vehicle: "—",
        booking_date: booking.selectedDate ?? "",
        booking_time: booking.selectedTimeSlot ?? "",
        customer_name: booking.customer.fullName,
        email: booking.customer.email,
        phone: booking.customer.phone,
        notes: booking.customer.notes || null,
        estimated_price: estimatedPrice,
      });

      if (error) console.warn("Supabase notice:", error.message);
      setDone(true);
      toast.success("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setDone(true);
      toast.success("Booking request received!");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080c",
        color: "#fff",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        WebkitFontSmoothing: "antialiased",
        paddingBottom: "9rem",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 450,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(8,8,12,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div
          className="max-w-5xl mx-auto flex items-center justify-between"
          style={{ padding: "0 1.5rem", height: 56 }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "rgba(255,255,255,0.28)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
          >
            <ArrowLeft style={{ width: 12, height: 12 }} />
            <span>Back</span>
          </Link>

          <Link to="/">
            <img
              src="/logo.jpeg"
              alt="WV Detailing"
              style={{ height: 28, width: "auto", objectFit: "contain", opacity: 0.75 }}
            />
          </Link>

          <Link
            to="/auth"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "rgba(255,255,255,0.28)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main */}
      <main
        className="relative z-10 max-w-5xl mx-auto"
        style={{ padding: "3rem 1.5rem 0" }}
      >
        {/* Progress indicator */}
        {!done && (
          <StepIndicator
            currentStep={booking.step}
            totalSteps={TOTAL_STEPS}
            onStepClick={(s) => s < booking.step && goToStep(s)}
          />
        )}

        {/* Step content */}
        <div ref={stepRef} style={{ minHeight: 500 }}>
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

          {booking.step === 3 && booking.selectedServiceId && (
            <ServiceQuestionsStep
              selectedServiceId={booking.selectedServiceId}
              answers={booking.questionAnswers}
              onAnswer={handleAnswer}
            />
          )}

          {booking.step === 4 && (
            <AddOnStep
              selectedAddOnIds={booking.selectedAddOnIds}
              onToggleAddOn={handleToggleAddOn}
            />
          )}

          {booking.step === 5 && (
            <DateStep
              selectedDate={booking.selectedDate}
              onSelectDate={(d) => setBooking((p) => ({ ...p, selectedDate: d }))}
            />
          )}

          {booking.step === 6 && (
            <TimeStep
              selectedDate={booking.selectedDate}
              selectedTimeSlot={booking.selectedTimeSlot}
              onSelectTimeSlot={(t) => setBooking((p) => ({ ...p, selectedTimeSlot: t }))}
            />
          )}

          {booking.step === 7 && (
            <CustomerStep
              customer={booking.customer}
              onChangeCustomer={handleChangeCustomer}
            />
          )}

          {booking.step === 8 && (
            <SummaryStep
              bookingData={booking}
              onEditStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              submitting={submitting}
              done={done}
            />
          )}
        </div>

        {/* Back / Continue nav */}
        {!done && booking.step < 8 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "3.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
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
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: booking.step === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.32)",
                background: "none",
                border: "none",
                cursor: booking.step === 1 ? "not-allowed" : "pointer",
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { if (booking.step > 1) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = booking.step === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.32)"; }}
            >
              <ArrowLeft style={{ width: 12, height: 12 }} />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="next-step-btn"
              onClick={handleNext}
              disabled={!isStepValid(booking.step)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.75rem",
                borderRadius: 999,
                background: isStepValid(booking.step) ? "#fff" : "rgba(255,255,255,0.05)",
                color: isStepValid(booking.step) ? "#000" : "rgba(255,255,255,0.18)",
                fontWeight: 700,
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                border: isStepValid(booking.step) ? "none" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isStepValid(booking.step) ? "0 4px 24px rgba(255,255,255,0.09)" : "none",
                cursor: isStepValid(booking.step) ? "pointer" : "not-allowed",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => { if (isStepValid(booking.step)) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={(e) => { if (isStepValid(booking.step)) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            >
              <span>Continue</span>
              <ArrowRight style={{ width: 12, height: 12, strokeWidth: 2.5 }} />
            </button>
          </div>
        )}
      </main>

      {/* Floating drawer */}
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
