"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, Check, RefreshCw, Briefcase, Coffee, Zap, Mail, Send, ChevronDown, ChevronUp, Loader2, Square, Pencil, ArrowUp, Code2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { GeneratingLoader } from "@/components/generating-loader"
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

interface EmailCardProps {
  style: "formal" | "casual" | "bold"
  label: string
  color: "blue" | "green" | "orange"
  subject: string
  body: string
  headerBanner?: string
  footerBanner?: string
  isRegenerating?: boolean
  onRegenerate: () => void
  onStopRegenerate?: () => void
  onEditSuggestion?: (suggestion: string) => void
}

const cardConfig = {
  formal: {
    icon: Briefcase,
    glowBase: "rgba(59, 130, 246",
    gradient: "from-blue-500/10 via-transparent to-transparent",
    accentBorder: "group-hover:border-blue-500/30",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    subjectBg: "bg-blue-950/20 border-blue-500/10 text-blue-100",
    glowShadow: "group-hover:shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)]",
    pulse: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]",
  },
  casual: {
    icon: Coffee,
    glowBase: "rgba(16, 185, 129",
    gradient: "from-emerald-500/10 via-transparent to-transparent",
    accentBorder: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    subjectBg: "bg-emerald-950/20 border-emerald-500/10 text-emerald-100",
    glowShadow: "group-hover:shadow-[0_0_80px_-20px_rgba(16,185,129,0.2)]",
    pulse: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]",
  },
  bold: {
    icon: Zap,
    glowBase: "rgba(249, 115, 22",
    gradient: "from-orange-500/10 via-transparent to-transparent",
    accentBorder: "group-hover:border-orange-500/30",
    iconBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    subjectBg: "bg-orange-950/20 border-orange-500/10 text-orange-100",
    glowShadow: "group-hover:shadow-[0_0_80px_-20px_rgba(249,115,22,0.2)]",
    pulse: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]",
  },
}

