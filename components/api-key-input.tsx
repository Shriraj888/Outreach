"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Key, ExternalLink, CheckCircle2, AlertCircle, Loader2, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
}

type KeyStatus = "idle" | "checking" | "valid" | "invalid"

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [keyStatus, setKeyStatus] = useState<KeyStatus>("idle")
  const [keyType, setKeyType] = useState<"gemini" | "openrouter" | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedKey = localStorage.getItem("gemini_api_key")
    if (savedKey && !value) {
      onChange(savedKey)
    }
  }, [onChange, value])

  // Detect key type and auto-verify
  useEffect(() => {
    if (!value || value.length < 10) {
      setKeyStatus("idle")
      setKeyType(null)
      return
    }

    if (value.startsWith("sk-or-")) {
      setKeyType("openrouter")
    } else if (value.startsWith("AIza")) {
      setKeyType("gemini")
    } else {
      setKeyType(null)
    }

    // Debounced verification
    const timer = setTimeout(async () => {
      setKeyStatus("checking")
      try {
        if (value.startsWith("sk-or-")) {
          // Verify OpenRouter key
          const res = await fetch("https://openrouter.ai/api/v1/models", {
            headers: { Authorization: `Bearer ${value}` },
          })
          setKeyStatus(res.ok ? "valid" : "invalid")
        } else if (value.startsWith("AIza")) {
          // Verify Gemini key with a minimal request
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${value}`
          )
          setKeyStatus(res.ok ? "valid" : "invalid")
        } else {
          setKeyStatus("idle")
        }
      } catch {
        setKeyStatus("invalid")
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [value])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    if (newValue) {
      localStorage.setItem("gemini_api_key", newValue)
    } else {
      localStorage.removeItem("gemini_api_key")
    }
  }

  if (!isMounted) return null

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden mb-6">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">API Key</h3>
              <p className="text-xs text-gray-500">Required to generate emails</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.1] bg-white/[0.04]"
            >
              Gemini <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.1] bg-white/[0.04]"
            >
              OpenRouter <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            placeholder="Paste your API key here..."
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(
              "w-full bg-white/[0.06] border rounded-xl py-3.5 px-4 pr-20 text-sm font-mono text-white placeholder:text-gray-500 outline-none transition-all duration-300",
              keyStatus === "valid" && "border-emerald-500/30 focus:border-emerald-500/50",
              keyStatus === "invalid" && "border-red-500/30 focus:border-red-500/50",
              keyStatus === "checking" && "border-blue-500/30",
              keyStatus === "idle" && "border-white/[0.08] focus:border-white/[0.15]"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Status indicator */}
            <div className={cn(
              "transition-all duration-300",
              keyStatus === "idle" && "opacity-0 scale-75",
              keyStatus !== "idle" && "opacity-100 scale-100"
            )}>
              {keyStatus === "checking" && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              )}
              {keyStatus === "valid" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              {keyStatus === "invalid" && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            {/* Toggle visibility */}
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Status message */}
        <div className="mt-3 flex items-center justify-between">
          <div className={cn(
            "text-xs transition-all duration-300 flex items-center gap-1.5",
            keyStatus === "valid" && "text-emerald-600",
            keyStatus === "invalid" && "text-red-500",
            keyStatus === "checking" && "text-blue-500",
            keyStatus === "idle" && "text-gray-400"
          )}>
            {keyStatus === "valid" && (
              <>
                <CheckCircle2 className="w-3 h-3" />
                {keyType === "openrouter" ? "OpenRouter key verified" : "Gemini key verified"}
              </>
            )}
            {keyStatus === "invalid" && (
              <>
                <AlertCircle className="w-3 h-3" />
                Key verification failed. Check your key.
              </>
            )}
            {keyStatus === "checking" && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Verifying key...
              </>
            )}
            {keyStatus === "idle" && (
              <>
                <Shield className="w-3 h-3" />
                Stored locally, never sent to our servers
              </>
            )}
          </div>
          {keyType && keyStatus !== "idle" && (
            <span className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded-md border",
              keyType === "gemini" && "text-blue-600 border-blue-500/20 bg-blue-500/5",
              keyType === "openrouter" && "text-purple-600 border-purple-500/20 bg-purple-500/5"
            )}>
              {keyType === "gemini" ? "GEMINI" : "OPENROUTER"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
