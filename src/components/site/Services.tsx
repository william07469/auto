import { motion } from "motion/react";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Palette,
  Wrench,
  Wind,
  CircleDot,
  Layers,
  Zap,
  Eye,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const services = [
  {
    icon: Layers,
    title: "Innenreinigung",
    desc: "Tiefenreinigung von Leder, Stoff, Kunststoff und Alcantara. Handarbeit auf höchstem Niveau.",
    num: "01",
  },
  {
    icon: Droplets,
    title: "Außenreinigung",
    desc: "Handwäsche nach dem Zwei-Eimer-Prinzip mit pH-neutralen Premiumprodukten.",
    num: "02",
  },
  {
    icon: Sparkles,
    title: "Komplettaufbereitung",
    desc: "Innen und außen — vollständige Aufwertung Ihres Fahrzeugs auf Showroom-Niveau.",
    num: "03",
  },
  {
    icon: ShieldCheck,
    title: "Keramikversiegelung",
    desc: "Nano-Keramikschutz mit bis zu 5 Jahren Standzeit. Hydrophob, kratzfest, glänzend.",
    num: "04",
  },
  {
    icon: Palette,
    title: "Lackkorrektur",
    desc: "Politur, Kratzerentfernung und Farbauffrischung. Handarbeit mit Profimaschinen.",
    num: "05",
  },
  {
    icon: Wrench,
    title: "Motorraumreinigung",
    desc: "Schonende Reinigung und Konservierung aller sensiblen Motorkomponenten.",
    num: "06",
  },
  {
    icon: Wind,
    title: "Geruchsentfernung",
    desc: "Ozonbehandlung für dauerhaft frische Luft. Wirkungsvoll bei Rauch, Tier und Schimmel.",
    num: "07",
  },
  {
    icon: CircleDot,
    title: "Felgenversiegelung",
    desc: "Keramischer Schutz gegen Bremsstaub, Korrosion und Umwelteinflüsse.",
    num: "08",
  },
  {
    icon: Eye,
    title: "Scheinwerferaufbereitung",
    desc: "Professionelle Politur trüber Scheinwerfer für optimale Sicht und Optik.",
    num: "09",
  },
  {
    icon: Zap,
    title: "Lackversiegelung",
    desc: "Premium Hartwachsversiegelung für langanhaltenden Glanz und Schutz.",
    num: "10",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Services() {
  return (
    <section id="leistungen" className="relative py-32 md:py-48">
      <div className="container-lux">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-eyebrow">01 — Leistungen</p>
          <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
            Handwerk auf
            <br />
            <span className="italic text-muted-foreground">höchstem Niveau.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Zehn Leistungen. Ein Anspruch. Jedes Detail wird von Hand ausgeführt —
            mit Materialien, denen wir vertrauen.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.title}
                variants={cardVariants}
                className="luxury-card group relative flex flex-col justify-between overflow-hidden p-8 hover:border-foreground/30 hover:-translate-y-1.5 hover:glow-sm md:p-9 lg:min-h-[300px]"
              >
                {/* Number */}
                <span className="absolute top-6 right-6 text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground/40 transition-opacity duration-500 group-hover:opacity-0">
                  {s.num}
                </span>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted transition-all duration-500 group-hover:border-foreground/30 group-hover:bg-card">
                  <Icon className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:text-foreground group-hover:scale-110" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="mt-auto pt-10">
                  <h3 className="text-base font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-5 h-px w-6 bg-foreground/30 transition-all duration-500 group-hover:w-12 group-hover:bg-foreground" />
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 flex justify-center"
        >
          <Link
            to="/buchen"
            className="btn-secondary hover:border-foreground hover:bg-foreground/5"
          >
            Beratung anfragen
            <span className="inline-block h-px w-5 bg-current" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
