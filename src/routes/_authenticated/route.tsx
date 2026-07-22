import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/client";

export const Route = createFileRoute("/_authenticated")({
  // ssr: false kaldırıldı — beforeLoad artık server'da da çalışıyor.
  // Server tarafında localStorage olmadığı için auth başarısız olur ve redirect eder;
  // ancak bu, SSR/bot isteklerinin korumalı route'lara erişmesini engeller.
  // Client-side'da gerçek token doğrulaması yapılır.
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();

    // Giriş yapılmamışsa: admin sayfası → /auth, diğerleri → /kunden-login
    if (error || !data.user) {
      const isAdminRoute = location.pathname.startsWith("/admin");
      throw redirect({ to: isAdminRoute ? "/auth" : "/kunden-login", search: { redirect: location.pathname } });
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();

    const role = (roleRow?.role as "admin" | "user") ?? "user";

    return { user: data.user, role };
  },
  component: () => <Outlet />,
});
