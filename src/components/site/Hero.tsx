import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-24 md:items-center md:pb-0">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0"
      >
        <img
          src={heroImg}
          alt="WV Detailing — Premium Fahrzeugaufbereitung"
          className="h-full w-full object-cover"
          fetchPriority="high"
          width={1920}
          height={1200}
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/30 to-transparent" />
      </motion.div>

      {/* Noise texture overlay for depth */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="container-lux relative z-10 pt-32 md:pt-0">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="h-px w-8 bg-muted-foreground" />
          <p className="text-eyebrow">Premium Fahrzeugaufbereitung · Deutschland</p>
        </motion.div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease }}
            className="text-display max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] leading-[0.9]"
          >
            Perfektion bis ins kleinste
            <span className="italic text-muted-foreground"> Detail.</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease }}
          className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Handwerk, Präzision und Materialien auf höchstem Niveau —
          für Fahrzeuge, die das Beste verdienen.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/buchen"
            className="btn-primary hover:opacity-90 hover:scale-[0.98] active:scale-95 shadow-[0_8px_40px_rgba(255,255,255,0.08)]"
          >
            Termin buchen
          </Link>
          <a
            href="#leistungen"
            className="btn-secondary hover:border-foreground hover:bg-foreground/5"
          >
            Leistungen ansehen
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.45, ease }}
          className="mt-14 flex flex-wrap items-center gap-6 md:gap-10"
        >
          {[
            { value: "500+", label: "Zufriedene Kunden" },
            { value: "4.9★", label: "Google Bewertung" },
            { value: "10+", label: "Jahre Erfahrung" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="text-display text-2xl">{b.value}</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground leading-tight max-w-[6rem]">{b.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#leistungen"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        aria-label="Nach unten scrollen"
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <motion.div
            className="absolute left-0 top-0 h-full w-full bg-foreground origin-top"
            animate={{ scaleY: [0, 1, 1], y: ["0%", "0%", "100%"], opacity: [1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          />
        </div>
      </motion.a>
    </section>
  );
}
