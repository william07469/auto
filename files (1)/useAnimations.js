// hooks/useAnimations.js
//
// A set of small, composable hooks. Attach a `ref` to your EXISTING
// elements (no new markup/classes required except where noted) and call
// the matching hook. None of these hooks change layout, color, spacing,
// or content — they only apply transforms/opacity via GSAP, which are
// compositor-only properties and don't reflow your page.
//
// WHERE TO PLACE: put this whole file at hooks/useAnimations.js.
// Import individual hooks where needed, e.g.:
//   import { useHeroEntrance, useStaggerText } from "@/hooks/useAnimations";

"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";

/* -------------------------------------------------------------------------
 * 1. HERO ENTRANCE
 * WHERE: your Hero section component, e.g. components/Hero.jsx
 *
 *   const heroRef = useRef(null);
 *   useHeroEntrance(heroRef);
 *   return (
 *     <section ref={heroRef}>
 *       <h1 data-hero="title">Existing headline...</h1>
 *       <p data-hero="subtitle">Existing subcopy...</p>
 *       <a data-hero="cta" href="#">Existing CTA button</a>
 *       <div data-hero="media">Existing hero image/video</div>
 *     </section>
 *   );
 *
 * Only add the `data-hero="..."` attributes to elements that already
 * exist in your markup — no wrapping divs, no style changes.
 * ---------------------------------------------------------------------- */
