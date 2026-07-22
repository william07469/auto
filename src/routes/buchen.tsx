import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X, Shield, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { createBooking } from "@/functions/createBooking";

export const Route = createFileRoute("/buchen")({
  ssr: false,
  component: BookingPage,
  head: () => ({
    meta: [
      { title: "Termin buchen — WV Detailing" },
      { name: "description", content: "Buchen Sie Ihren Termin für Premium Fahrzeugaufbereitung bei WV Detailing." },
      { property: "og:title", content: "Termin buchen — WV Detailing" },
      { property: "og:url", content: "/buchen" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/buchen" }],
  }),
});

const SERVICES = [
  { id: "innen", name: "Innen Detail", desc: "Tiefenreinigung des Innenraums auf höchstem Niveau", from: 129, duration: "3–5 Std.", icon: "🪑" },
  { id: "aussen", name: "Außen Detail", desc: "Handwäsche & Politur mit Premiumprodukten", from: 149, duration: "3–6 Std.", icon: "✨" },
  { id: "komplett", name: "Komplett Detail", desc: "Vollständige Innen- und Außenaufbereitung", from: 259, duration: "6–10 Std.", icon: "🏆", popular: true },
  { id: "keramik", name: "Keramikversiegelung", desc: "Nano-Keramikschutz bis zu 5 Jahre Standzeit", from: 899, duration: "1–2 Tage", icon: "🔬" },
  { id: "lackkorrektur", name: "Lackkorrektur", desc: "Kratzerentfernung & Lackpolitur durch Handarbeit", from: 349, duration: "4–8 Std.", icon: "🎨" },
  { id: "motor", name: "Motorraumreinigung", desc: "Schonende Reinigung aller Motorkomponenten", from: 79, duration: "1–2 Std.", icon: "⚙️" },
];

const VEHICLES = [
  { id: "s", name: "Kompakt", desc: "Kleinwagen · Coupé · Cabrio", factor: 1.0, example: "Golf, A-Klasse" },
  { id: "m", name: "Mittelklasse", desc: "Limousine · Kombi · Schrägheck", factor: 1.2, example: "5er, E-Klasse, Passat" },
  { id: "l", name: "SUV / Geländewagen", desc: "SUV · Crossover · Van", factor: 1.5, example: "Cayenne, GLE, X5" },
  { id: "xl", name: "XXL / Transporter", desc: "Großraumlimousine · 7-Sitzer · Sprinter", factor: 1.75, example: "V-Klasse, Sprinter" },
];

const TIMES = [
  { slot: "09:00", label: "09:00 Uhr" },
  { slot: "10:30", label: "10:30 Uhr" },
  { slot: "12:00", label: "12:00 Uhr" },
  { slot: "13:30", label: "13:30 Uhr" },
  { slot: "15:00", label: "15:00 Uhr" },
  { slot: "16:30", label: "16:30 Uhr" },
];

const STEPS = [
  { id: 0, label: "Leistung" },
  { id: 1, label: "Fahrzeug" },
  { id: 2, label: "Datum" },
  { id: 3, label: "Uhrzeit" },
  { id: 4, label: "Kontakt" },
];

const ease = [0.16, 1, 0.3, 1] as const;

type BookingData = {
  service: string;
  vehicle: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

function BookingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const [data, setData] = useState<BookingData>({
    service: "", vehicle: "", date: "", time: "",
    name: "", email: "", phone: "", notes: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate({ to: "/kunden-login", search: { redirect: "/buchen" } });
        return;
      }
      setAuthed(true);
      if (user.email) setData((d) => ({ ...d, email: user.email! }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dates = useMemo(() => {
    const arr: { key: string; d: number; m: string; w: string; wFull: string }[] = [];
    const now = new Date();
    for (let i = 1; i <= 21; i++) {
      const day = new Date(now);
      day.setDate(now.getDate() + i);
      if (day.getDay() === 0) continue; // skip Sunday
      arr.push({
        key: day.toISOString().slice(0, 10),
        d: day.getDate(),
        m: day.toLocaleDateString("de-DE", { month: "short" }),
        w: day.toLocaleDateString("de-DE", { weekday: "short" }),
        wFull: day.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }),
      });
    }
    return arr.slice(0, 14);
  }, []);

  // Show nothing while auth check is in progress (avoids hook count mismatch on SSR hydration)
  if (authed === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-border border-t-foreground animate-spin" />
      </div>
    );
  }

  const selectedService = SERVICES.find((s) => s.id === data.service);
  const selectedVehicle = VEHICLES.find((v) => v.id === data.vehicle);
  const estimatedPrice = selectedService && selectedVehicle
    ? Math.round(selectedService.from * selectedVehicle.factor)
    : selectedService?.from;

  const canNext = [
    !!data.service,
    !!data.vehicle,
    !!data.date,
    !!data.time,
    !!(data.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) && data.phone.trim()),
    true,
  ][step] ?? false;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => {
    if (step === 4) { submitBooking(); return; }
    goTo(step + 1);
  };
  const handlePrev = () => goTo(step - 1);

  const submitBooking = async () => {
    setSubmitting(true);
    try {
      await createBooking({
        data: {
          service: selectedService?.name ?? data.service,
          vehicle: selectedVehicle?.name ?? data.vehicle,
          booking_date: data.date,
          booking_time: data.time,
          customer_name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes || null,
          estimated_price: estimatedPrice ?? null,
        },
      });
      setDone(true);
    } catch (err) {
      toast.error("Fehler beim Senden: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <ConfirmScreen data={data} service={selectedService} vehicle={selectedVehicle} price={estimatedPrice} onHome={() => navigate({ to: "/" })} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav bar */}
      <div className="fixed inset-x-0 top-0 z-50 glass-nav">
        <div className="container-lux flex h-16 items-center justify-between md:h-20">
          <Link to="/" aria-label="WV Detailing — Startseite">
            <img
              src="/logo.jpeg"
              alt="WV Detailing"
              className="h-10 w-auto object-contain transition-opacity duration-300 hover:opacity-80"
            />
          </Link>
          <Link
            to="/"
            aria-label="Buchung schließen"
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all hover:border-foreground hover:bg-card"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-lux pb-32 pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-eyebrow">Termin buchen</p>
            <h1 className="text-display mt-3 text-[clamp(1.75rem,4vw,3rem)]">
              Ihr Premium-Erlebnis
              <span className="italic text-muted-foreground"> beginnt hier.</span>
            </h1>
          </motion.div>

          {/* Progress stepper */}
          <div className="mt-10 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => i < step && goTo(i)}
                    disabled={i > step}
                    aria-label={`Schritt ${i + 1}: ${s.label}`}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border text-[0.625rem] font-semibold transition-all duration-400 ${
                      i < step
                        ? "border-foreground bg-foreground text-background cursor-pointer hover:opacity-80"
                        : i === step
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
                  </button>
                  <span className={`hidden text-[0.6rem] uppercase tracking-[0.2em] sm:block transition-colors ${
                    i === step ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="relative mx-2 flex-1 h-px bg-border">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-foreground"
                      animate={{ width: i < step ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="relative mt-14 min-h-[340px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.45, ease }}
              >
                {step === 0 && <StepService data={data} setData={setData} />}
                {step === 1 && <StepVehicle data={data} setData={setData} />}
                {step === 2 && <StepDate data={data} setData={setData} dates={dates} />}
                {step === 3 && <StepTime data={data} setData={setData} />}
                {step === 4 && <StepContact data={data} setData={setData} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-8">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück
            </button>

            {estimatedPrice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden text-center sm:block"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground">Geschätzter Preis</p>
                <p className="text-display text-2xl mt-0.5">ab {estimatedPrice}€</p>
              </motion.div>
            )}

            <button
              onClick={handleNext}
              disabled={!canNext || submitting}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[0.98] active:scale-95"
            >
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background" />
                  Senden…
                </>
              ) : step === 4 ? (
                <><Check className="h-4 w-4" strokeWidth={2} /> Bestätigen</>
              ) : (
                <>Weiter <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[0.6625rem] uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SSL-gesichert</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Kostenlose Stornierung</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> 4.9 Google</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step components ─────────────────────────────────────── */

function StepService({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div>
      <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)]">Welche Leistung darf es sein?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Wählen Sie die gewünschte Aufbereitung.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const active = data.service === s.id;
          return (
            <motion.button
              key={s.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({ ...data, service: s.id })}
              className={`relative flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-foreground bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.4)]"
                  : "border-border bg-card hover:border-foreground/40"
              }`}
            >
              {s.popular && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-foreground px-3 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-background">
                  Beliebt
                </span>
              )}
              <div className="flex w-full items-start justify-between">
                <span className="text-2xl">{s.icon}</span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  active ? "border-foreground bg-foreground" : "border-border"
                }`}>
                  {active && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                </div>
              </div>
              <h3 className="mt-3 text-base font-medium">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">{s.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-display text-lg">ab {s.from}€</span>
                <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">{s.duration}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepVehicle({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div>
      <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)]">Wie groß ist Ihr Fahrzeug?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Die Größe beeinflusst den Preis und die Bearbeitungszeit.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {VEHICLES.map((v) => {
          const active = data.vehicle === v.id;
          return (
            <motion.button
              key={v.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({ ...data, vehicle: v.id })}
              className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-300 ${
                active
                  ? "border-foreground bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.4)]"
                  : "border-border bg-card hover:border-foreground/40"
              }`}
            >
              <div className="flex w-full items-start justify-between">
                <h3 className="text-base font-medium">{v.name}</h3>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  active ? "border-foreground bg-foreground" : "border-border"
                }`}>
                  {active && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
              <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">{v.example}</p>
              {active && v.factor > 1 && (
                <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.2em] text-foreground">
                  +{Math.round((v.factor - 1) * 100)}% Aufpreis
                </p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepDate({ data, setData, dates }: { data: BookingData; setData: (d: BookingData) => void; dates: { key: string; d: number; m: string; w: string; wFull: string }[] }) {
  return (
    <div>
      <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)]">Wählen Sie einen Termin.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Verfügbare Tage in den nächsten 3 Wochen.</p>
      <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-7 md:gap-3">
        {dates.map((d) => {
          const active = data.date === d.key;
          return (
            <motion.button
              key={d.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setData({ ...data, date: d.key })}
              className={`flex flex-col items-center rounded-xl border py-4 transition-all duration-300 ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:border-foreground/50"
              }`}
            >
              <span className={`text-[0.6rem] uppercase tracking-[0.2em] ${active ? "opacity-70" : "text-muted-foreground"}`}>{d.w}</span>
              <span className={`text-display mt-1.5 text-2xl`}>{d.d}</span>
              <span className={`text-[0.6rem] uppercase tracking-[0.2em] ${active ? "opacity-70" : "text-muted-foreground"}`}>{d.m}</span>
            </motion.button>
          );
        })}
      </div>
      {data.date && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-sm text-muted-foreground"
        >
          Ausgewählt: <span className="font-medium text-foreground">{dates.find((d) => d.key === data.date)?.wFull}</span>
        </motion.p>
      )}
    </div>
  );
}

function StepTime({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div>
      <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)]">Wählen Sie eine Uhrzeit.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Alle Zeitfenster sind für Ihr gewähltes Datum verfügbar.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TIMES.map((t) => {
          const active = data.time === t.slot;
          return (
            <motion.button
              key={t.slot}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setData({ ...data, time: t.slot })}
              className={`flex flex-col items-center rounded-xl border py-6 transition-all duration-300 ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:border-foreground/50"
              }`}
            >
              <span className="text-display text-3xl">{t.slot}</span>
              <span className={`mt-1.5 text-[0.6rem] uppercase tracking-[0.25em] ${active ? "opacity-70" : "text-muted-foreground"}`}>
                Uhr
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div>
      <h2 className="text-display text-[clamp(1.5rem,3vw,2.5rem)]">Ihre Kontaktdaten.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Wir kontaktieren Sie zur Terminbestätigung innerhalb von 24 Stunden.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ContactField label="Name *" value={data.name} onChange={(v) => setData({ ...data, name: v })} placeholder="Vorname Nachname" />
        <ContactField label="Telefon *" type="tel" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} placeholder="+49 170 0000000" />
        <div className="sm:col-span-2">
          <ContactField label="E-Mail *" type="email" value={data.email} onChange={(v) => setData({ ...data, email: v })} placeholder="ihre@email.de" />
        </div>
        <div className="sm:col-span-2">
          <ContactField label="Anmerkungen (optional)" value={data.notes} onChange={(v) => setData({ ...data, notes: v })} textarea placeholder="Besonderheiten zu Ihrem Fahrzeug, Wünsche oder Fragen…" />
        </div>
      </div>
    </div>
  );
}

