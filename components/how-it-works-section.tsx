"use client"

import { PenLine, Sparkles, Send, ArrowRight, CheckCircle2 } from "lucide-react"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Define Your Target",
    description: "Tell us who you're reaching out to, your purpose, and what makes you stand out. Just 3 simple inputs.",
    color: "blue",
    preview: {
      label: "Input Preview",
      items: ["Recipient: CTO at fintech startup", "Purpose: Internship", "Your edge: Built 3 React projects"],
    },
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Generates Variants",
    description: "Our engine analyzes your intent and instantly crafts three distinct email styles — formal, casual, and bold.",
    color: "purple",
    preview: {
      label: "Processing",
      items: ["Analyzing tone & context...", "Generating formal variant...", "Generating casual variant..."],
    },
  },
  {
    icon: Send,
    step: "03",
    title: "Pick & Send",
    description: "Review all three variants side by side. Copy the one that resonates best and send it off with confidence.",
    color: "emerald",
    preview: {
      label: "Ready",
      items: ["Formal: 94% match", "Casual: 87% match", "Bold: 91% match"],
    },
  },
]

const colorMap = {
  blue: {
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconText: "text-blue-400",
    numberBg: "bg-blue-500/10 text-blue-400",
    dotBg: "bg-blue-400",
    lineBg: "from-blue-500/50",
    cardGlow: "group-hover:shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)]",
    accent: "group-hover:border-blue-500/20",
    previewDot: "bg-blue-400",
  },
  purple: {
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconText: "text-purple-400",
    numberBg: "bg-purple-500/10 text-purple-400",
    dotBg: "bg-purple-400",
    lineBg: "from-purple-500/50",
    cardGlow: "group-hover:shadow-[0_0_80px_-20px_rgba(168,85,247,0.15)]",
    accent: "group-hover:border-purple-500/20",
    previewDot: "bg-purple-400",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconText: "text-emerald-400",
    numberBg: "bg-emerald-500/10 text-emerald-400",
    dotBg: "bg-emerald-400",
    lineBg: "from-emerald-500/50",
    cardGlow: "group-hover:shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)]",
    accent: "group-hover:border-emerald-500/20",
    previewDot: "bg-emerald-400",
  },
}

export function HowItWorksSection() {
  const container = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useGSAP(() => {
    // Section title animation
    gsap.fromTo(".hiw-title",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: ".hiw-title", start: "top 85%" }
      }
    );

    gsap.fromTo(".hiw-subtitle",
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".hiw-subtitle", start: "top 85%" }
      }
    );

    // Staggered card reveal
    gsap.utils.toArray<HTMLElement>(".step-card").forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });

    // Connecting lines animation
    gsap.utils.toArray<HTMLElement>(".connect-line").forEach((line) => {
      gsap.fromTo(line,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
          }
        }
      );
    });

  }, { scope: container });

  return (
    <section id="how-it-works" ref={container} className="relative py-32 sm:py-40 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-white/[0.015] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <ArrowRight className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/50">How It Works</span>
          </div>
          <h2 className="hiw-title text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-5 tracking-tight">
            Three Steps.<br className="sm:hidden" /> Zero Friction.
          </h2>
          <p className="hiw-subtitle text-lg sm:text-xl text-white/35 max-w-xl mx-auto font-light">
            From blank page to inbox-ready email in under 30 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting lines between cards */}
          <div className="connect-line hidden md:block absolute top-[72px] left-[33.33%] w-[calc(33.33%-48px)] h-px bg-gradient-to-r from-blue-500/30 via-white/10 to-purple-500/30 origin-left scale-x-0 -translate-x-[calc(50%-24px)]" style={{ left: 'calc(33.33% - 12px)', width: 'calc(33.33% - 24px + 24px)' }} />
          <div className="connect-line hidden md:block absolute top-[72px] h-px bg-gradient-to-r from-purple-500/30 via-white/10 to-emerald-500/30 origin-left scale-x-0" style={{ left: 'calc(66.66% - 12px)', width: 'calc(33.33% - 24px + 24px)' }} />

          {steps.map((step, index) => {
            const colors = colorMap[step.color as keyof typeof colorMap];
            const isActive = activeStep === index;

            return (
              <div
                key={step.step}
                className={cn(
                  "step-card group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-500 cursor-default opacity-0",
                  colors.cardGlow,
                  colors.accent,
                  isActive && "border-white/[0.12]"
                )}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Top accent line */}
                <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", `via-${step.color === 'blue' ? 'blue' : step.color === 'purple' ? 'purple' : 'emerald'}-500/40`)} />

                {/* Gradient overlay */}
                <div className={cn("absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500", colors.lineBg)} />

                <div className="relative p-6 sm:p-8">
                  {/* Step number + Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110", colors.iconBg)}>
                      <step.icon className={cn("w-6 h-6", colors.iconText)} />
                    </div>
                    <span className={cn("text-xs font-mono font-bold tracking-widest px-3 py-1.5 rounded-lg", colors.numberBg)}>
                      STEP {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-8 font-light">
                    {step.description}
                  </p>

                  {/* Interactive preview card */}
                  <div className={cn(
                    "rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-500",
                    isActive && "bg-white/[0.04] border-white/[0.1]"
                  )}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", colors.dotBg)} />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold">
                        {step.preview.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {step.preview.items.map((item, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2.5 text-xs text-white/30 transition-all duration-500",
                            isActive && "text-white/50",
                          )}
                          style={{
                            transitionDelay: isActive ? `${i * 100}ms` : '0ms',
                            transform: isActive ? 'translateX(0)' : 'translateX(-4px)',
                            opacity: isActive ? 1 : 0.6,
                          }}
                        >
                          <CheckCircle2 className={cn(
                            "w-3 h-3 transition-colors duration-500 flex-shrink-0",
                            isActive ? colors.iconText : "text-white/15"
                          )} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
