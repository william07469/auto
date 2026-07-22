import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Plus, Trash2, Save, Star } from "lucide-react";
import { ActionBtn, Skeleton, Empty } from "./AdminBookings";
import { Field, Toggle } from "./AdminFaq";

type T = { id: string; author: string; role: string | null; content: string; rating: number; sort_order: number; is_active: boolean };

export function AdminTestimonials() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [draft, setDraft] = useState({ author: "", role: "", content: "", rating: 5, sort_order: 0 });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as T[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.author || !draft.content) return toast.error("Autor und Text erforderlich");
    setBusy((b) => ({ ...b, add: true }));
    const { error } = await supabase.from("testimonials").insert({ ...draft, is_active: true });
    setBusy((b) => ({ ...b, add: false }));
    if (error) toast.error(error.message);
    else { toast.success("Bewertung hinzugefügt"); setDraft({ author: "", role: "", content: "", rating: 5, sort_order: 0 }); load(); }
  };

  const update = async (t: T) => {
    setBusy((b) => ({ ...b, [t.id]: true }));
    const { error } = await supabase.from("testimonials").update({
      author: t.author, role: t.role, content: t.content,
      rating: t.rating, sort_order: t.sort_order, is_active: t.is_active,
    }).eq("id", t.id);
    setBusy((b) => ({ ...b, [t.id]: false }));
    if (error) toast.error(error.message);
    else toast.success("Gespeichert");
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else { toast.success("Gelöscht"); setItems((prev) => prev.filter((t) => t.id !== id)); setConfirmDelete(null); }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-2xl border border-dashed border-border p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-4">Neue Bewertung</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Autor" value={draft.author} onChange={(v) => setDraft({ ...draft, author: v })} />
          <Field label="Rolle / Fahrzeug" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
          <Field label="Text" value={draft.content} onChange={(v) => setDraft({ ...draft, content: v })} textarea />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bewertung (1–5)" type="number" value={String(draft.rating)} onChange={(v) => setDraft({ ...draft, rating: Math.min(5, Math.max(1, parseInt(v) || 5)) })} />
            <Field label="Sortierung" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })} />
          </div>
        </div>
        <div className="mt-5">
          <ActionBtn onClick={add} loading={busy["add"]} variant="primary" icon={<Plus className="h-3.5 w-3.5" />}>
            Hinzufügen
          </ActionBtn>
        </div>
      </div>

      {items.length === 0 && <Empty label="Noch keine Bewertungen." />}

      <div className="space-y-3">
        {items.map((t, idx) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
            {/* Star preview */}
            <div className="mb-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= t.rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Autor" value={t.author} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, author: v } : x))} />
              <Field label="Rolle" value={t.role ?? ""} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, role: v } : x))} />
              <Field label="Text" value={t.content} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, content: v } : x))} textarea />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Bewertung" type="number" value={String(t.rating)} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, rating: Math.min(5, Math.max(1, parseInt(v) || 5)) } : x))} />
                <Field label="Sortierung" type="number" value={String(t.sort_order)} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, sort_order: parseInt(v) || 0 } : x))} />
              </div>
              <Toggle label="Aktiv" checked={t.is_active} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, is_active: v } : x))} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <ActionBtn onClick={() => update(t)} loading={busy[t.id]} variant="neutral" icon={<Save className="h-3.5 w-3.5" />}>
                Speichern
              </ActionBtn>
              <div className="ml-auto">
                {confirmDelete === t.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                    <ActionBtn onClick={() => remove(t.id)} loading={busy[t.id + "del"]} variant="danger" size="sm">Ja</ActionBtn>
                    <ActionBtn onClick={() => setConfirmDelete(null)} variant="neutral" size="sm">Nein</ActionBtn>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(t.id)}
                    aria-label="Löschen"
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
