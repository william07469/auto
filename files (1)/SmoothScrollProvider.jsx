// components/SmoothScrollProvider.jsx
//
// WHERE TO PLACE:
//   app/layout.js (or _app.js in the pages router)
//   Wrap your existing {children} with this component. It does not render
//   any visual markup of its own — it only initializes smooth scrolling.
//
//   Example (app/layout.js):
//
//     import SmoothScrollProvider from "@/components/SmoothScrollProvider";
//
//     export default function RootLayout({ children }) {
//       return (
//         <html lang="en">
//           <body>
//             <SmoothScrollProvider>{children}</SmoothScrollProvider>
//           </body>
//         </html>
//       );
//     }

"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium ease-out-expo
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis's virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker instead of its own rAF loop so every
    // animation library on the page shares one clock (no jitter/drift).
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Expose globally so any component can call window.lenis.scrollTo(...)
    // for nav-link smooth scrolling without prop drilling.
    if (typeof window !== "undefined") {
      window.lenis = lenis;
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (typeof window !== "undefined") {
        window.lenis = null;
      }
    };
  }, []);

  return children;
}
