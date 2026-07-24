import React, { useEffect, useRef } from "react";
import { VehicleDetails, VehicleSizeCategory } from "./types";
import { VEHICLE_SIZES } from "./bookingData";
import { Car, CarFront, Truck, Bus, Check } from "lucide-react";
import gsap from "gsap";

interface VehicleStepProps {
  vehicle: VehicleDetails;
  onChangeVehicle: (updated: Partial<VehicleDetails>) => void;
}

const SIZE_ICONS: Record<string, React.ReactNode> = {
  coupe: <Car className="w-5 h-5" />,
  sedan: <CarFront className="w-5 h-5" />,
  suv: <Truck className="w-5 h-5" />,
  van: <Bus className="w-5 h-5" />,
};

const POPULAR_MAKES = [
  "Porsche", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
  "Tesla", "Lamborghini", "Ferrari", "Land Rover", "Aston Martin",
];

export const VehicleStep: React.FC<VehicleStepProps> = ({ vehicle, onChangeVehicle }) => {
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
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Vehicle Profile</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          Tell us about your car
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          This helps us prepare the right products and allocate the correct appointment time.
        </p>
      </div>

      {/* Vehicle size selector */}
      <div className="space-y-3">
        <label className="text-eyebrow block">Vehicle Class</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {VEHICLE_SIZES.map((size) => {
            const isSelected = vehicle.sizeCategory === size.id;
            return (
              <button
                key={size.id}
                type="button"
                id={`vehicle-size-${size.id}`}
                onClick={() => onChangeVehicle({ sizeCategory: size.id as VehicleSizeCategory })}
                className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 border text-left ${
                  isSelected
                    ? "bg-white/[0.06] border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.06)] ring-1 ring-white/20"
                    : "bg-white/[0.02] border-white/8 hover:border-white/16 hover:bg-white/[0.04]"
                }`}
              >
                {/* Selection dot */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-3 w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-white/10 border-white/25 text-white"
                      : "bg-white/5 border-white/8 text-white/35"
                  }`}
                >
                  {SIZE_ICONS[size.id]}
                </div>

                <h4 className={`text-sm font-semibold transition-colors ${isSelected ? "text-white" : "text-white/70"}`}>
                  {size.label}
                </h4>
                <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{size.subtext}</p>
                <p className="text-[9px] text-white/20 mt-2 italic">{size.example}</p>
                {size.multiplier > 1.0 && (
                  <div className={`mt-3 text-[9px] font-mono uppercase tracking-wider transition-colors ${isSelected ? "text-white/60" : "text-white/25"}`}>
                    +{Math.round((size.multiplier - 1) * 100)}% size adj.
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle details form */}
      <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/8 space-y-6">
        {/* Quick-select make badges */}
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/25 block mb-3">Quick select make</span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MAKES.map((mk) => (
              <button
                key={mk}
                type="button"
                onClick={() => onChangeVehicle({ make: mk })}
                className={`text-[10px] px-3 py-1.5 rounded-full border transition-all tracking-wide ${
                  vehicle.make.toLowerCase() === mk.toLowerCase()
                    ? "bg-white/10 border-white/35 text-white font-medium"
                    : "bg-white/3 border-white/8 text-white/35 hover:border-white/16 hover:text-white/55"
                }`}
              >
                {mk}
              </button>
            ))}
          </div>
        </div>

        {/* Form inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { key: "make", label: "Make", placeholder: "e.g. Porsche, BMW, Audi", type: "text" },
            { key: "model", label: "Model", placeholder: "e.g. 911 Carrera, M5, Golf R", type: "text" },
            { key: "year", label: "Year", placeholder: "e.g. 2024", type: "text" },
            { key: "color", label: "Colour", placeholder: "e.g. Midnight Black Metallic", type: "text" },
          ].map((field) => (
            <div key={field.key} className="group">
              <label className="block text-[9px] uppercase tracking-[0.25em] text-white/35 mb-2 transition-colors group-focus-within:text-white/70">
                {field.label} *
              </label>
              <input
                type={field.type}
                value={vehicle[field.key as keyof VehicleDetails] as string}
                onChange={(e) => onChangeVehicle({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/35 focus:ring-1 focus:ring-white/15 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
