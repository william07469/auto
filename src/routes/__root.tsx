import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-7xl">404</h1>
        <p className="mt-4 text-eyebrow">Seite nicht gefunden</p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-none border border-foreground px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-3xl">Ein Fehler ist aufgetreten</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Bitte versuchen Sie es erneut.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3 text-sm font-medium uppercase tracking-wide text-background transition-opacity hover:opacity-80"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:border-foreground"
          >
            Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WV Detailing — Fahrzeugaufbereitung auf höchstem Niveau" },
      {
        name: "description",
        content:
          "WV Detailing – Premium Fahrzeugaufbereitung in Deutschland. Keramikversiegelung, Lackaufbereitung, Innenreinigung. Perfektion bis ins kleinste Detail.",
      },
      { name: "author", content: "WV Detailing" },
      { property: "og:title", content: "WV Detailing — Perfektion bis ins kleinste Detail" },
      {
        property: "og:description",
        content:
          "Premium Fahrzeugaufbereitung. Handwerk, Präzision und höchste Qualität für Ihr Fahrzeug.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WV Detailing" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}


