import React, { useEffect, useRef } from "react";
import { ADDONS_DATA } from "./bookingData";
import {
  Gauge, ShieldCheck, Sun, Sparkles, Armchair, Wind, Circle, Dog, Check, Plus
} from "lucide-react";
import gsap from "gsap";

interface AddOnStepProps {
  selectedAddOnIds: string[];
  onToggleAddOn: (id: string) => void;
}

const ADDON_ICON_MAP: Record<string, React.ReactNode> = {
  Gauge: <Gauge className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Armchair: <Armchair className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
  Dog: <Dog className="w-4 h-4" />,
};

export const AddOnStep: React.FC<AddOnStepProps> = ({ selectedAddOnIds, onToggleAddOn }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".addon-card");
      gsap.fromTo(
        items,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
      );
    }
  }, []);

  const totalSelected = selectedAddOnIds.length;
  const totalAdded = ADDONS_DATA.filter(a => selectedAddOnIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl mx-auto">
      {/* Step header */}
      <div className="space-y-2">
        <p className="text-eyebrow">Optional Add-ons</p>
        <h3 className="text-display text-3xl sm:text-4xl text-white leading-[0.95]">
          Enhance your detail
        </h3>
        <p className="text-[var(--color-muted-foreground)] text-sm max-w-md mt-3">
          All add-ons are performed by the same technician in the same appointment. Skip this step if none apply.
        </p>
      </div>

      {/* Selection summary */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/15">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span className="text-xs text-white/60">
            {totalSelected} add-on{totalSelected > 1 ? "s" : ""} selected
          </span>
          <span className="text-xs font-mono text-white/70 ml-auto">+€{totalAdded}</span>
        </div>
      )}

      {/* Add-ons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ADDONS_DATA.map((addon) => {
          const isSelected = selectedAddOnIds.includes(addon.id);
          return (
            <button
              key={addon.id}
              type="button"
              id={`addon-${addon.id}`}
              onClick={() => onToggleAddOn(addon.id)}
              className={`addon-card group relative text-left p-5 rounded-xl cursor-pointer transition-all duration-300 border flex items-start gap-4 ${
                isSelected
                  ? "bg-white/[0.06] border-white/35 shadow-[0_0_25px_rgba(255,255,255,0.05)] ring-1 ring-white/15"
                  : "bg-white/[0.02] border-white/8 hover:border-white/14 hover:bg-white/[0.035]"
              }`}
            >
              {/* Badge */}
              {addon.badge && (
                <div className="absolute top-3 right-12">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-white/50">
                    {addon.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                  isSelected
                    ? "bg-white/10 border-white/25 text-white"
                    : "bg-white/4 border-white/8 text-white/30 group-hover:text-white/50"
                }`}
              >
                {ADDON_ICON_MAP[addon.iconName] ?? <Sparkles className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-start justify-between gap-2">
                  <h5 className={`text-sm font-semibold tracking-tight transition-colors leading-tight ${isSelected ? "text-white" : "text-white/70 group-hover:text-white/85"}`}>
                    {addon.name}
                  </h5>
                  <span className={`text-xs font-mono font-medium transition-colors shrink-0 ${isSelected ? "text-white" : "text-white/35 group-hover:text-white/55"}`}>
                    +€{addon.price}
                  </span>
                </div>
                <p className="text-[11px] text-white/30 mt-1.5 leading-relaxed group-hover:text-white/40 transition-colors">
                  {addon.description}
                </p>
              </div>

              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                  isSelected
                    ? "bg-white border-white"
                    : "border-white/16 bg-transparent group-hover:border-white/25"
                }`}
              >
                {isSelected
                  ? <Check className="w-3 h-3 text-black stroke-[3]" />
                  : <Plus className="w-3 h-3 text-white/25" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Skip hint */}
      <p className="text-[10px] text-white/20 tracking-wide">
        You can skip add-ons by pressing <span className="text-white/35">Continue</span> below.
      </p>
    </div>
  );
};
