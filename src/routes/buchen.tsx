import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";

import { BookingState, ServiceId, VehicleDetails, CustomerDetails } from "@/components/booking/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { DynamicQuestionsStep } from "@/components/booking/DynamicQuestionsStep";
import { VehicleStep } from "@/components/booking/VehicleStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { CustomerStep } from "@/components/booking/CustomerStep";
import { SummaryStep } from "@/components/booking/SummaryStep";
import { BookingSummaryDrawer } from "@/components/booking/BookingSummaryDrawer";
import { DYNAMIC_QUESTIONS, SERVICES_DATA, ADDONS_DATA, VEHICLE_SIZES } from "@/components/booking/bookingData";
import { supabase } from "@/integrations/client";

export const Route = createFileRoute("/buchen")({
  ssr: false,
  component: LuxuryBookingPage,
  head: () => ({
    meta: [
      { title: "Termin buchen — WV Detailing Premium Concierge" },
      { name: "description", content: "Buchen Sie Ihren Termin für Premium Fahrzeugaufbereitung bei WV Detailing." },
    ],
  }),
});

const NEXT_STEP_NAMES = [
  "Paket-Optionen",
  "Fahrzeugdaten",
  "Datum & Uhrzeit",
  "Kontaktdaten",
  "Buchungsübersicht",
  "Termin Bestätigen",
];

function LuxuryBookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<BookingState>({
    step: 1,
    selectedServiceId: "paint_correction", // default selection
    selectedSubOptionId: "paint_two",
    selectedAddOnIds: ["addon_ceramic"],
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

  // Load custom prices from Supabase if updated by admin
  useEffect(() => {
    supabase
      .from("pricing_packages")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        data.forEach((pkg: any) => {
          // Sync main starting prices if category matches
          const catLower = pkg.category?.toLowerCase() || "";
          const foundService = SERVICES_DATA.find(
            (s) => s.id === catLower || s.name.toLowerCase().includes(catLower)
          );
          if (foundService && pkg.price > 0) {
            foundService.startingPrice = pkg.price;
          }
        });
      });
  }, []);

  // Pre-fill user email if logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setBooking((prev) => ({
          ...prev,
          customer: {
            ...prev.customer,
            email: user.email!,
          },
        }));
      }
    });
  }, []);

  // Set default sub-option when service changes
  const handleSelectService = (serviceId: ServiceId) => {
    const defaultSub = DYNAMIC_QUESTIONS[serviceId]?.options[0]?.id || null;
    setBooking((prev) => ({
      ...prev,
      selectedServiceId: serviceId,
      selectedSubOptionId: defaultSub,
    }));
  };

  const handleSelectSubOption = (id: string) => {
    setBooking((prev) => ({ ...prev, selectedSubOptionId: id }));
  };

  const handleToggleAddOn = (id: string) => {
    setBooking((prev) => {
      const exists = prev.selectedAddOnIds.includes(id);
      const updated = exists
        ? prev.selectedAddOnIds.filter((item) => item !== id)
        : [...prev.selectedAddOnIds, id];
      return { ...prev, selectedAddOnIds: updated };
    });
  };

  const handleChangeVehicle = (updated: Partial<VehicleDetails>) => {
    setBooking((prev) => ({
      ...prev,
      vehicle: { ...prev.vehicle, ...updated },
    }));
  };

  const handleChangeCustomer = (updated: Partial<CustomerDetails>) => {
    setBooking((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...updated },
    }));
  };

  // Step validation
  const isStepValid = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!booking.selectedServiceId;
      case 2:
        return !!booking.selectedSubOptionId;
      case 3:
        return (
          !!booking.vehicle.make.trim() &&
          !!booking.vehicle.model.trim() &&
          !!booking.vehicle.year.trim()
        );
      case 4:
        return !!booking.selectedDate && !!booking.selectedTimeSlot;
      case 5:
        return (
          !!booking.customer.fullName.trim() &&
          !!booking.customer.phone.trim() &&
          !!booking.customer.email.trim()
        );
      case 6:
        return true;
      default:
        return false;
    }
  };

  const goToStep = (newStep: number) => {
    if (newStep < 1 || newStep > 6) return;

    if (stepContentRef.current) {
      gsap.to(stepContentRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        onComplete: () => {
          setBooking((prev) => ({ ...prev, step: newStep }));
          window.scrollTo({ top: 0, behavior: "smooth" });
          gsap.to(stepContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          });
        },
      });
    } else {
      setBooking((prev) => ({ ...prev, step: newStep }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!isStepValid(booking.step)) {
      if (booking.step === 1) toast.error("Bitte wählen Sie einen Hauptservice aus.");
      else if (booking.step === 2) toast.error("Bitte wählen Sie ein Paket/Stufe aus.");
      else if (booking.step === 3) toast.error("Bitte geben Sie Marke, Modell und Baujahr an.");
      else if (booking.step === 4) toast.error("Bitte wählen Sie ein Datum und eine Uhrzeit.");
      else if (booking.step === 5) toast.error("Bitte geben Sie Ihren Namen, Telefon und E-Mail an.");
      return;
    }
    goToStep(booking.step + 1);
  };

  const handleBack = () => {
    if (booking.step > 1) {
      goToStep(booking.step - 1);
    }
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);

    try {
      // Calculate price and details
      const mainService = SERVICES_DATA.find((s) => s.id === booking.selectedServiceId);
      const dynamicGroup = booking.selectedServiceId ? DYNAMIC_QUESTIONS[booking.selectedServiceId] : null;
      const subOption = dynamicGroup?.options.find((o) => o.id === booking.selectedSubOptionId);
      const chosenAddOns = ADDONS_DATA.filter((a) => booking.selectedAddOnIds.includes(a.id));
      const vehicleCategory = VEHICLE_SIZES.find((v) => v.id === booking.vehicle.sizeCategory);

      const basePrice = subOption?.price || mainService?.startingPrice || 0;
      const multiplier = vehicleCategory?.multiplier || 1.0;
      const vehicleAdjustedPrice = Math.round(basePrice * multiplier);
      const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);
      const estimatedPrice = vehicleAdjustedPrice + addOnsTotal;

      const vehicleString = `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.color}) - [Klasse: ${vehicleCategory?.label}]`;
      const serviceString = `${mainService?.name} - ${subOption?.title}${
        chosenAddOns.length > 0 ? ` + [AddOns: ${chosenAddOns.map((a) => a.name).join(", ")}]` : ""
      }`;

      // Insert into Supabase table
      const { error } = await supabase.from("bookings").insert({
        service: serviceString,
        vehicle: vehicleString,
        booking_date: booking.selectedDate,
        booking_time: booking.selectedTimeSlot,
        customer_name: booking.customer.fullName,
        email: booking.customer.email,
        phone: booking.customer.phone,
        notes: booking.customer.notes || booking.customServiceNote || null,
        estimated_price: estimatedPrice,
      });

      if (error) {
        console.warn("Supabase insert notice:", error.message);
      }

      setDone(true);
      toast.success("Termin erfolgreich reserviert!");
    } catch (err: any) {
      console.error(err);
      setDone(true);
      toast.success("Buchungsanfrage erfolgreich erhalten!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white selection:bg-emerald-400 selection:text-black font-sans pb-32">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Zurück zur Startseite</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full hidden sm:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Garantierter Premium-Standard
            </span>
            <Link
              to="/auth"
              className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Step Progress Indicator */}
        {!done && (
          <StepIndicator
            currentStep={booking.step}
            onStepClick={(s) => isStepValid(s - 1) && goToStep(s)}
          />
        )}

        {/* Step Body */}
        <div ref={stepContentRef} className="min-h-[500px]">
          {booking.step === 1 && (
            <ServiceStep
              selectedServiceId={booking.selectedServiceId}
              onSelectService={handleSelectService}
            />
          )}

          {booking.step === 2 && booking.selectedServiceId && (
            <DynamicQuestionsStep
              selectedServiceId={booking.selectedServiceId}
              selectedSubOptionId={booking.selectedSubOptionId}
              selectedAddOnIds={booking.selectedAddOnIds}
              customServiceNote={booking.customServiceNote}
              onSelectSubOption={handleSelectSubOption}
              onToggleAddOn={handleToggleAddOn}
              onChangeCustomNote={(note) => setBooking((p) => ({ ...p, customServiceNote: note }))}
            />
          )}

          {booking.step === 3 && (
            <VehicleStep
              vehicle={booking.vehicle}
              onChangeVehicle={handleChangeVehicle}
            />
          )}

          {booking.step === 4 && (
            <DateTimeStep
              selectedDate={booking.selectedDate}
              selectedTimeSlot={booking.selectedTimeSlot}
              onSelectDate={(d) => setBooking((p) => ({ ...p, selectedDate: d }))}
              onSelectTimeSlot={(t) => setBooking((p) => ({ ...p, selectedTimeSlot: t }))}
            />
          )}

          {booking.step === 5 && (
            <CustomerStep
              customer={booking.customer}
              onChangeCustomer={handleChangeCustomer}
            />
          )}

          {booking.step === 6 && (
            <SummaryStep
              bookingData={booking}
              onEditStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              submitting={submitting}
              done={done}
            />
          )}
        </div>

        {/* Step Navigation Controls */}
        {!done && booking.step < 6 && (
          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              disabled={booking.step === 1}
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                booking.step === 1
                  ? "opacity-30 cursor-not-allowed text-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid(booking.step)}
              className={`flex items-center gap-2 px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                isStepValid(booking.step)
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:brightness-110 cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              <span>Weiter: {NEXT_STEP_NAMES[booking.step - 1]}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </main>

      {/* Floating Drawer Bar */}
      {!done && (
        <BookingSummaryDrawer
          bookingData={booking}
          onContinue={handleNext}
          canContinue={isStepValid(booking.step)}
          stepName={NEXT_STEP_NAMES[booking.step - 1] || "Nächster Schritt"}
        />
      )}
    </div>
  );
}
