import React, { useEffect, useRef } from "react";
import { ServiceId, ServiceOption } from "./types";
import { SERVICES_DATA } from "./bookingData";
import {
  Sparkles, ShieldCheck, Car, Armchair, Star, Check, ArrowRight
} from "lucide-react";
import gsap from "gsap";

interface ServiceStepProps {
  selectedServiceId: ServiceId | null;
  onSelectService: (serviceId: ServiceId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Gauge: <Sparkles className="w-5 h-5" />,
  Wrench: <ArrowRight className="w-5 h-5" />,
};

export const ServiceStep: React.FC<ServiceStepProps> = ({ selectedServiceId, onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".service-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Choose Your Service</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          What does your vehicle need?
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          Select the primary treatment. Package options and add-ons will be configured in the next steps.
        </p>
      </div>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES_DATA.map((service: ServiceOption) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              id={`service-${service.id}`}
              onClick={() => onSelectService(service.id)}
              className={`service-card group relative text-left p-6 rounded-2xl cursor-pointer transition-all duration-400 border flex flex-col justify-between min-h-[220px] ${
                isSelected
                  ? "bg-white/[0.06] border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.08)] ring-1 ring-white/20"
                  : "bg-white/[0.02] border-white/8 hover:border-white/16 hover:bg-white/[0.04]"
              }`}
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-[9px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border ${
                      service.popular
                        ? "bg-white/10 border-white/25 text-white/70"
                        : "bg-white/5 border-white/12 text-white/40"
                    }`}
                  >
                    {service.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    isSelected
                      ? "bg-white/10 border-white/25 text-white"
                      : "bg-white/5 border-white/8 text-white/40 group-hover:text-white/60 group-hover:border-white/16"
                  }`}
                >
                  {ICON_MAP[service.iconName]}
                </div>

                {/* Text */}
                <div>
                  <h4 className={`text-base font-semibold tracking-tight transition-colors leading-tight ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                    {service.name}
                  </h4>
                  <p className={`text-[11px] mt-1 leading-snug transition-colors ${isSelected ? "text-white/60" : "text-white/35 group-hover:text-white/50"}`}>
                    {service.tagline}
                  </p>
                </div>

                <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2 group-hover:text-white/45 transition-colors">
                  {service.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 block">from</span>
                  <span className={`text-lg font-bold font-mono tracking-tight transition-colors ${isSelected ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
                    €{service.startingPrice}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${
                    isSelected ? "text-white" : "text-white/25 group-hover:text-white/50"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <>
                      <span>Select</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Duration hint */}
      {selectedServiceId && (() => {
        const s = SERVICES_DATA.find(x => x.id === selectedServiceId);
        return s ? (
          <div className="flex items-center gap-3 text-xs text-white/30">
            <div className="w-4 h-px bg-white/10" />
            <span>Estimated duration: <span className="text-white/50 font-mono">{s.duration}</span></span>
          </div>
        ) : null;
      })()}
    </div>
  );
};
