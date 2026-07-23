import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import defaultHeroVideo from "@/assets/jeep.mp4";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const badgesRef    = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLAnchorElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(defaultHeroVideo);

  // Dynamic video source listener
  useEffect(() => {
    const updateSrc = () => {
      try {
        const stored = localStorage.getItem("wv_site_videos");
        if (stored) {
          const parsed = JSON.parse(stored);
          const heroVid = parsed.find((v: any) => v.id === "hero_video" || v.key === "hero_video");
          if (heroVid?.url && heroVid.url.trim()) {
            setVideoSrc(heroVid.url);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setVideoSrc(defaultHeroVideo);
    };

    updateSrc();
    window.addEventListener("site_videos_updated", updateSrc);
    return () => window.removeEventListener("site_videos_updated", updateSrc);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        videoRef.current,
        { scale: 1.14, opacity: 0, filter: "blur(12px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2.2 },
        0
      );

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4 },
        0.4
      );

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1 },
        0.8
      );

      const lines = headlineRef.current?.querySelectorAll(".line-inner");
      if (lines) {
        tl.fromTo(
          lines,
          { y: "105%", rotateX: 8 },
          { y: "0%", rotateX: 0, duration: 1.1, stagger: 0.09 },
          1.0
        );
      }

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1 },
        1.3
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 },
        1.5
      );

      tl.fromTo(
        badgesRef.current?.querySelectorAll(".badge-item") ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        1.7
      );

      tl.fromTo(
        scrollRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        2.0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [videoSrc]);

  // Scroll parallax
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        yPercent: 28,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to([eyebrowRef.current, headlineRef.current, subtitleRef.current, ctaRef.current, badgesRef.current], {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "20% top",
          end: "65% top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll indicator pulse
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bar = scrollRef.current?.querySelector(".scroll-bar-fill");
    if (!bar) return;

    const anim = gsap.fromTo(
      bar,
      { scaleY: 0, opacity: 1, transformOrigin: "top center" },
      {
        scaleY: 1,
        opacity: 0,
        duration: 1.6,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 0.3,
      }
    );
    return () => { anim.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-0"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero.jpg"
          className="h-full w-full object-cover will-change-transform"
          style={{ opacity: 0 }}
        />

        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/60 to-transparent" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.028] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: "200px 200px" }}
      />

      {/* Content */}
      <div className="container-lux relative z-10 pt-28 sm:pt-32 md:pt-0">
        <div
          ref={eyebrowRef}
          className="mb-8 flex items-center gap-4"
          style={{ opacity: 0 }}
        >
          <span className="h-px w-8 bg-muted-foreground/60" />
          <p className="text-eyebrow">Premium Fahrzeugaufbereitung · Deutschland</p>
        </div>

        <div
          ref={headlineRef}
          className="text-display text-[clamp(2.5rem,11vw,8.5rem)] leading-[0.9] max-w-[14ch]"
          style={{ perspective: "800px" }}
          aria-label="Perfektion bis ins kleinste Detail."
        >
          {["Perfektion", "bis ins kleinste", "Detail."].map((line, i) => (
            <div key={i} className="overflow-hidden" aria-hidden="true">
              <div
                className={`line-inner block${i === 2 ? " italic text-muted-foreground" : ""}`}
                style={{ transform: "translateY(105%)" }}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        <p
          ref={subtitleRef}
          className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:mt-8 md:text-lg"
          style={{ opacity: 0 }}
        >
          Handwerk, Präzision und Materialien auf höchstem Niveau —
          für Fahrzeuge, die das Beste verdienen.
        </p>

        <div
          ref={ctaRef}
          className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4"
          style={{ opacity: 0 }}
        >
          <Link
            to="/buchen"
            className="btn-primary hover:opacity-90 hover:scale-[0.98] active:scale-95 shadow-[0_8px_40px_rgba(255,255,255,0.08)]"
          >
            Termin buchen
          </Link>
          <a
            href="#leistungen"
            className="btn-secondary hover:border-foreground hover:bg-foreground/5"
          >
            Leistungen ansehen
          </a>
        </div>

        <div
          ref={badgesRef}
          className="mt-10 flex flex-wrap items-center gap-4 md:mt-14 md:gap-10"
          style={{ opacity: 0 }}
        >
          {[
            { value: "500+", label: "Zufriedene Kunden" },
            { value: "4.9★", label: "Google Bewertung" },
            { value: "10+", label: "Jahre Erfahrung" },
          ].map((b) => (
            <div key={b.label} className="badge-item flex items-center gap-3">
              <span className="text-display text-2xl">{b.value}</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground leading-tight max-w-[6rem]">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <a
        ref={scrollRef}
        href="#leistungen"
        aria-label="Nach unten scrollen"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors md:bottom-10"
        style={{ opacity: 0 }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <div className="scroll-bar-fill absolute inset-0 bg-foreground origin-top" />
        </div>
      </a>
    </section>
  );
}
