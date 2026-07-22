import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Star, Users, Clock, Award } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Zufriedene Kunden", sub: "Und täglich mehr" },
  { icon: Award, value: 1500, suffix: "+", label: "Aufbereitete Fahrzeuge", sub: "Porsche, AMG, Ferrari & mehr" },
  { icon: Star, value: 4.9, suffix: "★", label: "Google Bewertung", sub: "240+ verifizierte Reviews", decimal: 1 },
  { icon: Clock, value: 10, suffix: "+", label: "Jahre Erfahrung", sub: "Handwerk seit 2014" },
];

function Counter({
  value,
  suffix,
  decimal = 0,
}: {
  value: number;
  suffix: string;
  decimal?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const [inView, setInView] = useState(false);

  const rounded = useTransform(count, (v) => {
    if (decimal > 0) return v.toFixed(decimal);
    return Math.round(v).toString();
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, value, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

export function Statistics() {
  return (
    <section className="relative border-y border-border bg-card py-20 md:py-28">
      {/* Top rule */}
      <div className="container-lux">
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className="group relative flex flex-col items-center bg-card px-8 py-10 text-center"
              >
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted transition-all duration-500 group-hover:border-foreground/30">
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-500 group-hover:text-foreground" strokeWidth={1.5} />
                </div>

                {/* Number */}
                <span className="text-display text-[clamp(2.5rem,4vw,4rem)] tabular-nums">
                  <Counter value={s.value} suffix={s.suffix} decimal={s.decimal} />
                </span>

                {/* Label */}
                <p className="mt-3 text-[0.8125rem] font-medium">{s.label}</p>
                <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">{s.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
