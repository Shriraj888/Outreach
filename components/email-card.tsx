"use client"

import { useState, useRef } from "react"
import { Copy, Check, RefreshCw, Briefcase, Coffee, Zap, Mail, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EmailCardProps {
  style: "formal" | "casual" | "bold"
  label: string
  color: "blue" | "green" | "orange"
  subject: string
  body: string
  onRegenerate: () => void
}

const cardConfig = {
  formal: {
    icon: Briefcase,
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    accentBorder: "group-hover:border-blue-500/30",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    subjectBg: "bg-blue-500/5 border-blue-500/15",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.15)]",
    accentLine: "via-blue-500/40",
    dotColor: "bg-blue-400",
    copyHover: "hover:border-blue-500/20 hover:text-blue-300",
  },
  casual: {
    icon: Coffee,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accentBorder: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    subjectBg: "bg-emerald-500/5 border-emerald-500/15",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(16,185,129,0.15)]",
    accentLine: "via-emerald-500/40",
    dotColor: "bg-emerald-400",
    copyHover: "hover:border-emerald-500/20 hover:text-emerald-300",
  },
  bold: {
    icon: Zap,
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    accentBorder: "group-hover:border-orange-500/30",
    iconBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    subjectBg: "bg-orange-500/5 border-orange-500/15",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(249,115,22,0.15)]",
    accentLine: "via-orange-500/40",
    dotColor: "bg-orange-400",
    copyHover: "hover:border-orange-500/20 hover:text-orange-300",
  },
}

export function EmailCard({
  style,
  label,
  color,
  subject,
  body,
  onRegenerate,
}: EmailCardProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const config = cardConfig[style]
  const Icon = config.icon

  const handleCopy = async () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    toast.success("Email copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-500 hover:-translate-y-2",
        config.glowShadow,
        config.accentBorder,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse follow spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.04), transparent 60%)`,
        }}
      />

      {/* Header gradient overlay */}
      <div className={cn("absolute inset-x-0 top-0 h-32 bg-gradient-to-b opacity-60 pointer-events-none transition-opacity duration-500 group-hover:opacity-100", config.gradient)} />

      {/* Top accent line */}
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", config.accentLine)} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              config.iconBg
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">{label}</h3>
              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dotColor)} />
                <p className="text-[11px] text-white/30 font-medium">Style</p>
              </div>
            </div>
          </div>
          <button
            onClick={onRegenerate}
            className="p-2.5 text-white/20 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-500 hover:rotate-180 active:scale-90"
            title="Regenerate all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Subject line */}
        <div className={cn(
          "px-4 py-3 rounded-xl border mb-5 transition-all duration-300 group-hover:scale-[1.01]",
          config.subjectBg
        )}>
          <div className="flex items-center gap-2 mb-1.5">
            <Mail className="w-3 h-3 text-white/25" />
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold">Subject</span>
          </div>
          <p className="text-sm font-medium text-white/90 leading-snug">{subject}</p>
        </div>

        {/* Body */}
        <div className="relative mb-5">
          <div
            className={cn(
              "text-[13px] text-white/55 leading-[1.8] whitespace-pre-wrap pr-1 transition-all duration-500",
              expanded ? "max-h-none" : "max-h-[220px] overflow-hidden"
            )}
          >
            {body}
          </div>
          {!expanded && (
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 mb-4 text-xs text-white/25 hover:text-white/50 transition-colors duration-300"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Read full email <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 border active:scale-[0.98]",
            copied
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_-4px_rgba(16,185,129,0.2)]"
              : cn("bg-white/[0.03] text-white/60 border-white/[0.06]", config.copyHover)
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Full Email
            </>
          )}
        </button>
      </div>
    </div>
  )
}
