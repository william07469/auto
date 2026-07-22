import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/client";

type FaqItem = { id: string; q: string; a: string };

const fallback: FaqItem[] = [
  {
    id: "1",
    q: "Wie lange dauert eine Komplettaufbereitung?",
    a: "Je nach Fahrzeuggröße und Zustand dauert eine Komplettaufbereitung zwischen 6 und 10 Stunden. Premium-Arbeiten wie Lackkorrektur oder Keramikversiegelung können bis zu 2–3 Tage in Anspruch nehmen.",
  },
  {
    id: "2",
    q: "Bieten Sie einen Hol- und Bringservice an?",
    a: "Ja, wir bieten einen professionellen Hol- und Bringservice innerhalb von 20 km an. Zusätzliche Kosten ab 49€.",
  },
  {
    id: "3",
    q: "Welche Produkte verwenden Sie?",
    a: "Wir arbeiten ausschließlich mit Premium-Produkten von Koch-Chemie, Meguiar's, Gyeon und CarPro. Alle Produkte sind pH-neutral und schonend zu Ihrem Fahrzeug.",
  },
  {
    id: "4",
    q: "Wie lange hält eine Keramikversiegelung?",
    a: "Unsere professionellen Keramikversiegelungen halten je nach Produkt und Pflege zwischen 2 und 5 Jahre. Regelmäßige Pflege verlängert die Standzeit erheblich.",
  },
  {
    id: "5",
    q: "Kann ich mein Fahrzeug nach der Aufbereitung sofort benutzen?",
    a: "Nach einer Grundreinigung sofort. Nach einer Keramikversiegelung empfehlen wir 24–48 Stunden Wartezeit, damit die Versiegelung vollständig aushärten kann.",
  },
  {
    id: "6",
    q: "Was ist der Unterschied zwischen Politur und Versiegelung?",
    a: "Politur korrigiert den Lack — entfernt Kratzer, Swirls und Oxidation. Versiegelung schützt den Lack nach der Politur. Optimale Ergebnisse entstehen durch die Kombination beider Verfahren.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className={`rounded-xl border transition-all duration-300 ${
        open ? "border-foreground/30 bg-card" : "border-border bg-transparent hover:border-border/80"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-8 md:py-6"
      >
        <div className="flex items-center gap-4">
          <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
            0{index + 1}
          </span>
          <span className="text-base font-medium leading-snug md:text-lg">{item.q}</span>
        </div>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open ? "border-foreground bg-foreground text-background" : "border-border bg-transparent"
          }`}
        >
          {open ? <Minus className="h-3 w-3" strokeWidth={2} /> : <Plus className="h-3 w-3" strokeWidth={2} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <p className="px-6 pb-6 text-base leading-relaxed text-muted-foreground md:px-8 md:pb-8 md:pl-[4.5rem]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>(fallback);

  useEffect(() => {
    supabase
      .from("faqs")
      .select("id,question,answer")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length)
          setFaqs(data.map((d) => ({ id: d.id, q: d.question, a: d.answer })));
      });
  }, []);

  return (
    <section id="faq" className="relative bg-card py-32 md:py-48">
      <div className="container-lux grid gap-16 lg:grid-cols-[380px_1fr] xl:grid-cols-[440px_1fr]">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="text-eyebrow">06 — FAQ</p>
          <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
            Häufige
            <br />
            <span className="italic text-muted-foreground">Fragen.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Sie finden keine Antwort auf Ihre Frage? Kontaktieren Sie uns direkt —
            wir antworten innerhalb von wenigen Stunden.
          </p>
          <a
            href="#kontakt"
            className="mt-8 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Kontakt aufnehmen
            <span className="inline-block h-px w-5 bg-current" />
          </a>
        </motion.div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <FaqRow key={f.id} item={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
