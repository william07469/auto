import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { BeforeAfterSection } from "@/components/site/BeforeAfterSection";
import { Statistics } from "@/components/site/Statistics";
import { Pricing } from "@/components/site/Pricing";
import { Extras } from "@/components/site/Extras";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "WV Detailing — Perfektion bis ins kleinste Detail" },
      {
        name: "description",
        content:
          "Premium Fahrzeugaufbereitung in Deutschland. Keramikversiegelung, Lackkorrektur, Innenreinigung. Jetzt Termin online buchen.",
      },
      { property: "og:title", content: "WV Detailing — Perfektion bis ins kleinste Detail" },
      { property: "og:image", content: hero },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoDetailing",
          name: "WV Detailing",
          description: "Premium Fahrzeugaufbereitung in Deutschland.",
          areaServed: "Deutschland",
          telephone: "+49 177 8452 138",
          url: "https://wv-detailing.de",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Musterstraße 12",
            postalCode: "40213",
            addressLocality: "Düsseldorf",
            addressCountry: "DE",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "240",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "19:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "17:00" },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Statistics />
        <Services />
        <BeforeAfterSection />
        <Pricing />
        <Extras />
        <Gallery />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
