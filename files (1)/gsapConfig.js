// lib/gsapConfig.js
// Central place that registers GSAP plugins exactly once.
// Every hook/component imports gsap + ScrollTrigger from here so we
// never double-register plugins across client component re-mounts.

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Sensible global defaults — premium, slow-in/slow-out easing.
  gsap.defaults({
    ease: "power3.out",
    duration: 1,
  });
}

export { gsap, ScrollTrigger };
