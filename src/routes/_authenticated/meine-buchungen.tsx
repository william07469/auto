import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { LogOut, ArrowLeft, Calendar, Clock, Euro, XCircle } from "lucide-react";
import { getMyBookings } from "@/functions/getMyBookings";
import { cancelBooking } from "@/functions/cancelBooking";
import { toast } from "sonner";

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

export const Route = createFileRoute("/_authenticated/meine-buchungen")({
  component: MyBookingsPage,
  beforeLoad: ({ context }) => {
    if (context.role === "admin") throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title: "Meine Buchungen — WV Detailing" }, { name: "robots", content: "noindex,nofollow" }] }),
});

const STATUS_LABELS: Record<string, string> = {
  neu: "Ausstehend",
  bestaetigt: "Bestätigt",
  abgeschlossen: "Abgeschlossen",
  storniert: "Storniert",
};

function MyBookingsPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Möchten Sie diese Buchung wirklich stornieren?")) return;
    setCancelling(id);
    try {
      await cancelBooking({ data: { bookingId: id } });
      toast.success("Buchung storniert");
      setItems((prev) => prev.map((b) => b.id === id ? { ...b, status: "storniert" } : b));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/kunden-login", search: { redirect: "/meine-buchungen" } });
        return;
      }
      setAuthed(true);
      setEmail(user.email ?? "");

      const bookings = await getMyBookings();
      setItems(bookings);
      setLoading(false);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (authed === null) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-lux flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.jpeg" alt="WV Detailing" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden md:inline">{email}</span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Seite
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-colors"
            >
              <LogOut className="h-3 w-3" /> Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="container-lux py-10">
        <h1 className="text-display text-3xl">Meine Buchungen</h1>
        <p className="mt-2 text-sm text-muted-foreground">Hier sehen Sie alle Ihre Terminanfragen und deren Status.</p>

        {loading ? (
          <div className="mt-8 text-sm text-muted-foreground">Lade...</div>
        ) : items.length === 0 ? (
          <div className="mt-8 py-12 text-center border border-dashed border-border">
            <p className="text-sm text-muted-foreground">Sie haben noch keine Buchungen.</p>
            <Link
              to="/buchen"
              className="mt-4 inline-flex items-center gap-2 border border-border px-6 py-3 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-colors"
            >
              Termin buchen
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((b) => (
              <div key={b.id} className="border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-eyebrow">{new Date(b.created_at).toLocaleString("de-DE")}</p>
                    <h3 className="text-display text-xl mt-2">{b.service}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{b.vehicle}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] border ${
                      b.status === "bestaetigt" ? "border-green-500 text-green-500" :
                      b.status === "storniert" ? "border-destructive text-destructive" :
                      b.status === "abgeschlossen" ? "border-foreground text-foreground" :
                      "border-border text-muted-foreground"
                    }`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {b.booking_date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {b.booking_time} Uhr
                  </span>
                  {b.estimated_price && (
                    <span className="flex items-center gap-1.5">
                      <Euro className="h-3.5 w-3.5" /> ab {b.estimated_price}€
                    </span>
                  )}
                </div>
                {b.notes && (
                  <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                    <span className="text-foreground">Anmerkung:</span> {b.notes}
                  </p>
                )}
                {b.status === "neu" && (
                  <div className="mt-4 border-t border-border pt-4">
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling === b.id}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {cancelling === b.id ? "Wird storniert…" : "Stornieren"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
