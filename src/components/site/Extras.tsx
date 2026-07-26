import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

const extras = [
  { title: "Scheinwerfer Aufbereitung", desc: "Kristallklare Sicht wiederhergestellt.", price: "90€" },
  { title: "Tierhaarentfernung", desc: "Gründliche Fellentfernung.", price: "40€" },
  { title: "Geruchsentfernung", desc: "Beseitigen Sie unerwünschte Gerüche.", price: "110€/Std." },
  { title: "Innenraumversiegelung", desc: "Weist Flecken ab & schützt vor UV-Schäden.", price: "150€" },
  { title: "Windschutzscheibenversiegelung", desc: "Regenabweisender Schutz.", price: "100€" },
  { title: "Motorraumreinigung", desc: "Makelloser Motorraum.", price: "85€" },
  { title: "Keramikversiegelung für Felgen", desc: "Langlebiger Felgenschutz.", price: "120€/Felge" },
  { title: "Ausbesserungsservice", desc: "Steinschläge & tiefe Kratzer reparieren.", price: "ab 50€" },
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
              Passen Sie Ihren Service mit unseren Spezialbehandlungen an.
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
