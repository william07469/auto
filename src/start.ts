import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Security headers applied to every response.
 *
 * X-Frame-Options          — prevents clickjacking (legacy browsers)
 * X-Content-Type-Options   — prevents MIME-type sniffing
 * Referrer-Policy          — limits referrer leakage to same-origin
 * Permissions-Policy       — disables unused browser APIs
 * X-XSS-Protection         — belt-and-suspenders for very old browsers
 *
 * Note: CSRF tokens are not necessary here because all state-mutating
 * endpoints are TanStack server functions that require a Bearer token in
 * the Authorization header — a credential the browser cannot attach
 * automatically in a cross-origin request, which provides the same
 * protection as a CSRF token.
 */
const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();
  if (response instanceof Response) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
    );
    response.headers.set("X-XSS-Protection", "1; mode=block");
  }
  return response;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware],
}));
