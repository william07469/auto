import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
  head: () => ({
    meta: [
      { title: "Authentifizierung — WV Detailing" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error" | "reset">("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      // --- PKCE / code flow (yeni Supabase default) ---
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setStatus("error"); return; }
        // exchangeCodeForSession oturumu kurar, PASSWORD_RECOVERY event tetiklenir
        // Devam etmesi için onAuthStateChange'i dinle
      }

      // --- Hash fragment flow (eski Supabase / legacy linkler) ---
      const hashParams = hash ? new URLSearchParams(hash.slice(1)) : null;
      const accessToken = hashParams?.get("access_token");
      const refreshToken = hashParams?.get("refresh_token");
      const type = params.get("type") ?? hashParams?.get("type") ?? "";

      if (accessToken && refreshToken && type === "recovery") {
        // Her iki token da mevcutsa setSession güvenlidir
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) { setStatus("error"); return; }
        setStatus("reset");
        return;
      }

      // --- onAuthStateChange ile PASSWORD_RECOVERY event bekle ---
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setStatus("reset");
        } else if (event === "SIGNED_IN" && status === "loading") {
          // code flow sonrası oturum açıldı, reset ekranını göster
          setStatus("reset");
        }
      });
      unsubscribe = () => subscription.unsubscribe();

      // Belirli bir süre sonra hâlâ "loading" ise hata göster
      const timeout = setTimeout(() => {
        setStatus((s) => s === "loading" ? "error" : s);
      }, 5000);

      return () => clearTimeout(timeout);
    };

    init();
    return () => { unsubscribe?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwörter stimmen nicht überein."); return; }
    if (password.length < 8) { toast.error("Passwort muss mindestens 8 Zeichen lang sein."); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    toast.success("Passwort aktualisiert.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Wird verarbeitet...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-display text-3xl">Ungültiger Link</h1>
          <p className="mt-3 text-sm text-muted-foreground">Dieser Link ist ungültig oder abgelaufen.</p>
          <Link to="/auth" className="mt-6 inline-block border border-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors">
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border p-8">
        <h1 className="text-display text-2xl">Neues Passwort</h1>
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Neues Passwort</span>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none focus:border-foreground" />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Passwort bestätigen</span>
            <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none focus:border-foreground" />
          </label>
          <button type="submit" className="w-full bg-foreground py-4 text-xs font-medium uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-80">
            Passwort aktualisieren
          </button>
        </form>
      </div>
    </div>
  );
}
