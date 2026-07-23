// components/PageLoader.jsx
//
// WHERE TO PLACE:
//   Render this at the very top of app/layout.js, as a sibling BEFORE
//   {children} (inside <SmoothScrollProvider>). It overlays the whole
//   viewport, counts up, then wipes away to reveal your existing page.
//   It does NOT alter your page's layout — it's a fixed-position overlay.
//
//   Example:
//
//     <SmoothScrollProvider>
//       <PageLoader />
//       {children}
//     </SmoothScrollProvider>
//
//   IMPORTANT: This dispatches a "page-loader-complete" CustomEvent on
//   `window` when it finishes, right before it disables scroll-lock.
//   Your Hero entrance hook (useHeroEntrance) listens for this event so
//   the hero animates in exactly when the loader wipes away, rather than
//   the two animations racing each other.

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";

export default function PageLoader() {
  const wrapperRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const panelTopRef = useRef(null);
  const panelBottomRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll while the loader plays.
    document.body.style.overflow = "hidden";

    const counterObj = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          window.dispatchEvent(new CustomEvent("page-loader-complete"));
          setIsDone(true);
        },
      });

      // Progress bar + counter climb together, artificially eased so it
      // never feels linear/robotic (classic Apple-keynote-style loader).
      tl.to(counterObj, {
        value: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(
              Math.floor(counterObj.value)
            ).padStart(3, "0");
          }
        },
      });

      tl.to(
        barRef.current,
        { scaleX: 1, duration: 2.1, ease: "power2.inOut", transformOrigin: "left center" },
        "<"
      );

      // Counter fades out just before the wipe.
      tl.to([counterRef.current, barRef.current], {
        opacity: 0,
        duration: 0.35,
        ease: "power1.in",
      });

      // Two-panel cinematic wipe reveal — top panel up, bottom panel down.
      tl.to(
        panelTopRef.current,
        { yPercent: -100, duration: 1.1, ease: "power4.inOut" },
        ">-0.1"
      );
      tl.to(
        panelBottomRef.current,
        { yPercent: 100, duration: 1.1, ease: "power4.inOut" },
        "<"
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        ref={panelTopRef}
        className="loader-panel loader-panel-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "var(--loader-bg, #0a0a0a)",
        }}
      />
      <div
        ref={panelBottomRef}
        className="loader-panel loader-panel-bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "var(--loader-bg, #0a0a0a)",
        }}
      />

      <div className="loader-center">
        <span ref={counterRef} className="loader-counter">
          000
        </span>
        <div className="loader-bar-track">
          <div ref={barRef} className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
