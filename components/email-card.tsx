"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, Check, RefreshCw, Briefcase, Coffee, Zap, Mail, Send, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { GeneratingLoader } from "@/components/generating-loader"

interface EmailCardProps {
  style: "formal" | "casual" | "bold"
  label: string
  color: "blue" | "green" | "orange"
  subject: string
  body: string
  isRegenerating?: boolean
  onRegenerate: () => void
}

const cardConfig = {
  formal: {
    icon: Briefcase,
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    accentBorder: "group-hover:border-blue-500/30",
    iconBg: "bg-blue-500/15 border-blue-500/25 text-blue-400",
    subjectBg: "bg-blue-500/[0.08] border-blue-500/20",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.2)]",
    accentLine: "via-blue-500/40",
    dotColor: "bg-blue-500",
    copyHover: "hover:border-blue-500/25 hover:text-blue-400",
    mailHover: "hover:border-blue-500/25 hover:text-blue-400",
  },
  casual: {
    icon: Coffee,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accentBorder: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
    subjectBg: "bg-emerald-500/[0.08] border-emerald-500/20",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(16,185,129,0.2)]",
    accentLine: "via-emerald-500/40",
    dotColor: "bg-emerald-500",
    copyHover: "hover:border-emerald-500/25 hover:text-emerald-400",
    mailHover: "hover:border-emerald-500/25 hover:text-emerald-400",
  },
  bold: {
    icon: Zap,
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    accentBorder: "group-hover:border-orange-500/30",
    iconBg: "bg-orange-500/15 border-orange-500/25 text-orange-400",
    subjectBg: "bg-orange-500/[0.08] border-orange-500/20",
    glowShadow: "group-hover:shadow-[0_0_60px_-12px_rgba(249,115,22,0.2)]",
    accentLine: "via-orange-500/40",
    dotColor: "bg-orange-500",
    copyHover: "hover:border-orange-500/25 hover:text-orange-400",
    mailHover: "hover:border-orange-500/25 hover:text-orange-400",
  },
}

export function EmailCard({
  style,
  label,
  color,
  subject,
  body,
  isRegenerating = false,
  onRegenerate,
}: EmailCardProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mailMenuOpen, setMailMenuOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const mailMenuRef = useRef<HTMLDivElement>(null)
  const config = cardConfig[style]
  const Icon = config.icon

  // Close mail menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mailMenuRef.current && !mailMenuRef.current.contains(e.target as Node)) {
        setMailMenuOpen(false)
      }
    }
    if (mailMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mailMenuOpen])

  const handleCopy = async () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    toast.success("Email copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMailDirectly = (provider: "gmail" | "outlook" | "yahoo" | "default") => {
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)

    const urls: Record<string, string> = {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodedSubject}&body=${encodedBody}`,
      yahoo: `https://compose.mail.yahoo.com/?subject=${encodedSubject}&body=${encodedBody}`,
      default: `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
    }

    window.open(urls[provider], "_blank")
    setMailMenuOpen(false)
    const names = { gmail: "Gmail", outlook: "Outlook", yahoo: "Yahoo Mail", default: "mail client" }
    toast.success(`Opening ${names[provider]}...`)
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
        "group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2",
        config.glowShadow,
        config.accentBorder,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Regenerating overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-black/70 backdrop-blur-md">
          <GeneratingLoader size="compact" />
        </div>
      )}

      {/* Mouse follow spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.03), transparent 60%)`,
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
                <p className="text-[11px] text-gray-400 font-medium">Style</p>
              </div>
            </div>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-500 active:scale-90",
              isRegenerating
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-900 hover:bg-black/[0.04] hover:rotate-180"
            )}
            title="Regenerate this email"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Subject line */}
        <div className={cn(
          "px-4 py-3 rounded-xl border mb-5 transition-all duration-300 group-hover:scale-[1.01]",
          config.subjectBg
        )}>
          <div className="flex items-center gap-2 mb-1.5">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold">Subject</span>
          </div>
          <p className="text-sm font-medium text-white leading-snug">{subject}</p>
        </div>

        {/* Body */}
        <div className="relative mb-5">
          <div
            className={cn(
              "text-[13px] text-gray-400 leading-[1.8] whitespace-pre-wrap pr-1 transition-all duration-500",
              expanded ? "max-h-none" : "max-h-[220px] overflow-hidden"
            )}
            style={!expanded ? {
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            } : undefined}
          >
            {body}
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 mb-4 text-xs font-medium text-gray-500 hover:text-white transition-colors duration-300"
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

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={cn(
              "flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 border active:scale-[0.98]",
              copied
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-[0_0_20px_-4px_rgba(16,185,129,0.2)]"
                : cn("bg-white/[0.06] text-gray-400 border-white/[0.08]", config.copyHover)
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Email
              </>
            )}
          </button>
          <div ref={mailMenuRef} className="flex-1 relative">
            <button
              onClick={() => setMailMenuOpen(!mailMenuOpen)}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 border active:scale-[0.98]",
                mailMenuOpen
                  ? cn("bg-white/[0.1] text-white border-white/[0.12]")
                  : cn("bg-white/[0.06] text-gray-400 border-white/[0.08]", config.mailHover)
              )}
            >
              <Send className="w-4 h-4" />
              Send via Mail
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", mailMenuOpen && "rotate-180")} />
            </button>

            {/* Mail provider dropdown */}
            {mailMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-white/[0.1] bg-black/80 backdrop-blur-2xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 p-1.5">
                {[
                  { id: "gmail" as const, label: "Gmail", bg: "group-hover/item:bg-red-500/10" },
                  { id: "outlook" as const, label: "Outlook", bg: "group-hover/item:bg-blue-500/10" },
                  { id: "yahoo" as const, label: "Yahoo Mail", bg: "group-hover/item:bg-purple-500/10" },
                  { id: "default" as const, label: "Default App", bg: "group-hover/item:bg-white/[0.06]" },
                ].map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleMailDirectly(provider.id)}
                    className={cn(
                      "group/item w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-xl transition-all duration-200",
                      provider.bg
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                      {provider.id === "gmail" && (
                        <svg className="w-[22px] h-[22px]" viewBox="52 42 88 66">
                          <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
                          <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
                          <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
                          <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>
                          <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.46-14.4-.22-14.4 7.2"/>
                        </svg>
                      )}
                      {provider.id === "outlook" && (
                        <svg className="w-[22px] h-[22px]" viewBox="0 0 48 48">
                          <path fill="#1976D2" d="M6 6h36c2.21 0 4 1.79 4 4v28c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V10c0-2.21 1.79-4 4-4z"/>
                          <path fill="#2196F3" d="M42 12L24 26 6 12v-2l18 14 18-14v2z"/>
                          <path fill="#1E88E5" d="M42 12l-18 14L6 12"/>
                          <ellipse fill="#1565C0" cx="17" cy="28" rx="9" ry="7"/>
                          <ellipse fill="#fff" cx="17" cy="28" rx="6" ry="4.5"/>
                        </svg>
                      )}
                      {provider.id === "yahoo" && (
                        <svg className="w-[22px] h-[22px]" viewBox="0 0 48 48">
                          <rect x="2" y="2" width="44" height="44" rx="8" fill="#720e9e"/>
                          <text x="24" y="34" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">Y!</text>
                        </svg>
                      )}
                      {provider.id === "default" && (
                        <Mail className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    {provider.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
