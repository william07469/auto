import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/client";

type Plan = {
  name: string;
  tier: string;
  price: { basic: number; deluxe: number };
  duration: string;
  popular?: boolean;
  features: { basic: string[]; deluxe: string[] };
};

// Static fallback — shown while DB loads or if DB has no active packages
const FALLBACK_PLANS: Plan[] = [
  {
    name: "Innen Detail",
    tier: "Interieur",
    price: { basic: 129, deluxe: 189 },
    duration: "3 – 5 Std.",
    features: {
      basic: [
        "Gründliche Innenreinigung",
        "Staubsaugen aller Bereiche",
        "Kunststoff- & Lederpflege",
        "Fensterreinigung innen",
      ],
      deluxe: [
        "Alle Basic-Leistungen",
        "Tiefenreinigung der Polster",
        "Premium Lederkonservierung",
        "Ozon-Geruchsneutralisation",
        "Fußmatten-Shampoonierung",
      ],
    },
  },
  {
    name: "Außen Detail",
    tier: "Exterieur",
    price: { basic: 149, deluxe: 249 },
    duration: "3 – 6 Std.",
    features: {
      basic: [
        "Handwäsche 2-Eimer-Methode",
        "Felgenreinigung",
        "Reifenpflege",
        "Trocknung mit Mikrofaser",
      ],
      deluxe: [
        "Alle Basic-Leistungen",
        "Insektenentfernung",
        "Premium Sprühversiegelung",
        "Hartwachs-Politur",
        "Chromteile poliert",
      ],
    },
  },
  {
    name: "Komplett Detail",
    tier: "Innen + Außen",
    price: { basic: 259, deluxe: 429 },
    duration: "6 – 10 Std.",
    popular: true,
    features: {
      basic: [
        "Innen- und Außenreinigung",
        "Komplette Handwäsche",
        "Innenraumaufbereitung",
        "Grundpolitur",
      ],
      deluxe: [
        "Premium Komplettpaket",
        "Lackpolitur mit Enthology",
        "Keramische Sprühversiegelung",
        "Premium Lederkonservierung",
        "Motorraumreinigung",
      ],
    },
  },
];

type DbPackage = {
  id: string;
  name: string;
  tier: string;
  category: string;
  price: number;
  description: string | null;
  features: string[];
  sort_order: number;
  is_active: boolean;
};

/**
 * Groups flat DB rows (one per name+tier) into Plan cards.
 * Each unique `category` becomes one card; its `basic` and `deluxe`
 * rows supply the respective price and feature lists.
 * The card name comes from the basic row (or deluxe if no basic exists).
 * A card is marked popular when its category contains "komplett" (case-insensitive).
 */
function buildPlans(rows: DbPackage[]): Plan[] {
  // Preserve category insertion order via a Map
  const byCategory = new Map<string, { basic?: DbPackage; deluxe?: DbPackage; sort: number }>();

  for (const row of rows) {
    const key = row.category;
    if (!byCategory.has(key)) {
      byCategory.set(key, { sort: row.sort_order });
    }
    const entry = byCategory.get(key)!;
    if (row.tier === "basic") entry.basic = row;
    else if (row.tier === "deluxe") entry.deluxe = row;
    // Keep the lowest sort_order for ordering cards
    if (row.sort_order < entry.sort) entry.sort = row.sort_order;
  }

  return Array.from(byCategory.entries())
    .sort((a, b) => a[1].sort - b[1].sort)
    .map(([category, { basic, deluxe }]): Plan => {
      const canonical = basic ?? deluxe!;
      return {
        name: canonical.name,
        tier: category,
        price: {
          basic: basic?.price ?? deluxe?.price ?? 0,
          deluxe: deluxe?.price ?? basic?.price ?? 0,
        },
        duration: canonical.description ?? "",
        popular: /komplett/i.test(category),
        features: {
          basic: basic?.features ?? [],
          deluxe: deluxe?.features ?? [],
        },
      };
    });
}

const ease = [0.16, 1, 0.3, 1] as const;

export function Pricing() {
  const [mode, setMode] = useState<"basic" | "deluxe">("deluxe");
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);

  useEffect(() => {
    supabase
      .from("pricing_packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const built = buildPlans(data as DbPackage[]);
        if (built.length > 0) setPlans(built);
      });
  }, []);

  return (
    <section id="preise" className="relative py-32 md:py-48">
      <div className="container-lux">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <p className="text-eyebrow">02 — Preisliste</p>
            <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
              Transparent.
              <br />
              <span className="italic text-muted-foreground">Fair kalkuliert.</span>
            </h2>
          </div>

          {/* Toggle */}
          <div className="relative inline-flex rounded-full border border-border bg-card p-1">
            {(["basic", "deluxe"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`relative z-10 rounded-full px-6 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  mode === k ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === k && (
                  <motion.span
                    layoutId="pricing-mode-bg"
                    className="absolute inset-0 -z-10 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {k === "basic" ? "Basis" : "Deluxe"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease }}
              className={`group relative flex flex-col rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-2 md:p-10 ${
                p.popular
                  ? "border-foreground/60 bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.5)]"
                  : "border-border bg-card hover:border-foreground/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
              }`}
            >
              {/* Popular badge */}
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1">
                    <Star className="h-3 w-3 fill-background text-background" />
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-background">
                      Beliebteste Wahl
                    </span>
                  </div>
                </div>
              )}

              <p className="text-eyebrow">{p.tier}</p>
              <h3 className="text-display mt-3 text-3xl">{p.name}</h3>

              {/* Price */}
              <div className="mt-8 flex items-end gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${p.name}-${mode}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-display text-5xl"
                  >
                    {p.price[mode]}€
                  </motion.span>
                </AnimatePresence>
                <span className="mb-1 text-[0.625rem] uppercase tracking-[0.25em] text-muted-foreground">
                  ab
                </span>
              </div>

              {p.duration && (
                <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {p.duration}
                </p>
              )}

              <div className="my-8 h-px w-full bg-border" />

              <ul className="flex-1 space-y-3.5">
                {p.features[mode].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                      <Check className="h-2.5 w-2.5 text-foreground" strokeWidth={2.5} />
                    </span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/buchen"
                className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                  p.popular
                    ? "bg-foreground text-background hover:opacity-90 hover:scale-[0.98]"
                    : "border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                Jetzt buchen
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-10 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Preise variieren je nach Fahrzeuggröße und Zustand · Individuelles Angebot auf Anfrage
        </motion.p>
      </div>
    </section>
  );
}