export function useHeroEntrance(containerRef, { waitForLoader = true } = {}) {
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const title = el.querySelectorAll('[data-hero="title"]');
    const subtitle = el.querySelectorAll('[data-hero="subtitle"]');
    const cta = el.querySelectorAll('[data-hero="cta"]');
    const media = el.querySelectorAll('[data-hero="media"]');

    let ctx;

    const play = () => {
      ctx = gsap.context(() => {
        gsap.set([title, subtitle, cta], { autoAlpha: 0, y: 40 });
        gsap.set(media, { autoAlpha: 0, scale: 1.08 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(title, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 })
          .to(subtitle, { autoAlpha: 1, y: 0, duration: 1 }, "-=0.7")
          .to(cta, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.6")
          .to(media, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power3.out" }, "-=1.1");
      }, el);
    };

    if (waitForLoader) {
      // Fires the moment PageLoader finishes its wipe, so the two never race.
      window.addEventListener("page-loader-complete", play, { once: true });
      // Fallback: if there's no PageLoader mounted, play after a tick.
      const fallback = setTimeout(() => {
        if (!ctx) play();
      }, 300);
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

/* -------------------------------------------------------------------------
 * 2. NAVBAR REVEAL (entrance + hide-on-scroll-down / show-on-scroll-up)
 * WHERE: your existing Navbar component, e.g. components/Navbar.jsx
 *
 *   const navRef = useRef(null);
 *   useNavbarReveal(navRef);
 *   return <nav ref={navRef} className="nav-will-animate">...</nav>;
 *
 * Add the `nav-will-animate` class (from animations.css) to avoid a flash
 * before JS attaches — it only sets `will-change`, nothing visual.
 * ---------------------------------------------------------------------- */
export function useNavbarReveal(navRef) {
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    let lastY = window.scrollY;
    let ctx;

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
    const fallback = setTimeout(() => {
      if (!ctx) playIntro();
    }, 300);

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

    // Use Lenis scroll event if available (keeps it in sync with smooth
    // scrolling), otherwise fall back to the native scroll event.
    if (window.lenis) {
      window.lenis.on("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("page-loader-complete", playIntro);
      clearTimeout(fallback);
      if (window.lenis) {
        window.lenis.off("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
      }
      ctx?.revert();
    };
  }, [navRef]);
}

/* -------------------------------------------------------------------------
 * 3. STAGGER TEXT (splits existing text into lines/words and reveals them)
 * WHERE: any heading/paragraph you already have, e.g. section titles.
 *
 *   const titleRef = useRef(null);
 *   useStaggerText(titleRef, { type: "words" }); // or "chars" or "lines"
 *   return <h2 ref={titleRef}>Your existing heading text, unchanged</h2>;
 *
 * This does NOT change the text content, font, size, or color — it only
 * temporarily wraps each word/char in an inline span to animate it, then
 * the visible result reads identically to your original text.
 * ---------------------------------------------------------------------- */
export function useStaggerText(textRef, { type = "words", start = "top 85%" } = {}) {
  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    const originalHTML = el.innerHTML;

    const splitToSpans = () => {
      const text = el.textContent;
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

/* -------------------------------------------------------------------------
 * 4. GENERIC SCROLL REVEAL (fade + rise on enter viewport)
 * WHERE: any existing section, card, or block you want to reveal on scroll.
 *
 *   const boxRef = useRef(null);
 *   useScrollReveal(boxRef);
 *   return <div ref={boxRef}>Existing content, untouched</div>;
 * ---------------------------------------------------------------------- */
export function useScrollReveal(
  elRef,
  { y = 60, duration = 1, delay = 0, start = "top 85%" } = {}
) {
  useEffect(() => {
    if (!elRef.current) return;
    const el = elRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [elRef, y, duration, delay, start]);
}

/* -------------------------------------------------------------------------
 * 5. IMAGE REVEAL (clip-path wipe + subtle scale settle)
 * WHERE: wrap ONLY the <img> tag (not the whole layout) with the
 * `.image-reveal-wrapper` class from animations.css. This wrapper is a
 * plain <div> that inherits the image's box — it does not change where
 * the image sits in your layout.
 *
 *   const imgWrapRef = useRef(null);
 *   useImageReveal(imgWrapRef);
 *   return (
 *     <div ref={imgWrapRef} className="image-reveal-wrapper">
 *       <img src="/your-existing-image.jpg" alt="..." />
 *     </div>
 *   );
 * ---------------------------------------------------------------------- */
export function useImageReveal(wrapperRef, { start = "top 80%" } = {}) {
  useEffect(() => {
    if (!wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const img = wrapper.querySelector("img");
    if (!img) return;

    const ctx = gsap.context(() => {
      gsap.set(wrapper, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(img, { scale: 1.25 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start,
          toggleActions: "play none none reverse",
        },
      });
      tl.to(wrapper, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.inOut" }).to(
        img,
        { scale: 1, duration: 1.6, ease: "power3.out" },
        "-=0.9"
      );
    }, wrapper);

    return () => ctx.revert();
  }, [wrapperRef, start]);
}

/* -------------------------------------------------------------------------
 * 6. CARD HOVER (tilt + lift, Apple/Porsche-style responsive hover)
 * WHERE: any existing card component. Add the `.card-hover-perspective`
 * class to the card's immediate PARENT (or the card itself) so the tilt
 * has a 3D perspective to rotate within — this class only sets a CSS
 * `perspective` value and has no other visual effect.
 *
 *   const cardRef = useRef(null);
 *   useCardHover(cardRef);
 *   return (
 *     <div className="card-hover-perspective">
 *       <div ref={cardRef}>Existing card content, unchanged</div>
 *     </div>
 *   );
 * ---------------------------------------------------------------------- */
export function useCardHover(cardRef, { maxTilt = 8, lift = -8 } = {}) {
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    const quickX = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const quickLift = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const quickScale = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      quickX(px * maxTilt * 2);
      quickY(-py * maxTilt * 2);
      quickLift(lift);
      quickScale(1.02);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
      quickLift(0);
      quickScale(1);
    };

    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [cardRef, maxTilt, lift]);
}

/* -------------------------------------------------------------------------
 * 7. CTA MAGNETIC HOVER (button follows cursor slightly + scale press)
 * WHERE: any existing CTA button/link.
 *
 *   const ctaRef = useRef(null);
 *   useCTAMagnetic(ctaRef);
 *   return <a ref={ctaRef} href="#">Existing button, unchanged</a>;
 * ---------------------------------------------------------------------- */
export function useCTAMagnetic(ctaRef, { strength = 0.35 } = {}) {
  useEffect(() => {
    if (!ctaRef.current) return;
    const el = ctaRef.current;

    const quickX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    const onDown = () => gsap.to(el, { scale: 0.94, duration: 0.15, ease: "power2.out" });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
    };
  }, [ctaRef, strength]);
}

/* -------------------------------------------------------------------------
 * 8. SMOOTH SECTION TRANSITION (parallax + gentle scale between sections)
 * WHERE: wrap each existing <section> ref — no new elements needed beyond
 * the ref itself.
 *
 *   const sectionRef = useRef(null);
 *   useSectionTransition(sectionRef);
 *   return <section ref={sectionRef}>Existing section, unchanged</section>;
 * ---------------------------------------------------------------------- */
export function useSectionTransition(sectionRef, { parallax = 60 } = {}) {
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0.4, scale: 0.98, y: parallax },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [sectionRef, parallax]);
}

/* -------------------------------------------------------------------------
 * Utility: call once (e.g. in a top-level layout client component) to
 * refresh ScrollTrigger measurements after fonts/images finish loading,
 * preventing mistimed trigger points on the very first paint.
 * ---------------------------------------------------------------------- */
export function useScrollTriggerRefreshOnLoad() {
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
}
