import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, MessageCircle, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#preise", label: "Preise" },
  { href: "#galerie", label: "Galerie" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

const legalLinks = [
  { href: "#", label: "Impressum" },
  { href: "#", label: "Datenschutz" },
  { href: "#", label: "AGB" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* CTA band */}
      <div className="border-b border-border">
        <div className="container-lux py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-eyebrow">Jetzt starten</p>
              <h2 className="text-display mt-4 text-[clamp(2.5rem,6vw,5rem)]">
                Ihr Fahrzeug verdient
                <br />
                <span className="italic text-muted-foreground">das Beste.</span>
              </h2>
            </div>
            <Link
              to="/buchen"
              className="btn-primary shrink-0 shadow-[0_8px_40px_rgba(255,255,255,0.08)] hover:opacity-90 hover:scale-[0.98] active:scale-95"
            >
              Termin buchen
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-lux py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src="/logo.jpeg"
                alt="WV Detailing"
                className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-muted-foreground">
              Premium Fahrzeugaufbereitung aus Deutschland. Handwerk, Präzision
              und höchste Qualität für Fahrzeuge, die das Beste verdienen.
            </p>
            <div className="mt-7 flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all hover:border-foreground hover:-translate-y-0.5"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/491778452138"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all hover:border-foreground hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-eyebrow mb-6">Navigation</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-eyebrow mb-6">Leistungen</p>
            <ul className="space-y-3">
              {[
                "Innenreinigung",
                "Außenreinigung",
                "Komplettaufbereitung",
                "Keramikversiegelung",
                "Lackkorrektur",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#leistungen"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kunden */}
          <div>
            <p className="text-eyebrow mb-6">Kundenbereich</p>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/kunden-login"
                  search={{ redirect: "/meine-buchungen" }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Anmelden
                </Link>
              </li>
              <li>
                <Link
                  to="/meine-buchungen"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Meine Buchungen
                </Link>
              </li>
            </ul>
            <Link
              to="/buchen"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Termin buchen
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} WV Detailing. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-6">
            <Link to="/auth" className="hover:text-foreground transition-colors">
              Admin
            </Link>
            <span>Handgefertigt in Deutschland</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
