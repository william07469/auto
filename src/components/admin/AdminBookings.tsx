import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Trash2, Check, X, CheckCheck, Loader2 } from "lucide-react";

type Booking = {
  id: string;
  service: string;
  vehicle: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  email: string;
  phone: string;
  notes: string | null;
  estimated_price: number | null;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  neu: "Ausstehend",
  bestaetigt: "Bestätigt",
  abgeschlossen: "Abgeschlossen",
  storniert: "Storniert",
};

const STATUS_STYLES: Record<string, string> = {
  neu:          "bg-muted text-muted-foreground",
  bestaetigt:   "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  abgeschlossen:"bg-foreground/10 text-foreground ring-1 ring-foreground/20",
  storniert:    "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

export function AdminBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Booking[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setBusy((b) => ({ ...b, [id + status]: true }));
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    setBusy((b) => ({ ...b, [id + status]: false }));
    if (error) toast.error(error.message);
    else {
      toast.success("Status aktualisiert");
      setItems((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    }
  };

  const remove = async (id: string) => {
    setBusy((b) => ({ ...b, [id + "del"]: true }));
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    setBusy((b) => ({ ...b, [id + "del"]: false }));
    if (error) toast.error(error.message);
    else {
      toast.success("Buchung gelöscht");
      setItems((prev) => prev.filter((b) => b.id !== id));
      setConfirmDelete(null);
    }
  };

  if (loading) return <Skeleton />;
  if (items.length === 0) return <Empty label="Noch keine Buchungen." />;

  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div
          key={b.id}
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border/80"
        >
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                {new Date(b.created_at).toLocaleString("de-DE")}
              </p>
              <h3 className="mt-1.5 text-lg font-medium">{b.customer_name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{b.email} · {b.phone}</p>
              <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] ${STATUS_STYLES[b.status] ?? STATUS_STYLES.neu}`}>
                {STATUS_LABELS[b.status] ?? b.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-light tabular-nums">
                {b.estimated_price ? `ab ${b.estimated_price}€` : "—"}
              </p>
              <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                {new Date(b.booking_date + "T12:00:00").toLocaleDateString("de-DE", {
                  weekday: "short", day: "numeric", month: "short",
                })} · {b.booking_time} Uhr
              </p>
            </div>
          </div>

          {/* Detail grid */}
          <div className="mt-4 grid gap-2 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-2">
            <Row label="Leistung" value={b.service} />
            <Row label="Fahrzeug" value={b.vehicle} />
            {b.notes && <Row label="Anmerkungen" value={b.notes} full />}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {b.status === "neu" && (
              <>
                <ActionBtn
                  onClick={() => updateStatus(b.id, "bestaetigt")}
                  loading={busy[b.id + "bestaetigt"]}
                  variant="success"
                  icon={<Check className="h-3.5 w-3.5" />}
                >
                  Bestätigen
                </ActionBtn>
                <ActionBtn
                  onClick={() => updateStatus(b.id, "storniert")}
                  loading={busy[b.id + "storniert"]}
                  variant="danger"
                  icon={<X className="h-3.5 w-3.5" />}
                >
                  Stornieren
                </ActionBtn>
              </>
            )}
            {b.status === "bestaetigt" && (
              <ActionBtn
                onClick={() => updateStatus(b.id, "abgeschlossen")}
                loading={busy[b.id + "abgeschlossen"]}
                variant="neutral"
                icon={<CheckCheck className="h-3.5 w-3.5" />}
              >
                Abschließen
              </ActionBtn>
            )}

            <div className="ml-auto">
              {confirmDelete === b.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Wirklich löschen?</span>
                  <ActionBtn
                    onClick={() => remove(b.id)}
                    loading={busy[b.id + "del"]}
                    variant="danger"
                    size="sm"
                  >
                    Ja, löschen
                  </ActionBtn>
                  <ActionBtn
                    onClick={() => setConfirmDelete(null)}
                    variant="neutral"
                    size="sm"
                  >
                    Abbrechen
                  </ActionBtn>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(b.id)}
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

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <span className="text-muted-foreground">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

type BtnVariant = "success" | "danger" | "neutral" | "primary";
type BtnSize    = "sm" | "md";

const VARIANT_STYLES: Record<BtnVariant, string> = {
  success: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/70",
  danger:  "border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/70",
  neutral: "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
  primary: "bg-foreground text-background border-foreground hover:opacity-80",
};

const SIZE_STYLES: Record<BtnSize, string> = {
  md: "px-4 py-2 text-xs",
  sm: "px-3 py-1.5 text-[0.6875rem]",
};

export function ActionBtn({
  children, onClick, loading, variant = "neutral", size = "md", icon, className = "",
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border font-medium uppercase tracking-[0.18em] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function Skeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-muted/30" />
      ))}
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
