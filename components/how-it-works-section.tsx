"use client"

import { PenLine, Sparkles, Send, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Define Your Target",
    description: "Tell us who you're reaching out to, your purpose, and what makes you stand out. Just 3 simple inputs.",
    color: "blue",
    glowBase: "rgba(59, 130, 246",
    accent: {
      border: "group-hover:border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-400 font-medium",
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110",
      numberText: "text-blue-500/10",
      previewCheck: "text-blue-500/40 group-hover:text-blue-400",
      dotBounce: "bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
    },
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
    glowBase: "rgba(168, 85, 247",
    accent: {
      border: "group-hover:border-purple-500/30",
      bg: "bg-purple-500/10",
      text: "text-purple-400 font-medium",
      iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110",
      numberText: "text-purple-500/10",
      previewCheck: "text-purple-500/40 group-hover:text-purple-400",
      dotBounce: "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
    },
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
    glowBase: "rgba(16, 185, 129",
    accent: {
      border: "group-hover:border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400 font-medium",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110",
      numberText: "text-emerald-500/10",
      previewCheck: "text-emerald-500/40 group-hover:text-emerald-400",
      dotBounce: "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    },
    preview: {
      label: "READY",
      items: ["Formal: 94% match", "Casual: 87% match", "Bold: 91% match"],
    },
  },
]

function StepCard({ step, index, hoveredIdx, setHoveredIdx }: any) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const isHovered = hoveredIdx === index
  const isOtherHovered = hoveredIdx !== null && hoveredIdx !== index

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
      className={cn(
        "group relative flex flex-col p-6 md:p-8 rounded-[32px] border border-white/[0.05] bg-[#0c0c0c] transition-all duration-500 overflow-hidden min-h-[400px] md:min-h-[480px]",
        step.accent.border,
        isOtherHovered ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
      )}
      style={{
        boxShadow: isHovered ? "0 20px 40px -20px rgba(0,0,0,0.5)" : "none"
      }}
    >
      {/* Background Watermark */}
      <div className={cn(
        "absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 text-[160px] md:text-[240px] font-black leading-none select-none pointer-events-none transition-transform duration-700",
        step.accent.numberText,
        "group-hover:-translate-x-4 group-hover:-translate-y-4"
      )}>
        {index + 1}
      </div>

      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${step.glowBase}, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500", step.accent.iconBg)}>
            <step.icon className="w-6 h-6 drop-shadow-md" />
          </div>
          <span className={cn("text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02]", step.accent.text)}>
            Step {step.step}
          </span>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-[24px] font-semibold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
            {step.title}
          </h3>
          <p className="text-[15px] text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
            {step.description}
          </p>
        </div>

        {/* Mock Data Box */}
        <div className="mt-auto">
          <div className="rounded-[20px] border border-white/[0.05] bg-[#111111]/50 p-6 backdrop-blur-md group-hover:border-white/[0.1] transition-all duration-500 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className={cn("w-2 h-2 rounded-full", isHovered ? "animate-pulse " + step.accent.dotBounce : "bg-white/20")} />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
                {step.preview.label}
              </span>
            </div>
            
            <div className="space-y-3.5">
              {step.preview.items.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-[13px] text-gray-400 font-medium group-hover:text-gray-200 transition-colors duration-500">
                  <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0 transition-transform duration-500", step.accent.previewCheck, isHovered && "scale-110")} />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section id="how-it-works" className="relative py-20 sm:py-32 px-4 overflow-hidden border-t border-white/[0.05] bg-black">
      {/* Background Flare */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-gradient-to-b from-white/[0.02] to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8 shadow-2xl backdrop-blur-md"
          >
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">How It Works</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Three Steps. <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Zero Friction.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto font-light"
          >
            From blank page to inbox-ready email in under 30 seconds.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => (
            <StepCard 
              key={step.step} 
              step={step} 
              index={index} 
              hoveredIdx={hoveredIdx} 
              setHoveredIdx={setHoveredIdx} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
