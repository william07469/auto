import React, { useEffect, useRef } from "react";
import { ServiceId, QuestionAnswer } from "./types";
import { SERVICE_QUESTIONS } from "./bookingData";
import {
  Car, Armchair, Star, Sparkles, ShieldCheck,
  Search, Check, AlertCircle, XCircle, X, Droplets,
  Layers, Dog, Minus, Sun, HelpCircle, Clock,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";

interface Props {
  selectedServiceId: ServiceId;
  answers: QuestionAnswer[];
  onAnswer: (questionId: string, answerId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Car: <Car className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Check: <Check className="w-5 h-5" />,
  CheckCircle: <CheckCircle className="w-5 h-5" />,
  AlertCircle: <AlertCircle className="w-5 h-5" />,
  XCircle: <XCircle className="w-5 h-5" />,
  X: <X className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Dog: <Dog className="w-5 h-5" />,
  Minus: <Minus className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Circle: <Circle className="w-5 h-5" />,
};

export const ServiceQuestionsStep: React.FC<Props> = ({
  selectedServiceId,
  answers,
  onAnswer,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const questions = SERVICE_QUESTIONS[selectedServiceId] ?? [];

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".question-block"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power3.out" }
    );
  }, [selectedServiceId]);

  const getAnswer = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.answerId ?? null;

  return (
    <div ref={ref} className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          Step 03
        </p>
        <h3
          style={{
            fontSize: "clamp(1.8rem,4vw,2.8rem)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "#fff",
          }}
        >
          A few quick questions
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.38)",
            maxWidth: 420,
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          These help us prepare the right products and allocate enough time for your vehicle.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-10">
        {questions.map((q) => {
          const currentAnswer = getAnswer(q.id);
          return (
            <div key={q.id} className="question-block space-y-4">
              {/* Question label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.45)",
                    flexShrink: 0,
                  }}
                >
                  {ICON_MAP[q.iconName]}
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {q.question}
                </h4>
              </div>

              {/* Answer options */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(q.options.length, 3)}, 1fr)`,
                  gap: "0.75rem",
                  paddingLeft: "2.75rem",
                }}
                className="grid-cols-1 sm:grid-flow-col"
              >
                {q.options.map((opt) => {
                  const chosen = currentAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onAnswer(q.id, opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "0.9rem 1.1rem",
                        borderRadius: "0.75rem",
                        border: chosen
                          ? "1px solid rgba(255,255,255,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                        background: chosen
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (!chosen) {
                          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.14)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!chosen) {
                          (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                        }
                      }}
                    >
                      {/* Option icon */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "0.45rem",
                          border: chosen
                            ? "1px solid rgba(255,255,255,0.25)"
                            : "1px solid rgba(255,255,255,0.08)",
                          background: chosen
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: chosen ? "#fff" : "rgba(255,255,255,0.3)",
                          flexShrink: 0,
                          transition: "all 0.28s",
                        }}
                      >
                        {ICON_MAP[opt.iconName] ?? <Circle className="w-4 h-4" />}
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: chosen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          transition: "color 0.28s",
                          flex: 1,
                        }}
                      >
                        {opt.label}
                      </span>

                      {/* Check dot */}
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: chosen ? "#fff" : "transparent",
                          border: chosen ? "none" : "1px solid rgba(255,255,255,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.28s",
                        }}
                      >
                        {chosen && (
                          <Check style={{ width: 9, height: 9, color: "#000", strokeWidth: 3 }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip note */}
      <p
        style={{
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.05em",
        }}
      >
        All questions are optional. You can skip by pressing{" "}
        <span style={{ color: "rgba(255,255,255,0.35)" }}>Continue</span> below.
      </p>
    </div>
  );
};

// Needed for the icon map fallback
function Circle(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
