// lib/useAnimations.ts
// Composable GSAP animation hooks.
// Attach a ref to existing elements and call the matching hook.
// None of these hooks change layout, colors, spacing, or content —
// they only apply transform/opacity/clip-path via GSAP.

import { useEffect, useRef, RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

/* ── 1. HERO ENTRANCE ────────────────────────────────────────────────────────
 * Add data-hero="title|subtitle|cta|media" to existing elements.
 * Waits for "page-loader-complete" event before playing.
 * -------------------------------------------------------------------------- */
export function useHeroEntrance(
  containerRef: RefObject<HTMLElement | null>,
  { waitForLoader = true }: { waitForLoader?: boolean } = {}
) {
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const title    = el.querySelectorAll('[data-hero="title"]');
    const subtitle = el.querySelectorAll('[data-hero="subtitle"]');
    const cta      = el.querySelectorAll('[data-hero="cta"]');
    const media    = el.querySelectorAll('[data-hero="media"]');

    let ctx: gsap.Context | undefined;

    const play = () => {
      ctx = gsap.context(() => {
        gsap.set([title, subtitle, cta], { autoAlpha: 0, y: 40 });
        gsap.set(media, { autoAlpha: 0, scale: 1.08 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(title,    { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 })
          .to(subtitle, { autoAlpha: 1, y: 0, duration: 1.0 }, "-=0.7")
          .to(cta,      { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.6")
          .to(media,    { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power3.out" }, "-=1.1");
      }, el);
    };

    if (waitForLoader) {
      window.addEventListener("page-loader-complete", play, { once: true });
      const fallback = setTimeout(() => { if (!ctx) play(); }, 300);
      return () => {
        window.removeEventListener("page-loader-complete", play);
        clearTimeout(fallback);
        ctx?.revert();
      };
    } else {
      play();
      return () => ctx?.revert();
    }
  }, [containerRef, waitForLoader]);
}

/* ── 2. NAVBAR REVEAL ────────────────────────────────────────────────────────
 * Slides nav in from top after loader completes, then hides on scroll down.
 * Add class "nav-will-animate" (from animations.css) to avoid flash.
 * -------------------------------------------------------------------------- */
export function useNavbarReveal(navRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    let lastY = window.scrollY;
    let ctx: gsap.Context | undefined;

    const playIntro = () => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { yPercent: -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
        );
      });
    };

    window.addEventListener("page-loader-complete", playIntro, { once: true });
    const fallback = setTimeout(() => { if (!ctx) playIntro(); }, 300);

    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY && currentY > 80;
      gsap.to(el, {
        yPercent: goingDown ? -100 : 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      lastY = currentY;
    };

    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("page-loader-complete", playIntro);
      clearTimeout(fallback);
      const l = (window as any).lenis;
      if (l) { l.off("scroll", onScroll); }
      else   { window.removeEventListener("scroll", onScroll); }
      ctx?.revert();
    };
  }, [navRef]);
}

/* ── 3. STAGGER TEXT ─────────────────────────────────────────────────────────
 * Splits existing text into words/chars and reveals them on scroll.
 * Does NOT change text content, font, size, or color.
 * -------------------------------------------------------------------------- */
export function useStaggerText(
  textRef: RefObject<HTMLElement | null>,
  { type = "words", start = "top 85%" }: { type?: "words" | "chars" | "lines"; start?: string } = {}
) {
  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    const originalHTML = el.innerHTML;

    const splitToSpans = () => {
      const text = el.textContent ?? "";
      const pieces = type === "chars" ? text.split("") : text.split(" ");
      el.innerHTML = pieces
        .map((piece) => {
          const content = piece === "" ? "&nbsp;" : piece;
          return `<span class="stagger-line-mask"><span class="stagger-piece" style="display:inline-block;">${content}${
            type === "words" ? "&nbsp;" : ""
          }</span></span>`;
        })
        .join("");
      return el.querySelectorAll(".stagger-piece");
    };

    const pieces = splitToSpans();

    const ctx = gsap.context(() => {
      gsap.set(pieces, { yPercent: 110, autoAlpha: 0 });
      gsap.to(pieces, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: type === "chars" ? 0.02 : 0.06,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.innerHTML = originalHTML;
    };
  }, [textRef, type, start]);
}

