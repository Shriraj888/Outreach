"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Zap, User, Target, MessageSquare, UserCheck, Loader2, CheckCircle2, ArrowRight, ArrowLeft,
  GraduationCap, Briefcase, Compass, Handshake, Rocket, CircleDollarSign, Sparkles,
  Key, Shield, ChevronRight, Image as ImageIcon
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiKeyInput } from "@/components/api-key-input"
import { EmailBannerSettings } from "@/components/email-banner-settings"
import { cn } from "@/lib/utils"
import gsap from "gsap"

const purposes = [
  { value: "Internship", icon: GraduationCap, color: "text-blue-400" },
  { value: "Freelance Project", icon: Briefcase, color: "text-amber-400" },
  { value: "Mentorship", icon: Compass, color: "text-violet-400" },
  { value: "Collaboration", icon: Handshake, color: "text-emerald-400" },
  { value: "Job Opportunity", icon: Rocket, color: "text-rose-400" },
  { value: "Investment / Funding", icon: CircleDollarSign, color: "text-yellow-400" },
  { value: "Other", icon: Sparkles, color: "text-slate-400" },
]

const steps = [
  {
    id: 1,
    title: "API Key",
    description: "Connect your AI provider",
    icon: Key,
  },
  {
    id: 2,
    title: "Target",
    description: "Who & what you want",
    icon: Target,
  },
  {
    id: 3,
    title: "Context",
    description: "Your background & details",
    icon: UserCheck,
  },
  {
    id: 4,
    title: "Branding",
    description: "Header & footer banners",
    icon: ImageIcon,
  },
]

export interface FormData {
  recipient: string
  purpose: string
  background: string
  recipientName: string
  senderName: string
  headerBanner: string
  footerBanner: string
}

