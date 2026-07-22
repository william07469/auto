import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { z } from "zod";
import { getLockoutSeconds, recordFailedAttempt, clearAttempts } from "@/lib/loginThrottle";

const THROTTLE_KEY = "kunden-login";

const loginSearchSchema = z.object({
  redirect: z
    .string()
    // Güvenli iç path doğrulaması:
    // 1. "/" ile başlamalı (mutlak URL değil)
    // 2. "//" veya "/\\" ile başlamamalı (protocol-relative ve Windows path bypass)
    // 3. URL decode sonrası da geçerli olmalı
    .refine(
      (v) => {
        if (!v.startsWith("/")) return false;
        if (v.startsWith("//") || v.startsWith("/\\")) return false;
        // URL decode sonrası da kontrol et
        try {
          const decoded = decodeURIComponent(v);
          if (decoded.startsWith("//") || decoded.startsWith("/\\")) return false;
        } catch {
          return false; // decode edilemeyen değeri reddet
        }
        return true;
      },
      { message: "Nur relative Pfade erlaubt" }
    )
    .optional()
    .default("/meine-buchungen"),
});

/** Redirect URL'inin gerçekten iç path olduğunu çalışma zamanında doğrula */
function safeRedirectPath(raw: string, fallback = "/meine-buchungen"): string {
  try {
    // Tarayıcı ortamında: aynı origin kontrolü
    if (typeof window !== "undefined") {
      const url = new URL(raw, window.location.origin);
      if (url.origin !== window.location.origin) return fallback;
      return url.pathname + url.search + url.hash;
    }
    // SSR: sadece "/" ile başlayanı kabul et
    if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
    return raw;
  } catch {
    return fallback;
  }
}

export const Route = createFileRoute("/kunden-login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: KundenLoginPage,
  head: () => ({
    meta: [
      { title: "Kunden Login — WV Detailing" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function KundenLoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/kunden-login" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
        if (roleRow?.role === "admin") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: safeRedirectPath(redirectTo) as any });
        }
      }
    });
  }, [navigate, redirectTo]);

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
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${safeRedirectPath(redirectTo)}` },
        });
        if (error) throw error;
        toast.success("Konto erstellt. Bitte bestätigen Sie Ihre E-Mail.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const remaining = recordFailedAttempt(THROTTLE_KEY);
          if (remaining > 0) {
            const min = Math.ceil(remaining / 60);
            toast.error(`Zu viele Fehlversuche. Konto für ${min} Minute${min !== 1 ? "n" : ""} gesperrt.`);
          } else {
            throw error;
          }
          return;
        }

        clearAttempts(THROTTLE_KEY);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roleRow } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .maybeSingle();
          navigate({ to: roleRow?.role === "admin" ? "/admin" : (safeRedirectPath(redirectTo) as any) });
        } else {
          navigate({ to: safeRedirectPath(redirectTo) as any });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
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
          <p className="text-eyebrow">Kundenbereich</p>
          <h1 className="text-display text-3xl mt-2">
            {mode === "signin" ? "Anmelden" : "Konto erstellen"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signin"
              ? "Melden Sie sich an, um Ihre Buchungen einzusehen."
              : "Erstellen Sie ein Konto, um Ihre Termine zu verwalten."}
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
              {loading ? "..." : mode === "signin" ? "Anmelden" : "Registrieren"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            {mode === "signin" ? "Neues Konto erstellen" : "Bereits registriert? Anmelden"}
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <Link to="/auth" className="hover:text-foreground transition-colors uppercase tracking-[0.2em]">
            Admin Login
          </Link>
          <Link to="/" className="hover:text-foreground transition-colors uppercase tracking-[0.2em]">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