/* ── 4. SCROLL REVEAL ────────────────────────────────────────────────────────
 * Generic fade + rise on viewport entry.
 * -------------------------------------------------------------------------- */
export function useScrollReveal(
  elRef: RefObject<HTMLElement | null>,
  { y = 60, duration = 1, delay = 0, start = "top 85%" }: {
    y?: number; duration?: number; delay?: number; start?: string;
  } = {}
) {
  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1, y: 0, duration, delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, toggleActions: "play none none reverse" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [elRef, y, duration, delay, start]);
}

/* ── 5. IMAGE REVEAL ─────────────────────────────────────────────────────────
 * Clip-path wipe + scale settle.
 * Wrap the <img> with className="image-reveal-wrapper".
 * -------------------------------------------------------------------------- */
export function useImageReveal(
  wrapperRef: RefObject<HTMLElement | null>,
  { start = "top 80%" }: { start?: string } = {}
) {
  useEffect(() => {
    if (!wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const img = wrapper.querySelector("img");
    if (!img) return;

    const ctx = gsap.context(() => {
      gsap.set(wrapper, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(img, { scale: 1.25 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start, toggleActions: "play none none reverse" },
      });
      tl.to(wrapper, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.inOut" })
        .to(img, { scale: 1, duration: 1.6, ease: "power3.out" }, "-=0.9");
    }, wrapper);

    return () => ctx.revert();
  }, [wrapperRef, start]);
}

/* ── 6. CARD HOVER (tilt + lift) ─────────────────────────────────────────────
 * Apple/Porsche-style 3D responsive hover.
 * Add className="card-hover-perspective" to the card's parent.
 * -------------------------------------------------------------------------- */
export function useCardHover(
  cardRef: RefObject<HTMLElement | null>,
  { maxTilt = 8, lift = -8 }: { maxTilt?: number; lift?: number } = {}
) {
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    const quickX     = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const quickY     = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const quickLift  = gsap.quickTo(el, "y",         { duration: 0.5, ease: "power3.out" });
    const quickScale = gsap.quickTo(el, "scale",     { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
      quickX(px * maxTilt * 2);
      quickY(-py * maxTilt * 2);
      quickLift(lift);
      quickScale(1.02);
    };

    const onLeave = () => { quickX(0); quickY(0); quickLift(0); quickScale(1); };

    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [cardRef, maxTilt, lift]);
}

/* ── 7. CTA MAGNETIC HOVER ───────────────────────────────────────────────────
 * Button follows cursor slightly + scale press feedback.
 * -------------------------------------------------------------------------- */
export function useCTAMagnetic(
  ctaRef: RefObject<HTMLElement | null>,
  { strength = 0.35 }: { strength?: number } = {}
) {
  useEffect(() => {
    if (!ctaRef.current) return;
    const el = ctaRef.current;

    const quickX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove  = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      quickX((e.clientX - (rect.left + rect.width  / 2)) * strength);
      quickY((e.clientY - (rect.top  + rect.height / 2)) * strength);
    };
    const onLeave = () => { quickX(0); quickY(0); };
    const onDown  = () => gsap.to(el, { scale: 0.94, duration: 0.15, ease: "power2.out" });
    const onUp    = () => gsap.to(el, { scale: 1,    duration: 0.3,  ease: "back.out(3)" });

    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown",  onDown);
    el.addEventListener("mouseup",    onUp);

    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown",  onDown);
      el.removeEventListener("mouseup",    onUp);
    };
  }, [ctaRef, strength]);
}

/* ── 8. SECTION TRANSITION ───────────────────────────────────────────────────
 * Parallax + gentle scale as section scrolls into view.
 * -------------------------------------------------------------------------- */
export function useSectionTransition(
  sectionRef: RefObject<HTMLElement | null>,
  { parallax = 60 }: { parallax?: number } = {}
) {
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0.4, scale: 0.98, y: parallax },
        {
          autoAlpha: 1, scale: 1, y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el, start: "top bottom", end: "top center", scrub: 1,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [sectionRef, parallax]);
}

/* ── UTILITY: refresh ScrollTrigger after fonts/images load ──────────────── */
export function useScrollTriggerRefreshOnLoad() {
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
}
