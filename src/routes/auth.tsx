import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { getLockoutSeconds, recordFailedAttempt, clearAttempts } from "@/lib/loginThrottle";

const THROTTLE_KEY = "admin-login";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Admin Anmeldung — WV Detailing" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        
        // Admin değilse giriş yaptırma
        if (roleRow?.role !== "admin") {
          toast.error("Nur Administratoren können sich hier anmelden.");
          await supabase.auth.signOut();
          return;
        }
        
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side lockout check
    const lockedFor = getLockoutSeconds(THROTTLE_KEY);
    if (lockedFor > 0) {
      const min = Math.ceil(lockedFor / 60);
      toast.error(`Zu viele Fehlversuche. Bitte warten Sie ${min} Minute${min !== 1 ? "n" : ""}.`);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const remaining = recordFailedAttempt(THROTTLE_KEY);
        if (remaining > 0) {
          const min = Math.ceil(remaining / 60);
          toast.error(`Zu viele Fehlversuche. Konto für ${min} Minute${min !== 1 ? "n" : ""} gesperrt.`);
        } else {
          toast.error(error.message);
        }
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Anmeldung fehlgeschlagen.");
        return;
      }

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleRow?.role !== "admin") {
        toast.error("Sie haben keine Admin-Berechtigung.");
        await supabase.auth.signOut();
        return;
      }

      clearAttempts(THROTTLE_KEY);
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-10" aria-label="WV Detailing">
          <img src="/logo.jpeg" alt="WV Detailing" className="mx-auto h-16 w-auto object-contain" />
        </Link>
        <div className="border border-border p-8">
          <p className="text-eyebrow">Admin Bereich</p>
          <h1 className="text-display text-3xl mt-2">Anmelden</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Nur für Administratoren.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">E-Mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none focus:border-foreground"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Passwort</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-xs font-medium uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {loading ? "..." : "Anmelden"}
            </button>
          </form>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <Link to="/kunden-login" search={{ redirect: "/meine-buchungen" }} className="hover:text-foreground transition-colors uppercase tracking-[0.2em]">
            Kunden Login
          </Link>
        </div>
      </div>
    </div>
  );
}
