# Premium Animation Layer — Integration Guide

This kit adds **only motion** on top of your existing site. Nothing here
changes layout, colors, typography, spacing, sections, or content — every
hook attaches to a `ref` on an element you already have and animates
`transform`/`opacity`/`clip-path` (compositor-only properties), so your
design is pixel-identical when JS is disabled or before animations run.

## 1. Install dependencies

```bash
npm install gsap lenis
```

(`lenis` is the current package name — formerly published as
`@studio-freight/lenis`. If your lockfile already has the old package,
either works; the import in `SmoothScrollProvider.jsx` uses `"lenis"`.)

## 2. File placement

Copy these files into your project exactly at these paths (adjust the
`@/` alias if your `jsconfig.json`/`tsconfig.json` uses a different one):

```
lib/gsapConfig.js
components/SmoothScrollProvider.jsx
components/PageLoader.jsx
hooks/useAnimations.js
styles/animations.css
```

## 3. Wire up the root layout

In `app/layout.js` (App Router) or `pages/_app.js` (Pages Router):

```jsx
import "./globals.css";
import "@/styles/animations.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PageLoader from "@/components/PageLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <PageLoader />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

That single change gives you: Lenis smooth scrolling site-wide, and the
cinematic loader on first paint. Nothing else in your app needs to change
for these two.

## 4. Wire up each animation to your existing components

None of the steps below require restructuring markup — only add a `ref`
(and, in two cases, an existing-element `data-*` attribute or utility
class that carries no visual styling of its own).

### Hero entrance
`components/Hero.jsx` (or wherever your hero section lives):

```jsx
"use client";
import { useRef } from "react";
import { useHeroEntrance } from "@/hooks/useAnimations";

export default function Hero() {
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  return (
    <section ref={heroRef}>
      <h1 data-hero="title">Your existing headline</h1>
      <p data-hero="subtitle">Your existing subheading</p>
      <a data-hero="cta" href="#contact">Your existing CTA</a>
      <div data-hero="media">
        <img src="/hero.jpg" alt="" />
      </div>
    </section>
  );
}
```

### Navbar reveal
`components/Navbar.jsx`:

```jsx
"use client";
import { useRef } from "react";
import { useNavbarReveal } from "@/hooks/useAnimations";

export default function Navbar() {
  const navRef = useRef(null);
  useNavbarReveal(navRef);
  return (
    <nav ref={navRef} className="nav-will-animate">
      {/* your existing nav content, unchanged */}
    </nav>
  );
}
```

### Stagger text (headings/paragraphs)
Any section heading, e.g. `components/About.jsx`:

```jsx
"use client";
import { useRef } from "react";
import { useStaggerText } from "@/hooks/useAnimations";

export default function About() {
  const titleRef = useRef(null);
  useStaggerText(titleRef, { type: "words" }); // or { type: "chars" }
  return <h2 ref={titleRef}>Your existing section title</h2>;
}
```

### CTA hover animation
Any button/link:

```jsx
"use client";
import { useRef } from "react";
import { useCTAMagnetic } from "@/hooks/useAnimations";

const ctaRef = useRef(null);
useCTAMagnetic(ctaRef);
<a ref={ctaRef} href="#pricing">Book a demo</a>
```

### Image reveal
Wrap only the `<img>` (not surrounding layout) with the existing utility class:

```jsx
"use client";
import { useRef } from "react";
import { useImageReveal } from "@/hooks/useAnimations";

const imgWrapRef = useRef(null);
useImageReveal(imgWrapRef);

<div ref={imgWrapRef} className="image-reveal-wrapper">
  <img src="/product.jpg" alt="" />
</div>
```

### Scroll reveal (generic, for any block/section)

```jsx
"use client";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useAnimations";

const blockRef = useRef(null);
useScrollReveal(blockRef);
<div ref={blockRef}>Your existing content block</div>
```

### Card hover animation
Wrap the card's parent (or the card itself) with `.card-hover-perspective`:

```jsx
"use client";
import { useRef } from "react";
import { useCardHover } from "@/hooks/useAnimations";

const cardRef = useRef(null);
useCardHover(cardRef);

<div className="card-hover-perspective">
  <div ref={cardRef} className="your-existing-card-class">
    {/* existing card content, unchanged */}
  </div>
</div>
```

### Smooth section transitions
Apply to each `<section>` you want a parallax/settle effect on as you scroll into it:

```jsx
"use client";
import { useRef } from "react";
import { useSectionTransition } from "@/hooks/useAnimations";

const sectionRef = useRef(null);
useSectionTransition(sectionRef);
<section ref={sectionRef}>Existing section content</section>
```

### Fix first-load mistiming (recommended, once)
In your top-level client wrapper (e.g. `SmoothScrollProvider.jsx` — you can
add this line inside it, or in any single client component that mounts once):

```js
import { useScrollTriggerRefreshOnLoad } from "@/hooks/useAnimations";
useScrollTriggerRefreshOnLoad();
```

## 5. Notes on approach

- **Everything is additive.** Every hook only reads a `ref` you attach to
  markup you already have; nothing renders new DOM except: the loader's
  overlay (fixed-position, removed after use), and the `.image-reveal-wrapper`
  div you optionally add around an `<img>` for the clip-path effect.
- **Cleanup is automatic.** Every hook uses `gsap.context()` and reverts
  itself on unmount, and `ScrollTrigger` instances are cleaned up alongside
  it — no animation leaks across route changes.
- **Respects reduced motion:** if you want to honor
  `prefers-reduced-motion`, wrap each hook's internals in a check against
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and skip
  straight to the final visual state. Happy to add this automatically to
  every hook if you'd like — let me know.
- **Performance:** all animated properties (`x`, `y`, `scale`, `rotationX/Y`,
  `opacity`/`autoAlpha`, `clip-path`) are compositor-friendly and avoid
  layout thrash, which keeps this smooth even on the "premium heavy scroll"
  sections (parallax, pinned transitions).
