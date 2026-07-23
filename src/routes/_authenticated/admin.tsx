import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ArrowLeft } from "lucide-react";
import { Toaster } from "sonner";
import { AdminBookings } from "@/components/admin/AdminBookings";
import { AdminPricing } from "@/components/admin/AdminPricing";
import { AdminVideos } from "@/components/admin/AdminVideos";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminFaq } from "@/components/admin/AdminFaq";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  beforeLoad: ({ context }) => {
    if (context.role !== "admin") throw redirect({ to: "/meine-buchungen" });
  },
  head: () => ({ meta: [{ title: "Admin — WV Detailing" }, { name: "robots", content: "noindex,nofollow" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? "");
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-right" />
      <header className="border-b border-border">
        <div className="container-lux flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpeg" alt="WV Detailing" className="h-9 w-auto object-contain" />
            </Link>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden sm:inline">Admin Panel</span>
          </div>
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
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-colors cursor-pointer"
            >
              <LogOut className="h-3 w-3" /> Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="container-lux py-10">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger value="bookings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">Buchungen</TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">Preise</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">Videos</TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">Galerie</TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">Bewertungen</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-xs uppercase tracking-[0.2em]">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings" className="mt-8"><AdminBookings /></TabsContent>
          <TabsContent value="pricing" className="mt-8"><AdminPricing /></TabsContent>
          <TabsContent value="videos" className="mt-8"><AdminVideos /></TabsContent>
          <TabsContent value="gallery" className="mt-8"><AdminGallery /></TabsContent>
          <TabsContent value="testimonials" className="mt-8"><AdminTestimonials /></TabsContent>
          <TabsContent value="faq" className="mt-8"><AdminFaq /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
