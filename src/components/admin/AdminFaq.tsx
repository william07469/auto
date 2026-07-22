import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { ActionBtn, Skeleton, Empty } from "./AdminBookings";

type F = { id: string; question: string; answer: string; sort_order: number; is_active: boolean };

export function AdminFaq() {
  const [items, setItems] = useState<F[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [draft, setDraft] = useState({ question: "", answer: "", sort_order: 0 });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as F[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.question || !draft.answer) return toast.error("Frage und Antwort erforderlich");
    setBusy((b) => ({ ...b, add: true }));
    const { error } = await supabase.from("faqs").insert({ ...draft, is_active: true });
    setBusy((b) => ({ ...b, add: false }));
    if (error) toast.error(error.message);
    else { toast.success("FAQ hinzugefügt"); setDraft({ question: "", answer: "", sort_order: 0 }); load(); }
  };

  const update = async (f: F) => {
    setBusy((b) => ({ ...b, [f.id]: true }));
    const { error } = await supabase.from("faqs").update({
      question: f.question, answer: f.answer, sort_order: f.sort_order, is_active: f.is_active,
    }).eq("id", f.id);
    setBusy((b) => ({ ...b, [f.id]: false }));
    if (error) toast.error(error.message);
    else toast.success("Gespeichert");
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else { toast.success("Gelöscht"); setItems((prev) => prev.filter((f) => f.id !== id)); setConfirmDelete(null); }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-2xl border border-dashed border-border p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-4">Neue FAQ</p>
        <div className="grid gap-4">
          <Field label="Frage" value={draft.question} onChange={(v) => setDraft({ ...draft, question: v })} />
          <Field label="Antwort" value={draft.answer} onChange={(v) => setDraft({ ...draft, answer: v })} textarea />
          <Field label="Sortierung" type="number" value={String(draft.sort_order)} onChange={(v) => setDraft({ ...draft, sort_order: parseInt(v) || 0 })} />
        </div>
        <div className="mt-5">
          <ActionBtn onClick={add} loading={busy["add"]} variant="primary" icon={<Plus className="h-3.5 w-3.5" />}>
            Hinzufügen
          </ActionBtn>
        </div>
      </div>

      {items.length === 0 && <Empty label="Noch keine FAQs." />}

      <div className="space-y-3">
        {items.map((f, idx) => (
          <div key={f.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid gap-4">
              <Field label="Frage" value={f.question} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, question: v } : x))} />
              <Field label="Antwort" value={f.answer} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, answer: v } : x))} textarea />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sortierung" type="number" value={String(f.sort_order)} onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, sort_order: parseInt(v) || 0 } : x))} />
                <Toggle
                  label="Aktiv"
                  checked={f.is_active}
                  onChange={(v) => setItems(items.map((x, i) => i === idx ? { ...x, is_active: v } : x))}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <ActionBtn
                onClick={() => update(f)}
                loading={busy[f.id]}
                variant="neutral"
                icon={<Save className="h-3.5 w-3.5" />}
              >
                Speichern
              </ActionBtn>
              <div className="ml-auto">
                {confirmDelete === f.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                    <ActionBtn onClick={() => remove(f.id)} loading={busy[f.id + "del"]} variant="danger" size="sm">Ja</ActionBtn>
                    <ActionBtn onClick={() => setConfirmDelete(null)} variant="neutral" size="sm">Nein</ActionBtn>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(f.id)}
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

function Field({ label, value, onChange, type = "text", textarea }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean;
}) {
  const base = "mt-2 w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-foreground/50 focus:bg-muted";
  return (
    <label className="block">
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${base} resize-none`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      }
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-end gap-3 pb-1">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full border transition-all duration-300 ${checked ? "border-foreground bg-foreground" : "border-border bg-muted"}`}
      >
        <div className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 ${checked ? "left-[calc(100%-1.375rem)] bg-background" : "left-0.5 bg-muted-foreground"}`} />
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
    </label>
  );
}

export { Field, Toggle };
