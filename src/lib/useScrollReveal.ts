import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  y?: number;
  scale?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Attach a GSAP ScrollTrigger fade-up reveal to the returned ref.
 * Works on a container (animates its direct children with stagger)
 * or on a single element.
 */
export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    const {
      y = 40,
      scale = 1,
      blur = 0,
      duration = 0.9,
      delay = 0,
      stagger = 0,
      start = "top 88%",
    } = opts;

    const el = ref.current;
    const targets = stagger > 0 ? Array.from(el.children) : el;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y,
      scale,
      filter: blur > 0 ? `blur(${blur}px)` : undefined,
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: blur > 0 ? "blur(0px)" : undefined,
      duration,
      delay,
      ease: "expo.out",
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromVars, toVars);
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
