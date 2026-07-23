import React, { useEffect, useRef } from "react";
import { CustomerDetails } from "./types";
import { User, Phone, Mail, FileText, Lock } from "lucide-react";
import gsap from "gsap";

interface CustomerStepProps {
  customer: CustomerDetails;
  onChangeCustomer: (updated: Partial<CustomerDetails>) => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({ customer, onChangeCustomer }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
          Schritt 5 — Kundenangaben
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
          Kontaktdaten & Besonderheiten
        </h3>
        <p className="text-zinc-400 text-sm mt-1">
          Geben Sie Ihre Kontaktdaten ein, damit wir Ihre Reservierung verifizieren und bestätigen können.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              Vor- & Nachname *
            </label>
            <input
              type="text"
              required
              value={customer.fullName}
              onChange={(e) => onChangeCustomer({ fullName: e.target.value })}
              placeholder="z.B. Maximilian Mustermann"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-400" />
              Telefonnummer *
            </label>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) => onChangeCustomer({ phone: e.target.value })}
              placeholder="+49 170 1234567"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-cyan-400" />
              E-Mail Adresse *
            </label>
            <input
              type="email"
              required
              value={customer.email}
              onChange={(e) => onChangeCustomer({ email: e.target.value })}
              placeholder="maximilian@beispiel.de"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Anmerkungen / Besondere Anweisungen (Optional)
            </label>
            <textarea
              value={customer.notes}
              onChange={(e) => onChangeCustomer({ notes: e.target.value })}
              rows={3}
              placeholder="Z.B. Besondere Vorlieben für Innenraumduft, Steinschlagschutzfolierung vorhanden..."
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>
        </div>

        {/* Privacy badge */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-zinc-400">
          <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <p>
            Ihre Daten werden vertraulich behandelt und verschlüsselt verarbeitet. Keine Weitergabe an Dritte.
          </p>
        </div>
      </div>
    </div>
  );
};
