"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load saved API key from localStorage on mount
    const savedKey = localStorage.getItem("gemini_api_key")
    if (savedKey && !value) {
      onChange(savedKey)
    }
  }, [onChange, value])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    // Persist to localStorage for convenience
    if (newValue) {
      localStorage.setItem("gemini_api_key", newValue)
    } else {
      localStorage.removeItem("gemini_api_key")
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">API Key Required</h3>
          <p className="text-sm text-muted-foreground">
            Enter your Gemini API key to generate emails
          </p>
        </div>
      </div>

      <Field>
        <FieldLabel className="flex items-center justify-between">
          <span>Gemini API Key</span>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Get a free key
            <ExternalLink className="w-3 h-3" />
          </a>
        </FieldLabel>
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="AIza..."
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-input border-border pr-10 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </Field>

      <p className="text-xs text-muted-foreground mt-3">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  )
}
