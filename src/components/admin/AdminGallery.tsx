import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Plus, Trash2, Save, Upload } from "lucide-react";
import { ActionBtn, Skeleton, Empty } from "./AdminBookings";
import { Field, Toggle } from "./AdminFaq";

// All valid categories — matches the BeforeAfterSection tabs + Galerie for the photo grid
const CATEGORIES = [
  "Galerie",
  "Innenreinigung",
  "Außenreinigung",
  "Lackkorrektur",
  "Keramikversiegelung",
  "Motorraumreinigung",
];

type Item = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  before_url: string;
  after_url: string;
  sort_order: number;
  is_active: boolean;
};

const emptyDraft = () => ({
  title: "",
  category: "Galerie",
  description: "",
  before_url: "",
  after_url: "",
  sort_order: 0,
});

export function AdminGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [filterCategory, setFilterCategory] = useState<string>("Alle");
  const [uploading, setUploading] = useState<{ before?: boolean; after?: boolean }>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Item[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Supabase Storage'a dosya yükle ve public URL döndür
  const uploadImage = async (
    file: File,
    field: "before" | "after",
    onUrlReady: (url: string) => void
  ) => {
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(path);
      onUrlReady(data.publicUrl);
      toast.success("Bild hochgeladen");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload fehlgeschlagen");
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  };

  // Mevcut kaydın resimlerini yükle
  const uploadImageForItem = async (
    file: File,
    field: "before" | "after",
    itemId: string
  ) => {
    const key = itemId + field;
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(path);
      const colName = field === "before" ? "before_url" : "after_url";
      const { error } = await supabase
        .from("gallery_items")
        .update({ [colName]: data.publicUrl })
        .eq("id", itemId);
      if (error) throw error;

      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, [colName]: data.publicUrl } : it
        )
      );
      toast.success("Bild aktualisiert");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload fehlgeschlagen");
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  };

  const add = async () => {
    if (!draft.title || !draft.before_url || !draft.after_url) {
      return toast.error("Titel sowie Vorher- und Nachher-Bild erforderlich");
    }
    setBusy((b) => ({ ...b, add: true }));
    const { error } = await supabase.from("gallery_items").insert({
      ...draft,
      description: draft.description || null,
      is_active: true,
    });
    setBusy((b) => ({ ...b, add: false }));
    if (error) toast.error(error.message);
    else {
      toast.success("Eintrag hinzugefügt");
      setDraft(emptyDraft());
      load();
    }
  };

  const update = async (it: Item) => {
    setBusy((b) => ({ ...b, [it.id]: true }));
    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: it.title,
        category: it.category,
        description: it.description || null,
        before_url: it.before_url,
        after_url: it.after_url,
        sort_order: it.sort_order,
        is_active: it.is_active,
      })
      .eq("id", it.id);
    setBusy((b) => ({ ...b, [it.id]: false }));
    if (error) toast.error(error.message);
    else toast.success("Gespeichert");
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else {
      toast.success("Gelöscht");
      setItems((prev) => prev.filter((x) => x.id !== id));
      setConfirmDelete(null);
    }
  };

  if (loading) return <Skeleton />;

  const visibleItems =
    filterCategory === "Alle"
      ? items
      : items.filter((it) => it.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-2xl border border-dashed border-border p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-1">
          Neuer Eintrag
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Wählen Sie <strong className="text-foreground/60">Galerie</strong> für das Fotogrid — oder eine Servicekategorie für den Vorher/Nachher-Bereich.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Titel (Beispiel-Name)"
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
          />
          <CategorySelect
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
          />
          <div className="sm:col-span-2">
            <Field
              label="Beschreibung (wird im Ergebnisse-Bereich als Kategorie-Text angezeigt)"
              value={draft.description}
              onChange={(v) => setDraft({ ...draft, description: v })}
              textarea
            />
          </div>
          <ImageUpload
            label="Vorher-Bild"
            url={draft.before_url}
            uploading={!!uploading.before}
            onFile={(file) =>
              uploadImage(file, "before", (url) =>
                setDraft((d) => ({ ...d, before_url: url }))
              )
            }
          />
          <ImageUpload
            label="Nachher-Bild"
            url={draft.after_url}
            uploading={!!uploading.after}
            onFile={(file) =>
              uploadImage(file, "after", (url) =>
                setDraft((d) => ({ ...d, after_url: url }))
              )
            }
          />
          <Field
            label="Sortierung"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })}
          />
        </div>
        <div className="mt-5">
          <ActionBtn
            onClick={add}
            loading={busy["add"]}
            variant="primary"
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            Hinzufügen
          </ActionBtn>
        </div>
      </div>

      {/* Filter tabs */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {["Alle", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-[0.6875rem] uppercase tracking-[0.2em] border transition-all duration-200 ${
                filterCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {cat}
              {cat !== "Alle" && (
                <span className="ml-1.5 opacity-50">
                  {items.filter((i) => i.category === cat).length}
                </span>
              )}
              {cat === "Alle" && (
                <span className="ml-1.5 opacity-50">{items.length}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {visibleItems.length === 0 && (
        <Empty label={filterCategory === "Alle" ? "Noch keine Einträge." : `Keine Einträge in „${filterCategory}".`} />
      )}

      <div className="space-y-3">
        {visibleItems.map((it) => {
          const idx = items.findIndex((x) => x.id === it.id);
          return (
            <div key={it.id} className="rounded-2xl border border-border bg-card p-6">
              {/* Category badge */}
              <div className="mb-4 flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${
                  it.category === "Galerie"
                    ? "bg-muted text-muted-foreground"
                    : "bg-foreground/10 text-foreground ring-1 ring-foreground/20"
                }`}>
                  {it.category}
                </span>
                <span className="text-sm font-medium truncate">{it.title}</span>
              </div>

              {/* Image upload / replace */}
              <div className="grid gap-3 md:grid-cols-2 mb-5">
                <ImageUpload
                  label="Vorher-Bild"
                  url={it.before_url}
                  uploading={!!busy[it.id + "before"]}
                  onFile={(file) => uploadImageForItem(file, "before", it.id)}
                />
                <ImageUpload
                  label="Nachher-Bild"
                  url={it.after_url}
                  uploading={!!busy[it.id + "after"]}
                  onFile={(file) => uploadImageForItem(file, "after", it.id)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Titel"
                  value={it.title}
                  onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, title: v } : x))}
                />
                <CategorySelect
                  value={it.category}
                  onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, category: v } : x))}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Beschreibung"
                    value={it.description ?? ""}
                    onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, description: v } : x))}
                    textarea
                  />
                </div>
                <Field
                  label="Sortierung"
                  type="number"
                  value={String(it.sort_order)}
                  onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, sort_order: parseInt(v) || 0 } : x))}
                />
                <Toggle
                  label="Aktiv"
                  checked={it.is_active}
                  onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, is_active: v } : x))}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <ActionBtn
                  onClick={() => update(it)}
                  loading={busy[it.id]}
                  variant="neutral"
                  icon={<Save className="h-3.5 w-3.5" />}
                >
                  Speichern
                </ActionBtn>
                <div className="ml-auto">
                  {confirmDelete === it.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                      <ActionBtn
                        onClick={() => remove(it.id)}
                        loading={busy[it.id + "del"]}
                        variant="danger"
                        size="sm"
                      >
                        Ja
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => setConfirmDelete(null)}
                        variant="neutral"
                        size="sm"
                      >
                        Nein
                      </ActionBtn>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(it.id)}
                      aria-label="Löschen"
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-red-500/50 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Kategorie</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-foreground/50"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c} className="bg-background">{c}</option>
        ))}
      </select>
    </label>
  );
}

function ImageUpload({
  label,
  url,
  uploading,
  onFile,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewError, setPreviewError] = useState(false);

  // reset error when url changes
  const prevUrl = useRef(url);
  if (prevUrl.current !== url) {
    prevUrl.current = url;
    setPreviewError(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Nur Bilddateien erlaubt (JPG, PNG, WebP …)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximale Dateigröße: 10 MB");
      return;
    }
    onFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>

      {/* Preview area — also acts as drop zone */}
      <div
        className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted/40 cursor-pointer group"
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) onFile(file);
        }}
        aria-label={`${label} hochladen`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        {uploading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="h-6 w-6 rounded-full border-2 border-border border-t-foreground animate-spin" />
            <span className="text-[0.6rem] uppercase tracking-[0.2em]">Wird hochgeladen…</span>
          </div>
        ) : url && !previewError ? (
          <>
            <img
              src={url}
              alt={label}
              onError={() => setPreviewError(true)}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-60"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-foreground" />
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-foreground">Ersetzen</span>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
            <Upload className="h-7 w-7" />
            <span className="text-[0.6rem] uppercase tracking-[0.2em]">Klicken oder ziehen</span>
            <span className="text-[0.55rem] opacity-60">JPG, PNG, WebP — max 10 MB</span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-background/70 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] backdrop-blur">
          {label}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  );
}