export function CraftForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    purpose: "",
    background: "",
    recipientName: "",
    senderName: "",
    headerBanner: "",
    footerBanner: "",
  })

  const stepContainerRef = useRef<HTMLDivElement>(null)
  const step1Ref = useRef<HTMLDivElement>(null)
  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)
  const step4Ref = useRef<HTMLDivElement>(null)

  const stepRefs = [step1Ref, step2Ref, step3Ref, step4Ref]

  // Validation per step
  const isStep1Valid = !!apiKey
  const isStep2Valid = !!formData.recipient && !!formData.purpose
  const isStep3Valid = !!formData.background && !!formData.senderName
  const isStep4Valid = true // Step 4 is optional
  const isValid = isStep1Valid && isStep2Valid && isStep3Valid

  const canProceed = (step: number) => {
    switch (step) {
      case 1: return isStep1Valid
      case 2: return isStep2Valid
      case 3: return isStep3Valid
      case 4: return isStep4Valid
      default: return false
    }
  }

  // Calculate overall progress
  const totalFields = 5 // apiKey, recipient, purpose, background, senderName
  let completedFields = 0
  if (apiKey) completedFields++
  if (formData.recipient) completedFields++
  if (formData.purpose) completedFields++
  if (formData.background) completedFields++
  if (formData.senderName) completedFields++
  const progress = (completedFields / totalFields) * 100

  const animateStepTransition = useCallback((from: number, to: number, dir: "forward" | "backward") => {
    if (isAnimating) return
    setIsAnimating(true)

    const fromRef = stepRefs[from - 1].current
    const toRef = stepRefs[to - 1].current

    if (!fromRef || !toRef) {
      setIsAnimating(false)
      return
    }

    const slideDistance = 60
    const outX = dir === "forward" ? -slideDistance : slideDistance
    const inX = dir === "forward" ? slideDistance : -slideDistance

    // Make the incoming step visible but positioned off-screen
    gsap.set(toRef, {
      display: "block",
      opacity: 0,
      x: inX,
      scale: 0.97,
      filter: "blur(6px)",
    })

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(fromRef, { display: "none" })
        setIsAnimating(false)
      },
    })

    // Animate outgoing step
    tl.to(fromRef, {
      opacity: 0,
      x: outX,
      scale: 0.97,
      filter: "blur(6px)",
      duration: 0.35,
      ease: "power3.in",
    })

    // Animate incoming step
    tl.to(toRef, {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.45,
      ease: "power3.out",
      clearProps: "filter,transform",
    }, "-=0.12")

    // Animate step indicator
    tl.to(".step-indicator", {
      keyframes: [
        { scale: 0.96, duration: 0.15 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" },
      ],
    }, "-=0.4")

  }, [isAnimating])

  const goToStep = (step: number) => {
    if (step === currentStep || isAnimating) return
    if (step > currentStep && !canProceed(currentStep)) return

    const dir = step > currentStep ? "forward" : "backward"
    setDirection(dir)
    animateStepTransition(currentStep, step, dir)
    setCurrentStep(step)
  }

  const handleNext = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      goToStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isValid) {
      setTouched({
        recipient: true,
        purpose: true,
        background: true,
        senderName: true,
      })
      return
    }

    setIsLoading(true)
    sessionStorage.setItem("craftFormData", JSON.stringify(formData))
    sessionStorage.setItem("craft_api_key", apiKey)
    router.push("/craft/results")
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Initialize: show only step 1
  useEffect(() => {
    stepRefs.forEach((ref, index) => {
      if (ref.current) {
        gsap.set(ref.current, {
          display: index === 0 ? "block" : "none",
          opacity: index === 0 ? 1 : 0,
        })
      }
    })
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        if (currentStep < 4 && canProceed(currentStep)) {
          e.preventDefault()
          handleNext()
        } else if (currentStep === 4 && isValid) {
          e.preventDefault()
          handleSubmit()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, formData, apiKey, isValid])

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="step-indicator relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative p-4 sm:p-5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id || (step.id === 1 && isStep1Valid && currentStep > 1) || (step.id === 2 && isStep2Valid && currentStep > 2)
              const isPast = currentStep > step.id
              const isClickable = step.id < currentStep || (step.id === currentStep) || (step.id === currentStep + 1 && canProceed(currentStep))

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  {/* Step circle + label */}
                  <button
                    onClick={() => isClickable ? goToStep(step.id) : null}
                    className={cn(
                      "flex items-center gap-3 transition-all duration-500 group",
                      isClickable ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <div
                      className={cn(
                        "relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border transition-all duration-500",
                        isActive
                          ? "border-white/20 bg-white/[0.1] shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)]"
                          : isPast
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-white/[0.06] bg-white/[0.03]"
                      )}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      ) : (
                        <Icon className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500",
                          isActive ? "text-white" : "text-gray-500"
                        )} />
                      )}

                      {/* Active pulse ring */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl border border-white/10 animate-ping opacity-20" />
                      )}
                    </div>

                    <div className="hidden sm:block text-left">
                      <p className={cn(
                        "text-[13px] font-semibold transition-colors duration-500",
                        isActive ? "text-white" : isPast ? "text-emerald-400" : "text-gray-500"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </button>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-3 sm:mx-4">
                      <div className="h-px bg-white/[0.06] relative overflow-hidden rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/40 transition-all duration-700 ease-out rounded-full"
                          style={{ width: isPast ? "100%" : isActive ? "30%" : "0%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile step label */}
          <div className="sm:hidden mt-3 text-center">
            <p className="text-xs text-gray-400">
              Step {currentStep}: <span className="text-white font-medium">{steps[currentStep - 1].title}</span>
              <span className="text-gray-500"> — {steps[currentStep - 1].description}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Progress bar */}
        <div className="absolute inset-x-0 top-0 h-[2px]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-white transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps container */}
        <div ref={stepContainerRef} className="relative min-h-[320px]">

          {/* ===== STEP 1: API Key ===== */}
          <div ref={step1Ref} className="p-6 sm:p-8 pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Connect Your AI</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Paste your Gemini or OpenRouter API key to get started</p>
                </div>
              </div>
            </div>

            <ApiKeyInput value={apiKey} onChange={setApiKey} inline />

            {/* Helpful hint */}
            <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <Shield className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your key is stored <span className="text-white font-medium">locally in your browser</span>. It never leaves your device except to call the AI API directly.
                </p>
              </div>
            </div>
          </div>

          {/* ===== STEP 2: Target ===== */}
          <div ref={step2Ref} className="p-6 sm:p-8 pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Define Your Target</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Who are you reaching out to and why?</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Recipient */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2.5">
                  <Target className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    formData.recipient ? "text-emerald-400" : "text-gray-500"
                  )} />
                  <label className="text-sm font-medium text-gray-300">Who are you emailing?</label>
                  {touched.recipient && !formData.recipient && (
                    <span className="text-[11px] text-red-500 ml-auto animate-in fade-in slide-in-from-right-2 duration-300">Required</span>
                  )}
                  {formData.recipient && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto animate-in fade-in zoom-in duration-300" />
                  )}
                </div>
                <input
                  placeholder="e.g. CTO of a Mumbai fintech startup"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  onBlur={() => handleBlur("recipient")}
                  className={cn(
                    "w-full bg-white/[0.06] border rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300",
                    touched.recipient && !formData.recipient
                      ? "border-red-500/30 focus:border-red-500/40"
                      : formData.recipient
                        ? "border-emerald-500/25 focus:border-emerald-500/35"
                        : "border-white/[0.08] focus:border-white/[0.15]"
                  )}
                />
              </div>

              {/* Purpose */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2.5">
                  <MessageSquare className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    formData.purpose ? "text-emerald-400" : "text-gray-500"
                  )} />
                  <label className="text-sm font-medium text-gray-300">What do you want?</label>
                  {touched.purpose && !formData.purpose && (
                    <span className="text-[11px] text-red-500 ml-auto animate-in fade-in slide-in-from-right-2 duration-300">Required</span>
                  )}
                  {formData.purpose && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto animate-in fade-in zoom-in duration-300" />
                  )}
                </div>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => {
                    setFormData({ ...formData, purpose: value })
                    setTouched((prev) => ({ ...prev, purpose: true }))
                  }}
                >
                  <SelectTrigger className={cn(
                    "w-full bg-white/[0.04] border rounded-xl py-3 px-4 text-sm text-white outline-none transition-all duration-300 min-h-[52px] shadow-sm hover:bg-white/[0.06] data-[state=open]:bg-white/[0.06]",
                    touched.purpose && !formData.purpose
                      ? "border-red-500/30 hover:border-red-500/40 focus:ring-red-500/20"
                      : formData.purpose
                        ? "border-emerald-500/25 hover:border-emerald-500/35 focus:ring-emerald-500/20"
                        : "border-white/[0.08] hover:border-white/[0.15] focus:ring-white/[0.1] data-[state=open]:border-white/[0.2]"
                  )}>
                    {formData.purpose ? (() => {
                      const selected = purposes.find(p => p.value === formData.purpose);
                      const Icon = selected?.icon;
                      return (
                        <div className="flex flex-1 items-center gap-3">
                          {Icon && (
                            <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/[0.1]", selected?.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <span className="font-medium text-white">{formData.purpose}</span>
                        </div>
                      );
                    })() : (
                      <span className="flex-1 text-left text-gray-500">Select your purpose</span>
                    )}
                    {/* Hidden real SelectValue for form semantics/accessibility without forcing visual override */}
                    <div className="hidden">
                      <SelectValue placeholder="Select your purpose" />
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={8}
                    className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A]/95 p-1.5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                  >
                    {purposes.map((purpose) => {
                      const Icon = purpose.icon;
                      return (
                      <SelectItem
                        key={purpose.value}
                        value={purpose.value}
                        className="group relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-3 pr-10 text-sm font-medium outline-none transition-all duration-200 text-gray-400 hover:text-white focus:bg-white/[0.06] focus:text-white data-[state=checked]:bg-white/[0.04] data-[state=checked]:text-white mb-1 last:mb-0 [&>span.absolute]:text-emerald-400"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] ring-1 ring-white/[0.05] transition-all duration-200 group-hover:scale-110 group-focus:scale-110 group-focus:bg-white/[0.08] group-data-[state=checked]:bg-emerald-500/10 group-data-[state=checked]:ring-emerald-500/30 group-data-[state=checked]:shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]", purpose.color)}>
                            <Icon className="w-4 h-4 group-data-[state=checked]:scale-110 transition-transform duration-200" />
                          </div>
                          <span className="truncate tracking-wide group-data-[state=checked]:text-emerald-50 transition-colors">{purpose.value}</span>
                        </div>
                      </SelectItem>
                    )})}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ===== STEP 3: Context ===== */}
          <div ref={step3Ref} className="p-6 sm:p-8 pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Add Context</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Tell us about yourself so the email feels authentic</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Background */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2.5">
                  <UserCheck className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    formData.background ? "text-emerald-400" : "text-gray-500"
                  )} />
                  <label className="text-sm font-medium text-gray-300">Why should they care?</label>
                  {touched.background && !formData.background && (
                    <span className="text-[11px] text-red-500 ml-auto animate-in fade-in slide-in-from-right-2 duration-300">Required</span>
                  )}
                  {formData.background && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto animate-in fade-in zoom-in duration-300" />
                  )}
                </div>
                <textarea
                  placeholder="e.g. I'm a React developer, built 3 projects, 2nd year IT student at SPPU"
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  onBlur={() => handleBlur("background")}
                  className={cn(
                    "w-full bg-white/[0.06] border rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 min-h-[120px] resize-none",
                    touched.background && !formData.background
                      ? "border-red-500/30 focus:border-red-500/40"
                      : formData.background
                        ? "border-emerald-500/25 focus:border-emerald-500/35"
                        : "border-white/[0.08] focus:border-white/[0.15]"
                  )}
                />
                {formData.background && (
                  <p className="text-[11px] text-gray-400 mt-1.5 text-right animate-in fade-in duration-300">
                    {formData.background.length} characters
                  </p>
                )}
              </div>

              {/* Two column fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-2.5">
                    <User className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-300">
                      Recipient name <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                  </div>
                  <input
                    placeholder="e.g. Rahul"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-white/[0.15]"
                  />
                </div>

                {/* Your Name */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-2.5">
                    <User className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      formData.senderName ? "text-emerald-400" : "text-gray-500"
                    )} />
                    <label className="text-sm font-medium text-gray-300">Your name</label>
                    {touched.senderName && !formData.senderName && (
                      <span className="text-[11px] text-red-500 ml-auto animate-in fade-in slide-in-from-right-2 duration-300">Required</span>
                    )}
                  </div>
                  <input
                    placeholder="e.g. Alex"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    onBlur={() => handleBlur("senderName")}
                    className={cn(
                      "w-full bg-white/[0.06] border rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300",
                      touched.senderName && !formData.senderName
                        ? "border-red-500/30 focus:border-red-500/40"
                        : formData.senderName
                          ? "border-emerald-500/25 focus:border-emerald-500/35"
                          : "border-white/[0.08] focus:border-white/[0.15]"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== STEP 4: Branding ===== */}
          <div ref={step4Ref} className="p-6 sm:p-8 pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Add Branding</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Upload banner images for a professional look</p>
                </div>
              </div>
            </div>

            <EmailBannerSettings
              headerBanner={formData.headerBanner}
              footerBanner={formData.footerBanner}
              onHeaderChange={(v) => setFormData({ ...formData, headerBanner: v })}
              onFooterChange={(v) => setFormData({ ...formData, footerBanner: v })}
            />

            {/* Skip hint */}
            {!formData.headerBanner && !formData.footerBanner && (
              <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  This step is <span className="text-white font-medium">completely optional</span>. Your emails will work great without banners too.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="relative border-t border-white/[0.06] p-4 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* Left side: Back button or step info */}
            <div className="flex items-center gap-3">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 active:scale-[0.97]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <p className="text-[11px] text-gray-500">
                  Step {currentStep} of {steps.length}
                </p>
              )}
            </div>

            {/* Right side: Next or Submit */}
            <div className="flex items-center gap-3">
              {/* Step completion hint */}
              {!canProceed(currentStep) && (
                <p className="text-[11px] text-gray-500 hidden sm:block animate-in fade-in duration-300">
                  {currentStep === 1 && !apiKey && "Add your API key to continue"}
                  {currentStep === 2 && (!formData.recipient || !formData.purpose) && "Fill all fields to continue"}
                  {currentStep === 3 && (!formData.background || !formData.senderName) && "Complete all fields to continue"}
                </p>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed(currentStep) || isAnimating}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 border active:scale-[0.97]",
                    canProceed(currentStep)
                      ? "bg-white text-gray-900 border-white/80 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                      : "bg-white/[0.04] text-gray-500 border-white/[0.06] cursor-not-allowed"
                  )}
                >
                  {currentStep === 3 ? "Add Branding" : "Continue"}
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    canProceed(currentStep) && "group-hover:translate-x-0.5"
                  )} />
                </button>
              ) : currentStep === 4 ? (
                <div className="flex items-center gap-2">
                  {/* Skip branding option */}
                  {!formData.headerBanner && !formData.footerBanner && (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !isValid}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border",
                        "text-gray-400 border-white/[0.06] hover:text-white hover:border-white/[0.1]"
                      )}
                    >
                      Skip & Generate
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !isValid}
                    className={cn(
                      "flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-500 border active:scale-[0.98]",
                      isValid
                        ? "bg-white text-gray-900 border-white/80 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                        : "bg-white/[0.04] text-gray-500 border-white/[0.06] cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate My Emails
                        <ArrowRight className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          isValid && "group-hover:translate-x-1"
                        )} />
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
