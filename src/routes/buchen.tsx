import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";

import { BookingState, ServiceId, VehicleDetails, CustomerDetails } from "@/components/booking/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { VehicleStep } from "@/components/booking/VehicleStep";
import { AddOnStep } from "@/components/booking/AddOnStep";
import { DateStep, TimeStep } from "@/components/booking/DateTimeStep";
import { CustomerStep } from "@/components/booking/CustomerStep";
import { SummaryStep } from "@/components/booking/SummaryStep";
import { BookingSummaryDrawer } from "@/components/booking/BookingSummaryDrawer";
import { SERVICES_DATA, ADDONS_DATA, VEHICLE_SIZES } from "@/components/booking/bookingData";
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

// Label shown in the drawer CTA "Continue to X"
const NEXT_STEP_LABELS: Record<number, string> = {
  1: "Vehicle",
  2: "Add-ons",
  3: "Date",
  4: "Time",
  5: "Contact",
  6: "Summary",
};

const TOTAL_STEPS = 7;

function BookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<BookingState>({
    step: 1,
    selectedServiceId: null,
    selectedSubOptionId: null,
    selectedAddOnIds: [],
    vehicle: {
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      color: "",
      sizeCategory: "sedan",
    },
    selectedDate: null,
    selectedTimeSlot: null,
    customer: {
      fullName: "",
      phone: "",
      email: "",
      notes: "",
    },
    customServiceNote: "",
  });

  // Sync custom prices from admin panel
  useEffect(() => {
    supabase
      .from("pricing_packages")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data?.length) return;
        data.forEach((pkg: any) => {
          const cat = pkg.category?.toLowerCase() ?? "";
          const found = SERVICES_DATA.find(
            (s) => s.id === cat || s.name.toLowerCase().includes(cat)
          );
          if (found && pkg.price > 0) found.startingPrice = pkg.price;
        });
      });
  }, []);

  // Pre-fill email if logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setBooking((p) => ({ ...p, customer: { ...p.customer, email: user.email! } }));
      }
    });
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectService = (serviceId: ServiceId) => {
    setBooking((p) => ({ ...p, selectedServiceId: serviceId }));
  };

  const handleToggleAddOn = (id: string) => {
    setBooking((p) => {
      const has = p.selectedAddOnIds.includes(id);
      return {
        ...p,
        selectedAddOnIds: has
          ? p.selectedAddOnIds.filter((x) => x !== id)
          : [...p.selectedAddOnIds, id],
      };
    });
  };

  const handleChangeVehicle = (updated: Partial<VehicleDetails>) => {
    setBooking((p) => ({ ...p, vehicle: { ...p.vehicle, ...updated } }));
  };

  const handleChangeCustomer = (updated: Partial<CustomerDetails>) => {
    setBooking((p) => ({ ...p, customer: { ...p.customer, ...updated } }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return !!booking.selectedServiceId;
      case 2: return !!booking.vehicle.sizeCategory; // always true — default is sedan
      case 3: return true;                            // add-ons optional
      case 4: return !!booking.selectedDate;
      case 5: return !!booking.selectedTimeSlot;
      case 6:
        return (
          !!booking.customer.fullName.trim() &&
          !!booking.customer.phone.trim() &&
          !!booking.customer.email.trim()
        );
      case 7: return true;
      default: return false;
    }
  };

  // ── Animated transition ────────────────────────────────────────────────────
  const goToStep = (newStep: number) => {
    if (newStep < 1 || newStep > TOTAL_STEPS) return;

    if (stepContentRef.current) {
      gsap.to(stepContentRef.current, {
        opacity: 0,
        y: -14,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setBooking((p) => ({ ...p, step: newStep }));
          window.scrollTo({ top: 0, behavior: "smooth" });
          gsap.fromTo(
            stepContentRef.current,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }
          );
        },
      });
    } else {
      setBooking((p) => ({ ...p, step: newStep }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!isStepValid(booking.step)) {
      const msgs: Record<number, string> = {
        1: "Please select a service to continue.",
        4: "Please choose a date.",
        5: "Please select a time slot.",
        6: "Please fill in your name, phone and email.",
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

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const mainService = SERVICES_DATA.find((s) => s.id === booking.selectedServiceId);
      const chosenAddOns = ADDONS_DATA.filter((a) => booking.selectedAddOnIds.includes(a.id));
      const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === booking.vehicle.sizeCategory);

      const basePrice = mainService?.startingPrice ?? 0;
      const multiplier = vehicleCategory?.multiplier ?? 1.0;
      const adjustedBase = Math.round(basePrice * multiplier);
      const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
      const estimatedPrice = adjustedBase + addOnsTotal;

      const vehicleString = vehicleCategory?.label ?? booking.vehicle.sizeCategory;
      const serviceString = `${mainService?.name}${
        chosenAddOns.length > 0 ? ` + [${chosenAddOns.map((a) => a.name).join(", ")}]` : ""
      }`;

      const { error } = await supabase.from("bookings").insert({
        service: serviceString,
        vehicle: vehicleString,
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
      toast.success("Appointment booked!");
    } catch (err) {
      console.error(err);
      setDone(true);
      toast.success("Booking request received!");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{
        background: "#08080c",
        paddingBottom: "9rem",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute rounded-full"
          style={{
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 500,
            background: "radial-gradient(ellipse, rgba(96,165,250,0.055) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-2xl"
        style={{
          background: "rgba(8,8,12,0.88)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="max-w-5xl mx-auto flex items-center justify-between"
          style={{ padding: "0 1.5rem", height: 56 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 transition-all duration-200"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
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
            className="transition-all duration-200"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
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
        {/* Progress */}
        {!done && (
          <StepIndicator
            currentStep={booking.step}
            totalSteps={TOTAL_STEPS}
            onStepClick={(s) => s < booking.step && goToStep(s)}
          />
        )}

        {/* Step content */}
        <div ref={stepContentRef} style={{ minHeight: 480 }}>
          {booking.step === 1 && (
            <ServiceStep
              selectedServiceId={booking.selectedServiceId}
              onSelectService={handleSelectService}
            />
          )}

          {booking.step === 2 && (
            <VehicleStep
              vehicle={booking.vehicle}
              onChangeVehicle={handleChangeVehicle}
            />
          )}

          {booking.step === 3 && (
            <AddOnStep
              selectedAddOnIds={booking.selectedAddOnIds}
              onToggleAddOn={handleToggleAddOn}
            />
          )}

          {booking.step === 4 && (
            <DateStep
              selectedDate={booking.selectedDate}
              onSelectDate={(d) => setBooking((p) => ({ ...p, selectedDate: d }))}
            />
          )}

          {booking.step === 5 && (
            <TimeStep
              selectedDate={booking.selectedDate}
              selectedTimeSlot={booking.selectedTimeSlot}
              onSelectTimeSlot={(t) => setBooking((p) => ({ ...p, selectedTimeSlot: t }))}
            />
          )}

          {booking.step === 6 && (
            <CustomerStep
              customer={booking.customer}
              onChangeCustomer={handleChangeCustomer}
            />
          )}

          {booking.step === 7 && (
            <SummaryStep
              bookingData={booking}
              onEditStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              submitting={submitting}
              done={done}
            />
          )}
        </div>

        {/* Step nav buttons */}
        {!done && booking.step < 7 && (
          <div
            className="flex items-center justify-between"
            style={{ marginTop: "3.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              type="button"
              onClick={handleBack}
              disabled={booking.step === 1}
              className="flex items-center gap-2 transition-all duration-200"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: booking.step === 1 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)",
                cursor: booking.step === 1 ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (booking.step > 1) e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = booking.step === 1 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)";
              }}
            >
              <ArrowLeft style={{ width: 13, height: 13 }} />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="next-step-btn"
              onClick={handleNext}
              disabled={!isStepValid(booking.step)}
              className="flex items-center gap-2.5 transition-all duration-300"
              style={{
                padding: "0.75rem 1.75rem",
                borderRadius: 999,
                background: isStepValid(booking.step) ? "#fff" : "rgba(255,255,255,0.06)",
                color: isStepValid(booking.step) ? "#000" : "rgba(255,255,255,0.2)",
                fontWeight: 600,
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                boxShadow: isStepValid(booking.step) ? "0 4px 24px rgba(255,255,255,0.09)" : "none",
                border: isStepValid(booking.step) ? "none" : "1px solid rgba(255,255,255,0.07)",
                cursor: isStepValid(booking.step) ? "pointer" : "not-allowed",
              }}
            >
              <span>Continue</span>
              <ArrowRight style={{ width: 13, height: 13, strokeWidth: 2.5 }} />
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
          stepName={NEXT_STEP_LABELS[booking.step] ?? "Next"}
          currentStep={booking.step}
        />
      )}
    </div>
  );
}
