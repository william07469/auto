import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "@/assets/gallery-1.jpeg";
import img2 from "@/assets/gallery-2.jpeg";
import img3 from "@/assets/gallery-3.jpeg";
import img4 from "@/assets/gallery-4.jpeg";
import img5 from "@/assets/gallery-5.jpeg";
import img6 from "@/assets/gallery-6.jpeg";
import { supabase } from "@/integrations/client";

// Fallback images shown while DB loads or if DB has no active items
const FALLBACK_ITEMS = [
  { id: "f0", src: img1, label: "", span: "col-span-2 row-span-2" },
  { id: "f1", src: img2, label: "", span: "" },
  { id: "f2", src: img3, label: "", span: "" },
  { id: "f3", src: img4, label: "", span: "col-span-2" },
  { id: "f4", src: img5, label: "", span: "" },
  { id: "f5", src: img6, label: "", span: "" },
];

// Grid span assignment by index for dynamic items
const SPAN_PATTERN = [
  "col-span-2 row-span-2",
  "",
  "",
  "col-span-2",
  "",
  "",
];

type GalleryItem = {
  id: string;
  src: string;
  label: string;
  span: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

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
        }));

        setItems(mapped);
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