function ContactField({
  label, value, onChange, type = "text", textarea, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; textarea?: boolean; placeholder?: string;
}) {
  const base = "w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-foreground/60 focus:bg-muted";
  return (
    <label className="block">
      <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />
      )}
    </label>
  );
}

/* ─── Confirmation screen ─────────────────────────────────── */

function ConfirmScreen({
  data, service, vehicle, price, onHome,
}: {
  data: BookingData;
  service: (typeof SERVICES)[0] | undefined;
  vehicle: (typeof VEHICLES)[0] | undefined;
  price: number | undefined;
  onHome: () => void;
}) {
  const dateLabel = new Date(data.date + "T12:00:00").toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Check animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-foreground/30 bg-card shadow-[0_0_60px_rgba(255,255,255,0.06)]"
        >
          <Check className="h-10 w-10" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <p className="text-eyebrow">Buchungsanfrage erhalten</p>
          <h1 className="text-display mt-4 text-[clamp(2.5rem,6vw,5rem)]">
            Vielen Dank,<br />
            <span className="italic text-muted-foreground">{data.name.split(" ")[0]}.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Ihre Anfrage wurde erfolgreich übermittelt. Wir bestätigen Ihren Termin
            innerhalb von 24 Stunden per E-Mail und Telefon.
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="mt-10 rounded-2xl border border-border bg-card p-8 text-left"
        >
          <p className="text-eyebrow mb-6">Ihre Zusammenfassung</p>
          <dl className="divide-y divide-border/60">
            {[
              { label: "Leistung", value: service?.name ?? data.service },
              { label: "Fahrzeug", value: vehicle?.name ?? data.vehicle },
              { label: "Datum", value: dateLabel },
              { label: "Uhrzeit", value: data.time + " Uhr" },
              { label: "Name", value: data.name },
              { label: "E-Mail", value: data.email },
              { label: "Telefon", value: data.phone },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
                <dd className="font-medium text-right max-w-[60%]">{value}</dd>
              </div>
            ))}
            {price && (
              <div className="flex items-center justify-between pt-5">
                <dt className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">Geschätzter Preis</dt>
                <dd className="text-display text-2xl">ab {price}€</dd>
              </div>
            )}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <button
            onClick={onHome}
            className="btn-primary justify-center hover:opacity-90 hover:scale-[0.98]"
          >
            Zur Startseite
          </button>
          <a
            href="https://wa.me/491778452138"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary justify-center hover:border-foreground hover:bg-foreground/5"
          >
            WhatsApp schreiben
          </a>
        </motion.div>
      </div>
    </div>
  );
}
