// lib/lenis.ts
// Initialises Lenis smooth scroll and drives it from GSAP's ticker so
// every animation on the page shares one clock — no jitter or drift.
// ScrollTrigger is kept in sync via lenis.on("scroll", ...).

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

let lenis: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Keep ScrollTrigger's scroll position in sync with Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP ticker (single shared clock).
  const tickerCb = (time: number) => lenis!.raf(time * 1000);
  gsap.ticker.add(tickerCb);
  gsap.ticker.lagSmoothing(0);

  // Expose globally so nav anchor links can call window.lenis.scrollTo()
  if (typeof window !== "undefined") {
    (window as any).lenis = lenis;
  }

  return lenis;
}

export function destroyLenis(): void {
  if (!lenis) return;
  lenis.destroy();
  lenis = null;
  if (typeof window !== "undefined") {
    (window as any).lenis = null;
  }
}

export function getLenis(): Lenis | null {
  return lenis;
}
