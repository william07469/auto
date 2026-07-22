import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { ActionBtn, Skeleton, Empty } from "./AdminBookings";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function AdminContactMessages() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Message[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (id: string, current: boolean) => {
    setBusy((b) => ({ ...b, [id]: true }));
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !current })
      .eq("id", id);
    setBusy((b) => ({ ...b, [id]: false }));
    if (error) toast.error(error.message);
    else setItems((prev) => prev.map((m) => m.id === id ? { ...m, is_read: !current } : m));
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else {
      toast.success("Nachricht gelöscht");
      setItems((prev) => prev.filter((m) => m.id !== id));
      setConfirmDelete(null);
    }
  };

  const unreadCount = items.filter((m) => !m.is_read).length;

  if (loading) return <Skeleton />;
  if (items.length === 0) return <Empty label="Noch keine Nachrichten." />;

  return (
    <div className="space-y-3">
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-background">
            {unreadCount} neu
          </span>
          <span className="text-xs text-muted-foreground">
            {unreadCount === 1 ? "ungelesene Nachricht" : "ungelesene Nachrichten"}
          </span>
        </div>
      )}

      {items.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border p-6 transition-colors ${
            m.is_read ? "border-border bg-card" : "border-foreground/30 bg-card"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                {new Date(m.created_at).toLocaleString("de-DE")}
              </p>
              <h3 className="mt-1.5 text-lg font-medium">{m.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{m.email}</p>
            </div>
            {!m.is_read && (
              <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-background">
                Neu
              </span>
            )}
          </div>

          <p className="mt-4 rounded-xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {m.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <a
              href={`mailto:${m.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-all hover:border-foreground/50 hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" /> Antworten
            </a>
            <ActionBtn
              onClick={() => toggleRead(m.id, m.is_read)}
              loading={busy[m.id]}
              variant="neutral"
              icon={<MailOpen className="h-3.5 w-3.5" />}
            >
              {m.is_read ? "Ungelesen" : "Gelesen"}
            </ActionBtn>

            <div className="ml-auto">
              {confirmDelete === m.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                  <ActionBtn
                    onClick={() => remove(m.id)}
                    loading={busy[m.id + "del"]}
                    variant="danger"
                    size="sm"
                  >
                    Ja, löschen
                  </ActionBtn>
                  <ActionBtn onClick={() => setConfirmDelete(null)} variant="neutral" size="sm">
                    Abbrechen
                  </ActionBtn>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(m.id)}
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
  );
}
