import React, { useEffect, useRef } from "react";
import { ServiceId, ServiceOption } from "./types";
import { SERVICES_DATA } from "./bookingData";
import { Sparkles, ShieldCheck, Car, Armchair, Gauge, Wrench, ArrowRight, Check } from "lucide-react";
import gsap from "gsap";

interface ServiceStepProps {
  selectedServiceId: ServiceId | null;
  onSelectService: (serviceId: ServiceId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
  Car: <Car className="w-6 h-6 text-teal-400" />,
  Armchair: <Armchair className="w-6 h-6 text-emerald-300" />,
  Gauge: <Gauge className="w-6 h-6 text-amber-400" />,
  Wrench: <Wrench className="w-6 h-6 text-zinc-400" />,
};

export const ServiceStep: React.FC<ServiceStepProps> = ({ selectedServiceId, onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".service-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
          Schritt 1 — Hauptleistung / Service
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
          Wählen Sie Ihren Pflegedienst / Service
        </h3>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Wählen Sie eine Hauptleistung. Dynamische Optionen und Add-Ons werden im nächsten Schritt angepasst.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((service: ServiceOption) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`service-card group relative p-6 rounded-2xl cursor-pointer transition-all duration-400 backdrop-blur-xl border flex flex-col justify-between ${
                isSelected
                  ? "bg-zinc-900/95 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.25)] ring-2 ring-emerald-400/40 -translate-y-1"
                  : "bg-zinc-950/70 border-white/10 hover:border-white/25 hover:bg-zinc-900/70 hover:-translate-y-1 hover:shadow-2xl"
              }`}
            >
              <div>
                {/* Top Bar Row: Icon on left, Badge on right (Prevents ANY text overlap) */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`p-3.5 rounded-xl shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "bg-emerald-500/20 border border-emerald-400/50 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : "bg-zinc-900 border border-white/10 group-hover:border-white/20 group-hover:bg-zinc-800"
                    }`}
                  >
                    {ICON_MAP[service.iconName]}
                  </div>

                  {service.badge ? (
                    <span
                      className={`shrink-0 text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border shadow-sm ${
                        service.popular
                          ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                          : "bg-cyan-500/20 border-cyan-400/50 text-cyan-300"
                      }`}
                    >
                      {service.badge}
                    </span>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Title & Tagline Section */}
                <div className="mb-4">
                  <h4 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                    {service.name}
                  </h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-1 leading-snug">
                    {service.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-medium">Ab / Starting at</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      €{service.startingPrice}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">({service.duration})</span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                      : "bg-zinc-800/90 text-zinc-200 group-hover:bg-zinc-700 group-hover:text-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <span>Ausgewählt</span>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      <span>Wählen</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
