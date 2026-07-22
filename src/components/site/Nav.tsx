import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/client";

const links = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#ergebnisse", label: "Ergebnisse" },
  { href: "#preise", label: "Preise" },
  { href: "#galerie", label: "Galerie" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { email: session.user.email ?? "" } : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? "" } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/" });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > prev && latest > 120);
  });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-500 ${
          scrolled ? "glass-nav shadow-[0_1px_40px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        <div className="container-lux flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center shrink-0">
            <img
              src="/logo.jpeg"
              alt="WV Detailing"
              className="h-10 w-auto md:h-12 object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/meine-buchungen"
                  className="hidden lg:inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Meine Buchungen
                </Link>
                <button
                  onClick={signOut}
                  className="hidden lg:inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-3 w-3" /> Abmelden
                </button>
              </>
            ) : (
              <Link
                to="/kunden-login"
                search={{ redirect: "/meine-buchungen" }}
                className="hidden lg:inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Anmelden
              </Link>
            )}
            <Link
              to="/buchen"
              className="hidden md:inline-flex btn-primary text-[0.6875rem] py-2.5 px-5 hover:opacity-90 hover:scale-[0.98] active:scale-95"
            >
              Termin buchen
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-foreground lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[90vw] flex-col bg-card border-l border-border lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 md:h-20">
                <img src="/logo.svg" alt="WV Detailing" className="h-9 w-auto object-contain" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Schließen"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-4 py-6">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease }}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto space-y-3 px-6 pb-10">
                {user ? (
                  <>
                    <Link
                      to="/meine-buchungen"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-foreground"
                    >
                      Meine Buchungen
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-foreground text-muted-foreground"
                    >
                      <LogOut className="h-3 w-3" /> Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/kunden-login"
                      onClick={() => setOpen(false)}
                      search={{ redirect: "/meine-buchungen" }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-all hover:border-foreground"
                    >
                      Anmelden
                    </Link>
                    <Link
                      to="/kunden-login"
                      onClick={() => setOpen(false)}
                      search={{ redirect: "/buchen" }}
                      className="btn-primary w-full justify-center text-[0.6875rem]"
                    >
                      Termin buchen
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
