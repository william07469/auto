import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/client";

type Review = { id: string; author: string; role: string | null; content: string; rating: number };

const fallback: Review[] = [
  {
    id: "1",
    author: "Markus Weber",
    role: "Porsche 911 GT3",
    content: "Absolute Perfektion. Mein Fahrzeug wurde wie ein Kunstwerk behandelt. Das Ergebnis hat alle meine Erwartungen übertroffen.",
    rating: 5,
  },
  {
    id: "2",
    author: "Sabrina Klein",
    role: "Mercedes-AMG GT",
    content: "Von der Beratung bis zur Übergabe — jeder Schritt war professionell. Die Keramikversiegelung ist außergewöhnlich.",
    rating: 5,
  },
  {
    id: "3",
    author: "Thomas Richter",
    role: "BMW M4 Competition",
    content: "Nach der Lackkorrektur sieht mein Auto besser aus als am ersten Tag. Unglaubliche Handwerkskunst.",
    rating: 5,
  },
  {
    id: "4",
    author: "Julia Hoffmann",
    role: "Lamborghini Huracán",
    content: "Vertrauen ist alles, wenn es um mein Fahrzeug geht. WV Detailing hat dieses Vertrauen vollständig verdient.",
    rating: 5,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: "backOut" }}
        >
          <Star
            className={`h-3.5 w-3.5 ${i < rating ? "fill-foreground text-foreground" : "text-border"}`}
            strokeWidth={i < rating ? 0 : 1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(fallback);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id,author,role,content,rating")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length) setReviews(data as Review[]);
      });
  }, []);

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setActive(next);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((a) => (a + 1) % reviews.length);
    }, 5500);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length]);

  const prev = () => go((active - 1 + reviews.length) % reviews.length, -1);
  const next = () => go((active + 1) % reviews.length, 1);

  return (
    <section id="bewertungen" className="relative py-32 md:py-48">
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
            <p className="text-eyebrow">05 — Bewertungen</p>
            <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
              Vertrauen von
              <br />
              <span className="italic text-muted-foreground">Kennern.</span>
            </h2>
          </div>

          {/* Rating badge */}
          <motion.a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4 transition-border hover:border-foreground/30"
          >
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="mt-1 text-display text-3xl leading-none">4.9</p>
            </div>
            <div className="w-px self-stretch bg-border" />
            <div>
              <p className="text-xs font-medium">Google</p>
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">240+ Bewertungen</p>
            </div>
          </motion.a>
        </motion.div>

        {/* Carousel */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative min-h-[340px] p-10 md:p-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease }}
              >
                <Stars rating={reviews[active].rating} />

                <blockquote className="text-display mt-8 text-[clamp(1.5rem,3.5vw,2.75rem)] leading-snug">
                  "{reviews[active].content}"
                </blockquote>

                <footer className="mt-10 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold">
                    {reviews[active].author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{reviews[active].author}</p>
                      <BadgeCheck className="h-4 w-4 text-foreground" aria-label="Verifizierter Kunde" />
                    </div>
                    {reviews[active].role && (
                      <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {reviews[active].role}
                      </p>
                    )}
                  </div>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-border px-10 py-5 md:px-16">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > active ? 1 : -1)}
                  aria-label={`Bewertung ${i + 1}`}
                  className={`h-1.5 transition-all duration-400 rounded-full ${
                    i === active ? "w-6 bg-foreground" : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Vorherige Bewertung"
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Nächste Bewertung"
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
