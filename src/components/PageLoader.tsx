// components/PageLoader.tsx
// Full-screen cinematic loader: counts 000→100, wipes away with a
// two-panel split revealing the page beneath.
// Dispatches "page-loader-complete" on window when done so Hero and Nav
// entrance animations start at exactly the right moment.

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";

export function PageLoader() {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLSpanElement>(null);
  const barRef        = useRef<HTMLDivElement>(null);
  const panelTopRef   = useRef<HTMLDivElement>(null);
  const panelBottomRef= useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

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

      // Progress bar + counter climb together
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

      // Counter + bar fade just before the wipe
      tl.to([counterRef.current, barRef.current], {
        opacity: 0,
        duration: 0.35,
        ease: "power1.in",
      });

      // Two-panel cinematic wipe — top up, bottom down
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
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      {/* Top panel */}
      <div
        ref={panelTopRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "50%",
          background: "var(--loader-bg, #0a0a0a)",
        }}
      />

      {/* Bottom panel */}
      <div
        ref={panelBottomRef}
        style={{
          position: "absolute", bottom: 0, left: 0,
          width: "100%", height: "50%",
          background: "var(--loader-bg, #0a0a0a)",
        }}
      />

      {/* Counter + bar */}
      <div className="loader-center">
        <span ref={counterRef} className="loader-counter">000</span>
        <div className="loader-bar-track">
          <div ref={barRef} className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
