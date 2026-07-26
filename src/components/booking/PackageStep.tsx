import React, { useEffect, useRef, useState } from "react";
import { ServiceId, PackageId, IndividualServiceId, BookingMode } from "./types";
import { PACKAGES_DATA, INDIVIDUAL_SERVICES } from "./bookingData";
import {
  Check, Clock, Layers, ListChecks,
  Car, Armchair, Sparkles, ShieldCheck, Gauge, Droplets, Circle, Wind,
} from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedServiceId: ServiceId;
  selectedPackageId: PackageId | null;
  selectedIndividualServiceId: IndividualServiceId | null;
  bookingMode: BookingMode | null;
  onSelectPackage: (id: PackageId) => void;
  onSelectIndividualService: (id: IndividualServiceId) => void;
  onSetBookingMode: (mode: BookingMode) => void;
}

const INDIVIDUAL_ICONS: Record<string, React.ReactNode> = {
  Car: <Car className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Gauge: <Gauge className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Circle: <Circle className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
};

const TAB_STYLE_BASE: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem 1rem",
  borderRadius: "0.6rem",
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  border: "none",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
};

export const PackageStep: React.FC<Props> = ({
  selectedServiceId,
  selectedPackageId,
  selectedIndividualServiceId,
  bookingMode,
  onSelectPackage,
  onSelectIndividualService,
  onSetBookingMode,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const packages = PACKAGES_DATA[selectedServiceId] ?? [];

  // Default to "package" tab if nothing chosen yet
  const activeTab: BookingMode = bookingMode ?? "package";

  const switchTab = (mode: BookingMode) => {
    if (mode === activeTab) return;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, y: -8, duration: 0.15, ease: "power2.in",
        onComplete: () => {
          onSetBookingMode(mode);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
          );
        },
      });
    } else {
      onSetBookingMode(mode);
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".pkg-card, .ind-card"),
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
  }, [selectedServiceId, activeTab]);

  return (
    <div ref={ref} className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        >
          Schritt 2
        </p>
        <h3
          style={{
            fontSize: "clamp(1.6rem,3.5vw,2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Paket oder Einzelleistung?
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            maxWidth: 480,
          }}
        >
          Wählen Sie ein Komplettpaket oder buchen Sie gezielt eine einzelne Leistung.
        </p>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 5,
          borderRadius: "0.75rem",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          type="button"
          style={{
            ...TAB_STYLE_BASE,
            background: activeTab === "package" ? "#fff" : "transparent",
            color: activeTab === "package" ? "#000" : "rgba(255,255,255,0.4)",
          }}
          onClick={() => switchTab("package")}
        >
          <Layers style={{ width: 14, height: 14 }} />
          Paket buchen
        </button>
        <button
          type="button"
          style={{
            ...TAB_STYLE_BASE,
            background: activeTab === "individual" ? "#fff" : "transparent",
            color: activeTab === "individual" ? "#000" : "rgba(255,255,255,0.4)",
          }}
          onClick={() => switchTab("individual")}
        >
          <ListChecks style={{ width: 14, height: 14 }} />
          Einzelleistung
        </button>
      </div>

      {/* Tab content */}
      <div ref={contentRef}>
        {activeTab === "package" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg, idx) => {
              const selected = bookingMode === "package" && selectedPackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    onSetBookingMode("package");
                    onSelectPackage(pkg.id);
                  }}
                  className="pkg-card text-left flex flex-col"
                  style={{
                    borderRadius: "1rem",
                    border: selected
                      ? "2px solid #fff"
                      : "1.5px solid rgba(255,255,255,0.1)",
                    background: selected ? "#fff" : "#141414",
                    boxShadow: selected
                      ? "0 6px 28px rgba(255,255,255,0.08)"
                      : "none",
                    transition: "all 0.22s ease",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Recommended bar */}
                  {pkg.recommended && (
                    <div
                      style={{
                        background: selected ? "rgba(0,0,0,0.08)" : "#fff",
                        padding: "0.45rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: selected ? "#374151" : "#111827",
                        }}
                      >
                        Empfohlen
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "1.5rem",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Tier */}
                    <p
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: selected ? "#6b7280" : "rgba(255,255,255,0.3)",
                        marginBottom: 6,
                      }}
                    >
                      Stufe 0{idx + 1}
                    </p>

                    {/* Name */}
                    <h4
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: selected ? "#111827" : "#fff",
                        marginBottom: 3,
                      }}
                    >
                      {pkg.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                        color: selected ? "#9ca3af" : "rgba(255,255,255,0.3)",
                        marginBottom: 12,
                      }}
                    >
                      {pkg.tagline}
                    </p>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: selected ? "#6b7280" : "rgba(255,255,255,0.4)",
                        lineHeight: 1.6,
                        marginBottom: "1.1rem",
                      }}
                    >
                      {pkg.description}
                    </p>

                    {/* Features */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        flex: 1,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {pkg.features.map((feat, fi) => (
                        <li
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            fontSize: "0.78rem",
                            color: selected ? "#374151" : "rgba(255,255,255,0.5)",
                            padding: "5px 0",
                            borderBottom: selected
                              ? "1px solid rgba(0,0,0,0.06)"
                              : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <Check
                            style={{
                              width: 13,
                              height: 13,
                              flexShrink: 0,
                              marginTop: 2,
                              color: selected
                                ? "#374151"
                                : "rgba(255,255,255,0.4)",
                              strokeWidth: 2.5,
                            }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Price row */}
                    <div
                      style={{
                        paddingTop: "1rem",
                        borderTop: selected
                          ? "1px solid rgba(0,0,0,0.08)"
                          : "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.58rem",
                            fontWeight: 600,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: selected
                              ? "#9ca3af"
                              : "rgba(255,255,255,0.25)",
                            marginBottom: 2,
                          }}
                        >
                          Ab
                        </p>
                        <span
                          style={{
                            fontSize: "1.75rem",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            fontFamily: "monospace",
                            color: selected ? "#111827" : "#fff",
                          }}
                        >
                          €{pkg.price}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.7rem",
                          color: selected
                            ? "#9ca3af"
                            : "rgba(255,255,255,0.3)",
                        }}
                      >
                        <Clock style={{ width: 12, height: 12 }} />
                        <span style={{ fontFamily: "monospace" }}>
                          {pkg.duration}
                        </span>
                      </div>
                    </div>

                    {/* Select indicator */}
                    <div
                      style={{
                        marginTop: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: selected ? "#111827" : "transparent",
                          border: selected
                            ? "none"
                            : "1.5px solid rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {selected && (
                          <Check
                            style={{
                              width: 11,
                              height: 11,
                              color: "#fff",
                              strokeWidth: 3,
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: selected
                            ? "#374151"
                            : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {selected ? "Ausgewählt" : "Auswählen"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "individual" && (
          <div
            style={{
              borderRadius: "1rem",
              border: "1.5px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              background: "#141414",
            }}
          >
            {INDIVIDUAL_SERVICES.map((svc, idx) => {
              const selected =
                bookingMode === "individual" &&
                selectedIndividualServiceId === svc.id;
              const isLast = idx === INDIVIDUAL_SERVICES.length - 1;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    onSetBookingMode("individual");
                    onSelectIndividualService(svc.id);
                  }}
                  className="ind-card w-full text-left"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.1rem 1.25rem",
                    background: selected
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "background 0.18s ease",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: selected
                        ? "none"
                        : "1.5px solid rgba(255,255,255,0.2)",
                      background: selected ? "#fff" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {selected && (
                      <Check
                        style={{
                          width: 12,
                          height: 12,
                          color: "#000",
                          strokeWidth: 3,
                        }}
                      />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "0.55rem",
                      background: selected
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.05)",
                      border: "1px solid",
                      borderColor: selected
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: selected ? "#fff" : "rgba(255,255,255,0.4)",
                      flexShrink: 0,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {INDIVIDUAL_ICONS[svc.iconName] ?? (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <h5
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                          color: selected ? "#fff" : "rgba(255,255,255,0.75)",
                        }}
                      >
                        {svc.name}
                      </h5>
                      {svc.badge && (
                        <span
                          style={{
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            padding: "2px 7px",
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.4)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.35)",
                        lineHeight: 1.5,
                      }}
                    >
                      {svc.description}
                    </p>
                  </div>

                  {/* Price + duration */}
                  <div
                    style={{ flexShrink: 0, textAlign: "right" }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "1rem",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        letterSpacing: "-0.02em",
                        color: selected ? "#fff" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      ab €{svc.price}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 3,
                        fontSize: "0.62rem",
                        color: "rgba(255,255,255,0.25)",
                        marginTop: 2,
                      }}
                    >
                      <Clock style={{ width: 10, height: 10 }} />
                      {svc.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeTab === "individual" && (
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
          Wählen Sie genau eine Leistung aus. Zusätze können im nächsten Schritt hinzugefügt werden.
        </p>
      )}
    </div>
  );
};
