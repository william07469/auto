import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import wheelBefore from "@/assets/before_after/Jeep_wheel_with_brake_dust_202607260112.jpeg";
import wheelAfter from "@/assets/before_after/Create_wheel_images_first_2K_202607260107.jpeg";
import interiorDirtyBefore from "@/assets/before_after/White_Jeep_interior_dirty_2K_202607260134.jpeg";
import interiorCleanAfter from "@/assets/before_after/Create_interior_image_202607261229.jpeg";
import interiorBefore from "@/assets/before_after/interior_before.jpeg";
import interiorAfter from "@/assets/before_after/interior_after.jpeg";
import seatBefore from "@/assets/before_after/seat_before.jpeg";
import seatAfter from "@/assets/before_after/seat_after.jpeg";
import floorBefore from "@/assets/before_after/floor_before.jpeg";
import floorAfter from "@/assets/before_after/floor_after.jpeg";
import ceramicBefore from "@/assets/before_after/ceramic_before.jpeg";
import ceramicAfter from "@/assets/before_after/ceramic_after.jpeg";
import paintBefore from "@/assets/before_after/paint_before.jpeg";
import paintAfter from "@/assets/before_after/paint_after.jpeg";
import { supabase } from "@/integrations/client";

const ease = [0.16, 1, 0.3, 1] as const;
type Pair = { title: string; before: string; after: string };
type Case = { label: string; desc: string; pairs: Pair[] };

// ─── Static fallback ──────────────────────────────────────────────────────────
const FALLBACK_CASES: Case[] = [
  {
    label: "Interior Detail",
    desc: "Deep extraction cleaning of seats, carpets and dashboard. Stains, odours and embedded dirt completely removed from every surface.",
    pairs: [
      { title: "Driver Seat",  before: seatBefore,         after: seatAfter },
      { title: "Floor & Mats", before: floorAfter,         after: floorBefore },
      { title: "Cabin",        before: interiorDirtyBefore, after: interiorCleanAfter },
    ],
  },
  {
    label: "Exterior Detail",
    desc: "Two-bucket hand wash, clay bar decontamination, wheel cleaning and ceramic spray sealant for a flawless protected finish.",
    pairs: [
      { title: "Wheels & Tyres", before: wheelBefore, after: wheelAfter },
      { title: "Bodywork",       before: interiorBefore, after: interiorAfter },
    ],
  },
  {
    label: "Paint Correction",
    desc: "Machine polishing removes swirl marks, scratches and oxidation — restoring optical clarity, depth and showroom gloss.",
    pairs: [
      { title: "Swirl Removal", before: paintBefore, after: paintAfter },
    ],
  },
  {
    label: "Ceramic Coating",
    desc: "Nano-ceramic applied over corrected paint for long-term protection, UV resistance and extreme hydrophobic beading.",
    pairs: [
      { title: "Hydrophobic Effect", before: ceramicBefore, after: ceramicAfter },
    ],
  },
];

// ─── Single drag slider ───────────────────────────────────────────────────────
function Slider({ before, after, title }: { before: string; after: string; title: string }) {
  const [pos, setPos] = useState(42);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setPos(42); setTouched(false); }, [before, after]);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100)));
    setTouched(true);
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
      <div
        ref={ref}
        role="slider"
        aria-label={`Before/After: ${title}`}
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-foreground/30"
        onMouseDown={(e) => { setDragging(true); move(e.clientX); }}
        onMouseMove={(e) => dragging && move(e.clientX)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => move(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft")  setPos((p) => Math.max(3, p - 2));
          if (e.key === "ArrowRight") setPos((p) => Math.min(97, p + 2));
        }}
      >
        {/* After — full-width baseline */}
        <img src={after} alt="After" draggable={false}
          className="absolute inset-0 h-full w-full object-cover" />

        {/* Before — clipped left */}
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={before} alt="Before" draggable={false}
            className="absolute inset-0 h-full object-cover"
            style={{ width: `${(100 / pos) * 100}%` }} />
        </div>

        {/* Divider */}
        <div className="pointer-events-none absolute inset-y-0 z-10"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
          <div className="h-full w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-background/80 shadow-xl backdrop-blur">
            <MoveHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </div>
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-background/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] backdrop-blur">Before</span>
        <span className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-background backdrop-blur">After</span>

        {/* Drag hint */}
        <AnimatePresence>
          {!touched && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-background/60 px-5 py-2.5 backdrop-blur">
                <ChevronLeft className="h-3.5 w-3.5 opacity-60" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-foreground/80">Drag</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function BeforeAfterSection() {
  const [cases, setCases] = useState<Case[]>(FALLBACK_CASES);
  const [active, setActive] = useState(0);
  const [pairIndex, setPairIndex] = useState(0);

  // Load from DB
  useEffect(() => {
    (supabase.from("gallery_items") as any)
      .select("*")
      .eq("is_active", true)
      .neq("category", "Galerie")
      .order("sort_order")
      .then(({ data }: { data: any[] | null }) => {
        if (!data || data.length === 0) return;
        const map = new Map<string, { desc: string; pairs: Pair[] }>();
        for (const row of data) {
          if (!map.has(row.category)) {
            map.set(row.category, { desc: row.description ?? "", pairs: [] });
          }
          map.get(row.category)!.pairs.push({
            title: row.title,
            before: row.before_url,
            after: row.after_url,
          });
        }
        const built: Case[] = Array.from(map.entries()).map(([label, { desc, pairs }]) => ({
          label, desc, pairs,
        }));
        if (built.length > 0) setCases(built);
      });
  }, []);

  useEffect(() => { setPairIndex(0); }, [active]);

  const current = cases[active] ?? cases[0];
  const pair = current.pairs[pairIndex] ?? current.pairs[0];
  if (!current || !pair) return null;

  return (
    <section id="ergebnisse" className="relative py-32 md:py-48 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(255,255,255,0.03),transparent)]" />
      <div className="container-lux">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-eyebrow">03 — Results</p>
            <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
              Before.
              <br />
              <span className="italic text-muted-foreground">After.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-right">
            Drag the slider and witness the transformation — across every service we offer.
          </p>
        </motion.div>

        {/* Category tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mt-14 flex flex-wrap gap-2"
        >
          {cases.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setActive(i)}
              className={`relative rounded-full px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-all duration-300 ${
                active === i ? "text-background" : "border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="ba-tab-bg"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease }}
            className="mt-10 grid gap-10 lg:grid-cols-[1fr_2fr]"
          >
            {/* Left — description + pair list */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <h3 className="text-display text-2xl">{current.label}</h3>
                {current.desc && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{current.desc}</p>
                )}
              </div>

              {current.pairs.length > 1 && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Choose example</p>
                  <div className="flex flex-col gap-1.5">
                    {current.pairs.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPairIndex(i)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
                          pairIndex === i
                            ? "border-foreground/40 bg-card text-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${pairIndex === i ? "bg-foreground" : "bg-border"}`} />
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {current.pairs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPairIndex(i)}
                    aria-label={`Example ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      pairIndex === i ? "w-8 bg-foreground" : "w-4 bg-border hover:bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right — slider */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${pairIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease }}
              >
                <Slider before={pair.before} after={pair.after} title={pair.title} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
        >
          {[
            { value: "500+", label: "Vehicles Detailed" },
            { value: "4.9★", label: "Google Rating" },
            { value: "100%", label: "Hand Applied" },
            { value: "5yr",  label: "Ceramic Guarantee" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 bg-card px-6 py-8 text-center">
              <span className="text-display text-3xl">{s.value}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
