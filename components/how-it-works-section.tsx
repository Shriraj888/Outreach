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
      label: "INPUT PREVIEW",
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
      label: "PROCESSING",
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
      label: "READY",
      items: ["Formal: 94% match", "Casual: 87% match", "Bold: 91% match"],
    },
  },
]

const colorMap = {
  blue: {
    iconBg: "bg-blue-500/[0.12] border-blue-500/25",
    iconText: "text-blue-400",
    numberBg: "bg-blue-500/[0.12] text-blue-400",
    dotBg: "bg-blue-500",
    cardHover: "hover:border-blue-500/30",
    glowBg: "from-blue-500/15 via-blue-500/5 to-transparent",
    previewCheck: "text-white/10 group-hover:text-blue-400 transition-colors",
  },
  purple: {
    iconBg: "bg-purple-500/[0.12] border-purple-500/25",
    iconText: "text-purple-400",
    numberBg: "bg-purple-500/[0.12] text-purple-400",
    dotBg: "bg-purple-500",
    cardHover: "hover:border-purple-500/30",
    glowBg: "from-purple-500/15 via-purple-500/5 to-transparent",
    previewCheck: "text-white/10 group-hover:text-purple-400 transition-colors",
  },
  emerald: {
    iconBg: "bg-emerald-500/[0.12] border-emerald-500/25",
    iconText: "text-emerald-400",
    numberBg: "bg-emerald-500/[0.12] text-emerald-400",
    dotBg: "bg-emerald-500",
    cardHover: "hover:border-emerald-500/30",
    glowBg: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    previewCheck: "text-white/10 group-hover:text-emerald-400 transition-colors",
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
    gsap.fromTo(".connect-line-bg",
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: {
          trigger: ".hiw-grid",
          start: "top 70%",
        }
      }
    );

  }, { scope: container });

  return (
    <section id="how-it-works" ref={container} className="relative py-32 sm:py-40 px-4 overflow-hidden">
      
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.04] mb-8 shadow-sm">
            <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-sm font-medium text-gray-400">How It Works</span>
          </div>
          <h2 className="hiw-title text-5xl sm:text-6xl lg:text-7xl font-semibold text-white mb-6 tracking-tight">
            Three Steps. <span className="text-gray-600">Zero Friction.</span>
          </h2>
          <p className="hiw-subtitle text-lg sm:text-xl text-gray-500 max-w-xl mx-auto font-light">
            From blank page to inbox-ready email in under 30 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="hiw-grid grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Connecting line that spans behind the cards in desktop */}
          <div className="connect-line-bg hidden md:block absolute top-[62px] left-[16.66%] right-[16.66%] h-[1px] bg-gradient-to-r from-blue-500/0 via-purple-500/40 to-emerald-500/0 origin-left z-0" />

          {steps.map((step, index) => {
            const colors = colorMap[step.color as keyof typeof colorMap];
            const isActive = activeStep === index;

            return (
              <div
                key={step.step}
                className={cn(
                  "step-card group relative rounded-[28px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 z-10",
                  colors.cardHover,
                  isActive && "border-white/[0.12]"
                )}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Stunning Radial Hover Glow inside the card */}
                <div 
                  className={cn(
                    "absolute inset-x-0 top-0 h-[250px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-t-[28px]", 
                    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
                    colors.glowBg
                  )} 
                />

                <div className="relative p-7 sm:p-9 z-10 h-full flex flex-col">
                  {/* Step number + Icon Row */}
                  <div className="flex items-center justify-between mb-10">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-inner group-hover:scale-105", colors.iconBg)}>
                      <step.icon className={cn("w-5 h-5", colors.iconText)} />
                    </div>
                    <span className={cn("text-[10px] font-bold tracking-[0.15em] px-3.5 py-1.5 rounded-full border transition-colors", colors.numberBg, "border-transparent text-opacity-90")}>
                      STEP {step.step}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="mb-10">
                    <h3 className="text-[22px] font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-gray-500 leading-[1.6] font-light group-hover:text-gray-400 transition-colors">
                      {step.description}
                    </p>
                  </div>

                  {/* Inner Input Preview Container */}
                  <div className="mt-auto">
                    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-5 group-hover:bg-white/[0.06] group-hover:border-white/[0.1] transition-all duration-500">
                      
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className={cn("w-1.5 h-1.5 rounded-full", colors.dotBg, isActive ? "animate-pulse" : "opacity-50")} />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                          {step.preview.label}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {step.preview.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-[13px] text-gray-500 font-medium group-hover:text-gray-300 transition-colors duration-500"
                          >
                            <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", colors.previewCheck)} />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                      
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
