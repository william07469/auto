import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "@/assets/detail-1.jpg";
import img2 from "@/assets/detail-2.jpg";
import img3 from "@/assets/detail-3.jpg";
import img4 from "@/assets/detail-4.jpg";
import heroImg from "@/assets/hero.jpg";
import { supabase } from "@/integrations/client";

// Fallback images shown while DB loads or if DB has no active items
const FALLBACK_ITEMS = [
  { id: "f0", src: heroImg, label: "Exterior", span: "col-span-2 row-span-2", before_url: img3, after_url: img3 },
  { id: "f1", src: img1, label: "Handwerk", span: "", before_url: img1, after_url: img1 },
  { id: "f2", src: img2, label: "Interior", span: "", before_url: img2, after_url: img2 },
  { id: "f3", src: img3, label: "Keramikversiegelung", span: "col-span-2", before_url: img3, after_url: img3 },
  { id: "f4", src: img4, label: "Räder", span: "", before_url: img4, after_url: img4 },
];

// Grid span assignment by index for dynamic items
const SPAN_PATTERN = [
  "col-span-2 row-span-2",
  "",
  "",
  "col-span-2",
  "",
];

type GalleryItem = {
  id: string;
  src: string;
  label: string;
  span: string;
  before_url: string;
  after_url: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

function BeforeAfter({ beforeUrl, afterUrl }: { beforeUrl: string; afterUrl: string }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Vorher/Nachher Vergleich"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className="relative aspect-[21/9] w-full cursor-ew-resize overflow-hidden rounded-2xl border border-border select-none focus:outline-none focus:ring-2 focus:ring-ring"
      onMouseMove={(e) => dragging && handleMove(e.clientX)}
      onMouseDown={(e) => { setDragging(true); handleMove(e.clientX); }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 2));
        if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 2));
      }}
    >
      {/* After (full) */}
      <img src={afterUrl} alt="Nachher" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />

      {/* Before (clipped) */}
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeUrl}
          alt="Vorher"
          loading="lazy"
          className="absolute inset-0 h-full object-cover grayscale"
          style={{ width: `${(100 / pos) * 100}%` }}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 z-10 flex items-center justify-center"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-px h-full bg-white/70" />
        <div className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-background/80 backdrop-blur shadow-lg">
          <div className="flex items-center gap-0.5">
            <ChevronLeft className="h-3.5 w-3.5" />
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-5 left-5 z-10 rounded-full bg-background/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] backdrop-blur">Vorher</span>
      <span className="absolute bottom-5 right-5 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-background backdrop-blur">Nachher</span>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
}: {
  images: GalleryItem[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-border bg-card hover:border-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
        aria-label="Vorheriges Bild"
        className="absolute left-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-border bg-card hover:border-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <motion.img
        key={current}
        src={images[current].src}
        alt={images[current].label}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
        aria-label="Nächstes Bild"
        className="absolute right-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-border bg-card hover:border-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
        {current + 1} / {images.length}
      </p>
    </motion.div>
  );
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_ITEMS);
  const [beforeAfter, setBeforeAfter] = useState({ before: img3, after: img3 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data || data.length === 0) return;

        const mapped: GalleryItem[] = data.map((row, i) => ({
          id: row.id,
          src: row.after_url,
          label: row.title,
          span: SPAN_PATTERN[i % SPAN_PATTERN.length] ?? "",
          before_url: row.before_url,
          after_url: row.after_url,
        }));

        setItems(mapped);

        // Use first item's before/after for the slider
        setBeforeAfter({ before: data[0].before_url, after: data[0].after_url });
      });
  }, []);

  return (
    <section id="galerie" className="relative bg-card py-32 md:py-48">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="max-w-3xl"
        >
          <p className="text-eyebrow">04 — Galerie</p>
          <h2 className="text-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">
            Momente der
            <br />
            <span className="italic text-muted-foreground">Perfektion.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="mt-20 grid auto-rows-[180px] grid-cols-2 gap-2 md:auto-rows-[260px] md:grid-cols-4 md:gap-3">
          {items.map((it, i) => (
            <motion.figure
              key={it.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease }}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border ${it.span}`}
              onClick={() => setLightbox(i)}
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-107"
              />
              <div className="absolute inset-0 bg-background/50 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-background/70 backdrop-blur">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/70 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] backdrop-blur opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                {it.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Before/After */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease }}
          className="mt-6"
        >
          <p className="text-eyebrow mb-5">Vorher · Nachher Vergleich</p>
          <BeforeAfter beforeUrl={beforeAfter.before} afterUrl={beforeAfter.after} />
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={items} index={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
