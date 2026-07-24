import React, { useEffect, useRef } from "react";
import { CustomerDetails } from "./types";
import { User, Phone, Mail, FileText, Lock } from "lucide-react";
import gsap from "gsap";

interface CustomerStepProps {
  customer: CustomerDetails;
  onChangeCustomer: (updated: Partial<CustomerDetails>) => void;
}

const fields = [
  {
    key: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "e.g. Max Mustermann",
    icon: User,
    span: 2,
    required: true,
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+49 170 123 4567",
    icon: Phone,
    span: 1,
    required: true,
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    placeholder: "max@example.com",
    icon: Mail,
    span: 1,
    required: true,
  },
];

export const CustomerStep: React.FC<CustomerStepProps> = ({ customer, onChangeCustomer }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        Array.from(containerRef.current.children),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-10 max-w-3xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Your Information</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          Contact details
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          We use this to confirm your appointment and send reminders. Your data is never shared.
        </p>
      </div>

      {/* Form */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.key}
                className={`group ${field.span === 2 ? "sm:col-span-2" : ""}`}
              >
                <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2.5 transition-colors group-focus-within:text-white/70">
                  <Icon className="w-3 h-3" />
                  {field.label} {field.required && <span className="text-white/20">*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={customer[field.key as keyof CustomerDetails] as string}
                  onChange={(e) => onChangeCustomer({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/35 focus:ring-1 focus:ring-white/15 transition-all"
                />
              </div>
            );
          })}

          {/* Notes textarea */}
          <div className="group sm:col-span-2">
            <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2.5 transition-colors group-focus-within:text-white/70">
              <FileText className="w-3 h-3" />
              Notes <span className="text-white/20 normal-case tracking-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={customer.notes}
              onChange={(e) => onChangeCustomer({ notes: e.target.value })}
              rows={3}
              placeholder="Special requests, paint protection film present, preferred products, access instructions…"
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/35 focus:ring-1 focus:ring-white/15 transition-all resize-none"
            />
          </div>
        </div>

        {/* Privacy notice */}
        <div className="pt-5 border-t border-white/6 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/8 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5 text-white/30" />
          </div>
          <p className="text-[10px] text-white/25 leading-relaxed pt-1">
            Your data is encrypted and processed confidentially. Not shared with third parties. You can request deletion at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
