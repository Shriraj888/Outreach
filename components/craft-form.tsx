"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, User, Target, MessageSquare, UserCheck, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiKeyInput } from "@/components/api-key-input"
import { cn } from "@/lib/utils"

const purposes = [
  { value: "Internship", icon: "🎓" },
  { value: "Freelance Project", icon: "💼" },
  { value: "Mentorship", icon: "🧭" },
  { value: "Collaboration", icon: "🤝" },
  { value: "Job Opportunity", icon: "🚀" },
  { value: "Investment / Funding", icon: "💰" },
  { value: "Other", icon: "✨" },
]

export interface FormData {
  recipient: string
  purpose: string
  background: string
  recipientName: string
  senderName: string
}

// Validation helper
function getFieldStatus(value: string, required: boolean = true) {
  if (!required) return value ? "filled" : "idle"
  if (!value) return "idle"
  if (value.length < 3) return "short"
  return "filled"
}

export function CraftForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    purpose: "",
    background: "",
    recipientName: "",
    senderName: "",
  })

  const handleSubmit = async () => {
    if (!formData.recipient || !formData.purpose || !formData.background || !formData.senderName || !apiKey) {
      // Mark all fields as touched to show validation
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

  const isValid = formData.recipient && formData.purpose && formData.background && formData.senderName && apiKey

  // Calculate completion percentage
  const totalFields = 4
  let completedFields = 0
  if (formData.recipient) completedFields++
  if (formData.purpose) completedFields++
  if (formData.background) completedFields++
  if (formData.senderName) completedFields++
  const progress = (completedFields / totalFields) * 100

  return (
    <div className="space-y-6">
      <ApiKeyInput value={apiKey} onChange={setApiKey} />

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

        <div className="relative p-6 sm:p-8 pt-8 space-y-6">

          {/* Field 1: Recipient */}
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

          {/* Field 2: Purpose */}
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
                "w-full bg-white/[0.06] border rounded-xl py-3.5 px-4 text-sm text-white outline-none transition-all duration-300 h-auto",
                touched.purpose && !formData.purpose
                  ? "border-red-500/30"
                  : formData.purpose
                    ? "border-emerald-500/25"
                    : "border-white/[0.08]"
              )}>
                <SelectValue placeholder="Select your purpose" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/[0.1] rounded-xl">
                {purposes.map((purpose) => (
                  <SelectItem key={purpose.value} value={purpose.value} className="text-gray-300 focus:text-white focus:bg-white/[0.06] rounded-lg">
                    <span className="flex items-center gap-2">
                      <span>{purpose.icon}</span>
                      {purpose.value}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field 3: Background */}
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
            {/* Field 4: Recipient Name */}
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

            {/* Field 5: Your Name */}
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
                placeholder="e.g. Shriraj"
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

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-500 border active:scale-[0.98]",
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

          {/* Completion hint */}
          {!isValid && completedFields > 0 && (
            <p className="text-center text-[11px] text-gray-400 animate-in fade-in duration-500">
              {totalFields - completedFields} field{totalFields - completedFields !== 1 ? "s" : ""} remaining{!apiKey ? " + API key" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
