import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { ActionBtn, Skeleton, Empty } from "./AdminBookings";
import { Field, Toggle } from "./AdminFaq";

type Pkg = {
  id: string;
  name: string;
  tier: "basic" | "deluxe";
  category: string;
  price: number;
  description: string | null;
  features: string[];
  sort_order: number;
  is_active: boolean;
};

const emptyDraft = (): Omit<Pkg, "id"> => ({
  name: "", tier: "basic", category: "", price: 0,
  description: "", features: [], sort_order: 0, is_active: true,
});

const TIER_STYLES: Record<string, string> = {
  basic:  "bg-muted text-muted-foreground",
  deluxe: "bg-foreground/10 text-foreground ring-1 ring-foreground/20",
};

export function AdminPricing() {
  const [items, setItems] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Pkg, "id">>(emptyDraft());

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pricing_packages").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Pkg[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name || !draft.category) return toast.error("Name und Kategorie erforderlich");
    setBusy((b) => ({ ...b, add: true }));
    const { error } = await supabase.from("pricing_packages").insert({
      ...draft, features: draft.features.filter(Boolean),
    });
    setBusy((b) => ({ ...b, add: false }));
    if (error) toast.error(error.message);
    else { toast.success("Paket hinzugefügt"); setDraft(emptyDraft()); load(); }
  };

  const update = async (p: Pkg) => {
    setBusy((b) => ({ ...b, [p.id]: true }));
    const { error } = await supabase.from("pricing_packages").update({
      name: p.name, tier: p.tier, category: p.category, price: p.price,
      description: p.description, features: p.features.filter(Boolean),
      sort_order: p.sort_order, is_active: p.is_active,
    }).eq("id", p.id);
    setBusy((b) => ({ ...b, [p.id]: false }));
    if (error) toast.error(error.message);
    else toast.success("Gespeichert");
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("pricing_packages").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else { toast.success("Gelöscht"); setItems((prev) => prev.filter((x) => x.id !== id)); setConfirmDelete(null); }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-2xl border border-dashed border-border p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-4">Neues Paket</p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Field label="Kategorie" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} />
          <TierSelect value={draft.tier} onChange={(v) => setDraft({ ...draft, tier: v as "basic" | "deluxe" })} />
          <Field label="Preis €" type="number" value={String(draft.price)} onChange={(v) => setDraft({ ...draft, price: parseInt(v) || 0 })} />
          <Field label="Beschreibung (Dauer)" value={draft.description ?? ""} onChange={(v) => setDraft({ ...draft, description: v })} />
          <div className="sm:col-span-1 md:col-span-3">
            <Field label="Features (kommagetrennt)" value={draft.features.join(", ")} onChange={(v) => setDraft({ ...draft, features: v.split(",").map((s) => s.trim()) })} />
          </div>
        </div>
        <div className="mt-5">
          <ActionBtn onClick={add} loading={busy["add"]} variant="primary" icon={<Plus className="h-3.5 w-3.5" />}>
            Hinzufügen
          </ActionBtn>
        </div>
      </div>

      {items.length === 0 && <Empty label="Noch keine Pakete." />}

      <div className="space-y-3">
        {items.map((p, idx) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
            {/* Tier badge */}
            <div className="mb-4 flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${TIER_STYLES[p.tier] ?? TIER_STYLES.basic}`}>
                {p.tier}
              </span>
              <span className="text-sm font-medium">{p.name}</span>
              <span className="ml-auto text-lg font-light tabular-nums">{p.price}€</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Field label="Name" value={p.name} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, name: v } : x))} />
              <Field label="Kategorie" value={p.category} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, category: v } : x))} />
              <TierSelect value={p.tier} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, tier: v as "basic" | "deluxe" } : x))} />
              <Field label="Preis €" type="number" value={String(p.price)} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, price: parseInt(v) || 0 } : x))} />
              <Field label="Beschreibung (Dauer)" value={p.description ?? ""} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, description: v } : x))} />
              <div className="sm:col-span-1 md:col-span-3">
                <Field label="Features (kommagetrennt)" value={p.features.join(", ")} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, features: v.split(",").map((s) => s.trim()) } : x))} />
              </div>
              <Field label="Sortierung" type="number" value={String(p.sort_order)} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, sort_order: parseInt(v) || 0 } : x))} />
              <Toggle label="Aktiv" checked={p.is_active} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, is_active: v } : x))} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <ActionBtn onClick={() => update(p)} loading={busy[p.id]} variant="neutral" icon={<Save className="h-3.5 w-3.5" />}>
                Speichern
              </ActionBtn>
              <div className="ml-auto">
                {confirmDelete === p.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                    <ActionBtn onClick={() => remove(p.id)} loading={busy[p.id + "del"]} variant="danger" size="sm">Ja</ActionBtn>
                    <ActionBtn onClick={() => setConfirmDelete(null)} variant="neutral" size="sm">Nein</ActionBtn>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(p.id)}
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

function TierSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Stufe</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-foreground/50"
      >
        <option value="basic" className="bg-background">Basic</option>
        <option value="deluxe" className="bg-background">Deluxe</option>
      </select>
    </label>
  );
}