export function EmailCard({
  style,
  label,
  subject,
  body,
  headerBanner,
  footerBanner,
  isRegenerating = false,
  onRegenerate,
  onStopRegenerate,
  onEditSuggestion,
}: EmailCardProps) {
  const [copied, setCopied] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mailMenuOpen, setMailMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editText, setEditText] = useState("")
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const envelopeRef = useRef<HTMLDivElement>(null)
  const mailMenuRef = useRef<HTMLDivElement>(null)
  const editMenuRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const config = cardConfig[style]
  const Icon = config.icon

  // GSAP element refs for stagger
  const headerRef = useRef(null)
  const subjectRef = useRef(null)
  const bodyRef = useRef(null)
  const actionsRef = useRef(null)

  // GSAP Entrance Animation
  useGSAP(() => {
    if (isRegenerating) return
    const elements = [headerRef.current, subjectRef.current, bodyRef.current, actionsRef.current]
    
    gsap.fromTo(elements, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "transform" }
    )
  }, { scope: envelopeRef, dependencies: [subject, body, isRegenerating] })

  // Handle external clicks for mail menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mailMenuRef.current && !mailMenuRef.current.contains(e.target as Node)) {
        setMailMenuOpen(false)
      }
    }
    if (mailMenuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mailMenuOpen])

  // Handle external clicks for edit popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editMenuRef.current && !editMenuRef.current.contains(e.target as Node)) {
        setEditOpen(false)
      }
    }
    if (editOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [editOpen])

  // Auto-focus input when edit opens
  useEffect(() => {
    if (editOpen && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editOpen])

  const handleCopy = async () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    toast.success("Ready to paste!", { icon: "🎉" })
    setTimeout(() => setCopied(false), 2000)
  }

  const generateHtmlEmail = () => {
    // Process body into email-safe paragraphs with proper spacing
    const bodyHtml = body
      .split("\n")
      .map((line) => {
        const trimmed = line.trim()
        if (trimmed === "") {
          return `<tr><td style="font-size:0;line-height:12px;height:12px;">&nbsp;</td></tr>`
        }
        return `<tr><td style="padding:0 0 10px 0;font-size:15px;line-height:1.7;color:#3a3a3a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;mso-line-height-rule:exactly;">${trimmed}</td></tr>`
      })
      .join("\n")

    // Preheader = first 120 chars of body (visible in inbox preview)
    const preheader = body.replace(/\n/g, " ").substring(0, 120).trim()

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${subject}</title>
  <!--[if mso]>
  <noscript><xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml></noscript>
  <style>
    table {border-collapse:collapse;}
    td,th,div,p,a,li,blockquote {font-family:'Segoe UI',Helvetica,Arial,sans-serif;}
  </style>
  <![endif]-->
  <style>
    /* Client-specific resets */
    body,#bodyTable{height:100%!important;margin:0;padding:0;width:100%!important}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
    table{border-collapse:collapse!important;mso-table-lspace:0pt;mso-table-rspace:0pt}
    a[x-apple-data-detectors]{color:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}
    /* Gmail dark mode */
    u+#body a{color:inherit;text-decoration:none;font-size:inherit;font-weight:inherit;line-height:inherit}
    /* Responsive */
    @media only screen and (max-width:620px){
      .email-container{width:100%!important;max-width:100%!important}
      .responsive-pad{padding-left:20px!important;padding-right:20px!important}
      .stack-col{display:block!important;width:100%!important}
    }
    /* Dark mode support */
    @media (prefers-color-scheme:dark){
      .email-bg{background-color:#1a1a1a!important}
      .email-card-bg{background-color:#2a2a2a!important}
      .email-heading{color:#f0f0f0!important}
      .email-body-text{color:#d0d0d0!important}
      .email-divider{border-color:#404040!important}
    }
  </style>
</head>
<body id="body" class="email-bg" style="margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;word-spacing:normal;">
  <!-- Visually hidden preheader -->
  <div style="display:none;font-size:1px;color:#f4f4f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}${"&zwnj;&nbsp;".repeat(30)}</div>

  <!-- Full-width wrapper -->
  <table role="presentation" id="bodyTable" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-bg" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" valign="top" style="padding:32px 12px;">

        <!-- Email container: 600px max -->
        <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);" bgcolor="#ffffff">

          ${headerBanner ? `<!-- Header Banner -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <img src="${headerBanner}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>` : ""}

          <!-- Subject heading -->
          <tr>
            <td class="responsive-pad" style="padding:${headerBanner ? "28px" : "36px"} 36px 4px 36px;">
              <h1 class="email-heading" style="margin:0;font-size:20px;font-weight:600;line-height:1.4;color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;mso-line-height-rule:exactly;">${subject}</h1>
            </td>
          </tr>

          <!-- Thin divider -->
          <tr>
            <td class="responsive-pad" style="padding:12px 36px 0 36px;">
              <div class="email-divider" style="border-top:1px solid #eeeeee;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td class="responsive-pad" style="padding:20px 36px ${footerBanner ? "24px" : "36px"} 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${bodyHtml}
              </table>
            </td>
          </tr>

          ${footerBanner ? `<!-- Footer Banner -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <img src="${footerBanner}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>` : ""}

        </table>
        <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>`
  }

  const handleCopyHtml = async () => {
    const html = generateHtmlEmail()
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([`Subject: ${subject}\n\n${body}`], { type: "text/plain" }),
        })
      ])
      setCopiedHtml(true)
      toast.success("HTML copied! Paste into Gmail compose for full formatting.", { icon: "✨", duration: 4000 })
      setTimeout(() => setCopiedHtml(false), 2500)
    } catch {
      // Fallback to plain text HTML
      await navigator.clipboard.writeText(html)
      setCopiedHtml(true)
      toast.success("HTML source copied to clipboard!", { icon: "📋" })
      setTimeout(() => setCopiedHtml(false), 2500)
    }
  }

  const handleMailDirectly = (provider: "gmail" | "outlook" | "yahoo" | "default") => {
    const encSubj = encodeURIComponent(subject)
    const encBody = encodeURIComponent(body)

    const urls: Record<string, string> = {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${encSubj}&body=${encBody}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?subject=${encSubj}&body=${encBody}`,
      yahoo: `https://compose.mail.yahoo.com/?subject=${encSubj}&body=${encBody}`,
      default: `mailto:?subject=${encSubj}&body=${encBody}`,
    }

    window.open(urls[provider], "_blank")
    setMailMenuOpen(false)
    if (headerBanner || footerBanner) {
      toast.success("Draft opened! Paste the HTML version (Copy HTML) in compose for banners.", { icon: "💡", duration: 5000 })
    } else {
      toast.success(`Draft opened...`)
    }
  }

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const handleEditSubmit = () => {
    const trimmed = editText.trim()
    if (!trimmed || !onEditSuggestion) return
    onEditSuggestion(trimmed)
    setEditText("")
    setEditOpen(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEditSubmit()
    }
    if (e.key === "Escape") {
      setEditOpen(false)
    }
  }

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.4, ease: "circOut" } }}
      ref={envelopeRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col p-6 rounded-[28px] border border-white/[0.05] bg-[#0c0c0c] transition-all duration-700 overflow-hidden min-h-[420px]",
        config.glowShadow,
        config.accentBorder
      )}
    >
      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${config.glowBase}, 0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Top Ambient Glow */}
      <div className={cn("absolute inset-x-0 top-0 h-40 bg-gradient-to-b opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none", config.gradient)} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {isRegenerating && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-black/80 backdrop-blur-md rounded-[28px]">
          <GeneratingLoader size="compact" />
          {onStopRegenerate && (
            <button
              onClick={onStopRegenerate}
              className="group/stop inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 text-xs font-medium backdrop-blur-sm"
            >
              <Square className="w-3 h-3 fill-current animate-pulse group-hover/stop:animate-none" />
              Stop
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col gap-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-[16px] border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-inner", config.iconBg)}>
                <Icon className="w-5 h-5 drop-shadow-md" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-1">Variant</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{label}</h3>
                  <div className={cn("w-2 h-2 rounded-full", config.pulse)} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onEditSuggestion && (
                <button
                  onClick={() => setEditOpen(!editOpen)}
                  disabled={isRegenerating}
                  className={cn(
                    "p-3 bg-white/[0.02] border border-white/[0.05] rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 group/edit",
                    editOpen && "text-white bg-white/[0.08] border-white/[0.1]"
                  )}
                  title="Suggest edits"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-full text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 hover:rotate-180 group/btn"
                title="Draft another version"
              >
                {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

          {/* Edit Suggestion Popover */}
          <AnimatePresence>
            {editOpen && (
              <motion.div
                ref={editMenuRef}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-50 mb-4"
              >
                <div className="rounded-2xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-2xl shadow-2xl shadow-black/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Pencil className="w-3 h-3 text-white/30" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">Suggest Edits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      placeholder="e.g. Make it shorter, add a call to action..."
                      className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-white/[0.15] focus:bg-white/[0.06] transition-all duration-300"
                    />
                    <button
                      onClick={handleEditSubmit}
                      disabled={!editText.trim()}
                      className={cn(
                        "p-2.5 rounded-xl border transition-all duration-300",
                        editText.trim()
                          ? "bg-white/[0.1] border-white/[0.15] text-white hover:bg-white/[0.15]"
                          : "bg-white/[0.02] border-white/[0.05] text-white/20 cursor-not-allowed"
                      )}
                      title="Apply edits"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Header Banner */}
        {headerBanner && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-white/[0.06] transition-transform duration-500 group-hover:scale-[1.005]">
            <img src={headerBanner} alt="Email header" className="w-full h-auto block" />
          </div>
        )}

        {/* Subject */}
        <div ref={subjectRef} className={cn("p-4 rounded-[20px] border mb-6 backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.01] shadow-2xl shadow-black/50", config.subjectBg)}>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Subject</span>
          </div>
          <p className="text-[15px] font-semibold leading-relaxed drop-shadow-sm">{subject}</p>
        </div>

        {/* Body Text */}
        <div ref={bodyRef} className="relative flex-grow mb-6 flex flex-col">
          <motion.div
            layout="position"
            className={cn(
              "text-[14px] text-gray-400 font-light leading-[1.8] whitespace-pre-wrap transition-colors duration-500 group-hover:text-gray-300",
              expanded ? "" : "max-h-[160px] overflow-hidden"
            )}
            style={!expanded ? { maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" } : undefined}
          >
            {body}
          </motion.div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1.5 py-4 mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/30 hover:text-white transition-all duration-300 z-20"
          >
            {expanded ? (
              <>COLLAPSE <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>EXPAND <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Footer Banner */}
        {footerBanner && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-white/[0.06] transition-transform duration-500 group-hover:scale-[1.005]">
            <img src={footerBanner} alt="Email footer" className="w-full h-auto block" />
          </div>
        )}

        {/* Actions */}
        <div ref={actionsRef} className="flex flex-col gap-2 mt-auto pt-2 w-full">
          {/* Copy Row */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-[16px] font-medium text-[13px] transition-all duration-300 border",
                copied
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]"
                  : "bg-white/[0.03] text-gray-300 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
              )}
            >
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Text</>}
            </motion.button>

            {(headerBanner || footerBanner) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyHtml}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-[16px] font-medium text-[13px] transition-all duration-300 border",
                  copiedHtml
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_20px_-4px_rgba(139,92,246,0.3)]"
                    : "bg-white/[0.03] text-gray-300 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {copiedHtml ? <><Check className="w-4 h-4" /> Copied</> : <><Code2 className="w-4 h-4" /> Copy HTML</>}
              </motion.button>
            )}
          </div>

          <div ref={mailMenuRef} className="w-full relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMailMenuOpen(!mailMenuOpen)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-[16px] font-medium text-[13px] transition-all duration-300 border",
                mailMenuOpen
                  ? "bg-white/[0.1] text-white border-white/[0.15]"
                  : "bg-white/[0.03] text-gray-300 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
              )}
            >
              <Send className="w-3.5 h-3.5" /> Mail App
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-300 ml-1", mailMenuOpen && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
              {mailMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute bottom-[calc(100%+8px)] left-0 right-0 rounded-[20px] border border-white/[0.1] bg-[#111]/90 backdrop-blur-2xl shadow-2xl overflow-hidden z-50 p-2"
                >
                  {[
                    { id: "gmail" as const, label: "Gmail", bg: "hover:bg-red-500/15" },
                    { id: "outlook" as const, label: "Outlook", bg: "hover:bg-blue-500/15" },
                    { id: "yahoo" as const, label: "Yahoo", bg: "hover:bg-purple-500/15" },
                    { id: "default" as const, label: "Default", bg: "hover:bg-white/10" },
                  ].map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleMailDirectly(provider.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-gray-300 hover:text-white rounded-[14px] transition-all duration-200",
                        provider.bg
                      )}
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center">
                        {provider.id === "gmail" && (
                          <svg className="w-[18px] h-[18px]" viewBox="52 42 88 66">
                            <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/><path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/><path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/><path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/><path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.46-14.4-.22-14.4 7.2"/>
                          </svg>
                        )}
                        {provider.id === "outlook" && (
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 48 48">
                            <path fill="#1976D2" d="M6 6h36c2.21 0 4 1.79 4 4v28c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V10c0-2.21 1.79-4 4-4z"/><path fill="#2196F3" d="M42 12L24 26 6 12v-2l18 14 18-14v2z"/><path fill="#1E88E5" d="M42 12l-18 14L6 12"/><ellipse fill="#1565C0" cx="17" cy="28" rx="9" ry="7"/><ellipse fill="#fff" cx="17" cy="28" rx="6" ry="4.5"/>
                          </svg>
                        )}
                        {provider.id === "yahoo" && (
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 48 48">
                            <rect x="2" y="2" width="44" height="44" rx="8" fill="#720e9e"/><text x="24" y="34" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">Y!</text>
                          </svg>
                        )}
                        {provider.id === "default" && <Mail className="w-4 h-4 text-white/50" />}
                      </div>
                      {provider.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
