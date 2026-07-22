import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

const extras = [
  { title: "Cabrioverdeck Aufbereitung", desc: "Reinigung, Imprägnierung und Auffrischung des Verdecks.", price: "ab 89€" },
  { title: "Tiefenreinigung Sitze", desc: "Nass-Trocken-Extraktion für Stoff- und Kindersitze.", price: "ab 49€" },
  { title: "Kunstlederauffrischung", desc: "Farbauffrischung matter oder ausgeblichener Kunststoffe.", price: "ab 39€" },
  { title: "Innenraumversiegelung", desc: "Langzeitschutz für Leder und Kunststoffe mit Nano-Coating.", price: "ab 149€" },
  { title: "Scheibentönungspflege", desc: "Fachgerechte Pflege und Konservierung getönter Scheiben.", price: "ab 29€" },
  { title: "Motorwäsche & Konservierung", desc: "Schonende Reinigung und Konservierung aller Komponenten.", price: "ab 79€" },
  { title: "Alcantara Aufbereitung", desc: "Texturerhaltende Tiefenreinigung von Alcantara-Oberflächen.", price: "ab 59€" },
  { title: "Hol- & Bringservice", desc: "Komfortabler Abhol- und Rückbringservice innerhalb 20 km.", price: "ab 49€" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Extras() {
  return (
    <section id="zusatz" className="relative py-32 md:py-48">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-eyebrow">03 — Zusatzleistungen</p>
            <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
              Premium
              <br />
              <span className="italic text-muted-foreground">Zusatzleistungen.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Jede Leistung ist einzeln oder als Ergänzung zu einem Paket buchbar.
            </p>
          </div>
          <Link
            to="/buchen"
            className="btn-secondary shrink-0 hover:border-foreground hover:bg-foreground/5"
          >
            Alle buchen
          </Link>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((e, i) => (
            <motion.article
              key={e.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease }}
              className="luxury-card group flex flex-col justify-between p-7 hover:border-foreground/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            >
              <div>
                <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-base font-medium leading-snug">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-display text-xl">{e.price}</span>
                <span className="translate-x-0 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100">
                  Hinzufügen →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
