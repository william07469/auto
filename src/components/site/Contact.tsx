import { motion } from "motion/react";
import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, MessageCircle, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/client";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const contactLinks = [
  {
    icon: Phone,
    label: "Telefon",
    value: "+49 177 8452 138",
    sub: "Mo–Fr 08:00–19:00",
    href: "tel:+491778452138",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Direkte Antwort",
    sub: "Auch am Wochenende",
    href: "https://wa.me/491778452138",
  },
  {
    icon: Mail,
    label: "E-Mail",
    value: "kontakt@wv-detailing.de",
    sub: "Antwort innerhalb 24h",
    href: "mailto:kontakt@wv-detailing.de",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@wv_detailing",
    sub: "Aktuelle Projekte",
    href: "https://instagram.com/wv_detailing",
  },
  {
    icon: TikTokIcon,
    label: "TikTok",
    value: "@wv.detailing",
    sub: "Videos & Reels",
    href: "https://tiktok.com/@wv.detailing",
  },
];

const hours = [
  ["Montag – Freitag", "08:00 – 19:00"],
  ["Samstag", "09:00 – 17:00"],
  ["Sonntag", "Nach Vereinbarung"],
];

const ease = [0.16, 1, 0.3, 1] as const;

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  // Honeypot: botlar bu alanı doldurur, gerçek kullanıcılar görmez
  const [honeypot, setHoneypot] = useState("");
  // Client-side rate limiting: son gönderim zamanını localStorage'da sakla
  const RATE_LIMIT_MS = 60_000; // 60 saniye

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot doluysa bot — sessizce reddet
    if (honeypot) {
      setForm({ name: "", email: "", message: "" });
      toast.success("Nachricht gesendet. Wir melden uns bald!");
      return;
    }

    // Rate limiting: son 60 saniye içinde gönderilmişse engelle
    const lastSent = parseInt(localStorage.getItem("contact_last_sent") ?? "0", 10);
    const now = Date.now();
    if (now - lastSent < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastSent)) / 1000);
      toast.error(`Bitte warten Sie ${remaining} Sekunden vor der nächsten Nachricht.`);
      return;
    }

    // İçerik uzunluk sınırları
    if (form.name.trim().length < 2 || form.name.trim().length > 100) {
      toast.error("Name muss zwischen 2 und 100 Zeichen lang sein.");
      return;
    }
    // E-Mail format validation (matches DB constraint pattern)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(form.email.trim())) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (form.email.trim().length > 254) {
      toast.error("E-Mail-Adresse ist zu lang.");
      return;
    }
    if (form.message.trim().length < 10 || form.message.trim().length > 2000) {
      toast.error("Nachricht muss zwischen 10 und 2000 Zeichen lang sein.");
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSending(false);

    if (error) { toast.error("Fehler beim Senden."); return; }

    // Başarılı gönderim zamanını kaydet
    localStorage.setItem("contact_last_sent", String(Date.now()));
    toast.success("Nachricht gesendet. Wir melden uns bald!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.2, ease }}
      className="rounded-2xl border border-border bg-card p-8 md:p-10"
      noValidate
    >
      <p className="text-eyebrow mb-6">Nachricht senden</p>

      {/* Honeypot: ekrana görünmez, botlar doldurur */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="contact_url">URL</label>
        <input
          id="contact_url"
          type="text"
          name="url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
            Name
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ihr vollständiger Name"
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-foreground/50 focus:bg-muted"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
            E-Mail
          </span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ihre@email.de"
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-foreground/50 focus:bg-muted"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
            Nachricht
          </span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Erzählen Sie uns von Ihrem Fahrzeug..."
            className="w-full resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-foreground/50 focus:bg-muted"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending || !form.name || !form.email || !form.message}
        className="btn-primary mt-6 w-full justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[0.99] active:scale-[0.97]"
      >
        {sending ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background"
            />
            Wird gesendet…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={1.5} />
            Nachricht senden
          </>
        )}
      </button>
    </motion.form>
  );
}

export function Contact() {
  return (
    <section id="kontakt" className="relative py-32 md:py-48">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="max-w-3xl"
        >
          <p className="text-eyebrow">07 — Kontakt</p>
          <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
            Sprechen wir über
            <br />
            <span className="italic text-muted-foreground">Ihr Fahrzeug.</span>
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-8 xl:grid-cols-2">
          {/* Left: Info */}
          <div className="flex flex-col gap-6">
            {/* Contact cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contactLinks.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease }}
                    className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted transition-all duration-300 group-hover:border-foreground/30">
                      <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm font-medium">{c.value}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Opening hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Öffnungszeiten
                </p>
              </div>
              <dl className="divide-y divide-border/60">
                {hours.map(([d, h]) => (
                  <div key={d} className="flex items-center justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{d}</dt>
                    <dd className="font-medium">{h}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="relative min-h-[220px] overflow-hidden rounded-xl border border-border"
            >
              <iframe
                title="Standort WV Detailing"
                src="https://www.openstreetmap.org/export/embed.html?bbox=6.7534,51.2088,6.8534,51.2688&layer=mapnik"
                className="absolute inset-0 h-full w-full grayscale contrast-110 opacity-70"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 backdrop-blur">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-medium">WV Detailing · Musterstraße 12</p>
                  <p className="text-[0.6875rem] text-muted-foreground">40213 Düsseldorf</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
