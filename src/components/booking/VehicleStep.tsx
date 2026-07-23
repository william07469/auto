import React, { useEffect, useRef } from "react";
import { VehicleDetails } from "./types";
import { VEHICLE_SIZES } from "./bookingData";
import { Car, CarFront, Truck, Crown, Check, Palette, Calendar, Layers } from "lucide-react";
import gsap from "gsap";

interface VehicleStepProps {
  vehicle: VehicleDetails;
  onChangeVehicle: (updated: Partial<VehicleDetails>) => void;
}

const SIZE_ICONS: Record<string, React.ReactNode> = {
  coupe: <Car className="w-6 h-6 text-emerald-400" />,
  sedan: <CarFront className="w-6 h-6 text-teal-400" />,
  suv: <Truck className="w-6 h-6 text-cyan-400" />,
  exotic: <Crown className="w-6 h-6 text-amber-400" />,
};

const POPULAR_MAKES = [
  "Porsche", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Tesla", "Lamborghini", "Ferrari", "Land Rover", "Aston Martin"
];

export const VehicleStep: React.FC<VehicleStepProps> = ({ vehicle, onChangeVehicle }) => {
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
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3 py-1 rounded-full">
          Schritt 3 — Fahrzeugprofil
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
          Fahrzeugdaten & Größenklasse
        </h3>
        <p className="text-zinc-400 text-sm mt-1">
          Geben Sie Ihre Fahrzeugdaten ein, damit wir Produkte und Aufbereitungszeit optimal vorbereiten können.
        </p>
      </div>

      {/* Body Category Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Wählen Sie die Fahrzeugklasse
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VEHICLE_SIZES.map((size) => {
            const isSelected = vehicle.sizeCategory === size.id;

            return (
              <div
                key={size.id}
                onClick={() => onChangeVehicle({ sizeCategory: size.id })}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                  isSelected
                    ? "bg-zinc-900/90 border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.25)] ring-2 ring-emerald-400/40 -translate-y-1"
                    : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isSelected ? "bg-emerald-500/20 border-emerald-400/40" : "bg-zinc-900 border-white/10"
                    }`}
                  >
                    {SIZE_ICONS[size.id]}
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-black shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="text-base font-bold text-white">{size.label}</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">{size.subtext}</p>
                <p className="text-[10px] text-zinc-500 mt-2 italic">{size.example}</p>

                {size.multiplier > 1.0 && (
                  <div className="mt-3 inline-block text-[10px] font-mono font-medium text-emerald-400/90 bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded">
                    +{Math.round((size.multiplier - 1) * 100)}% Größenzuschlag
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Make, Model, Year, Color Form */}
      <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl space-y-6">
        {/* Quick select Make badges */}
        <div>
          <span className="text-xs text-zinc-400 font-medium block mb-2">Häufige Marken:</span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MAKES.map((mk) => (
              <button
                key={mk}
                type="button"
                onClick={() => onChangeVehicle({ make: mk })}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  vehicle.make.toLowerCase() === mk.toLowerCase()
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold"
                    : "bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {mk}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Make */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              Marke / Herstelle *
            </label>
            <input
              type="text"
              value={vehicle.make}
              onChange={(e) => onChangeVehicle({ make: e.target.value })}
              placeholder="z.B. Porsche, BMW, Audi"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <CarFront className="w-3.5 h-3.5 text-teal-400" />
              Modell *
            </label>
            <input
              type="text"
              value={vehicle.model}
              onChange={(e) => onChangeVehicle({ model: e.target.value })}
              placeholder="z.B. 911 Carrera, M5, Golf R"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Baujahr *
            </label>
            <input
              type="text"
              value={vehicle.year}
              onChange={(e) => onChangeVehicle({ year: e.target.value })}
              placeholder="z.B. 2024"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Farbe / Lackierung *
            </label>
            <input
              type="text"
              value={vehicle.color}
              onChange={(e) => onChangeVehicle({ color: e.target.value })}
              placeholder="z.B. Schwarz Metallic, Nardograu"
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/70 focus:ring-1 focus:ring-emerald-400/70 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
