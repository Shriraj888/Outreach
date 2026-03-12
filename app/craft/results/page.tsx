"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { EmailCard } from "@/components/email-card"
import { GeneratingLoader } from "@/components/generating-loader"
import { ProTips } from "@/components/pro-tips"
import type { FormData } from "@/components/craft-form"

interface EmailVariant {
  subject: string
  body: string
}

interface EmailResults {
  formal: EmailVariant
  casual: EmailVariant
  bold: EmailVariant
  tips: string[]
}

export default function ResultsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<EmailResults | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({})

  const generateEmails = async (data: FormData, key: string) => {
    setIsLoading(true)
    setError(null)

    const prompt = `You are an expert cold email copywriter. Generate 3 cold email variants based on this info:
- Recipient: ${data.recipient}
- Purpose: ${data.purpose}
- Sender background: ${data.background}
- Recipient name: ${data.recipientName || "the recipient"}
- Sender name: ${data.senderName}

Return ONLY a JSON object in this exact format, no markdown, no extra text:
{
  "formal": { "subject": "...", "body": "..." },
  "casual": { "subject": "...", "body": "..." },
  "bold": { "subject": "...", "body": "..." },
  "tips": ["tip1", "tip2", "tip3"]
}`

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey: key }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate emails")
      }

      setResults(responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedData = sessionStorage.getItem("craftFormData")
    const storedApiKey = sessionStorage.getItem("craft_api_key")

    if (!storedData || !storedApiKey) {
      router.push("/craft")
      return
    }

    const data = JSON.parse(storedData) as FormData
    setFormData(data)
    setApiKey(storedApiKey)
    generateEmails(data, storedApiKey)
  }, [router])

  const handleRegenerate = async (style: "formal" | "casual" | "bold") => {
    if (!formData || !apiKey || regenerating[style]) return

    setRegenerating((prev) => ({ ...prev, [style]: true }))

    const styleDescriptions = {
      formal: "formal and professional",
      casual: "casual and friendly",
      bold: "bold and attention-grabbing",
    }

    const prompt = `You are an expert cold email copywriter. Generate exactly 1 ${styleDescriptions[style]} cold email variant based on this info:
- Recipient: ${formData.recipient}
- Purpose: ${formData.purpose}
- Sender background: ${formData.background}
- Recipient name: ${formData.recipientName || "the recipient"}
- Sender name: ${formData.senderName}

Return ONLY a JSON object in this exact format, no markdown, no extra text:
{ "subject": "...", "body": "..." }`

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey, singleStyle: true }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to regenerate email")
      }

      setResults((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          [style]: {
            subject: responseData.subject,
            body: responseData.body,
          },
        }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Regeneration failed"
      toast.error(message)
    } finally {
      setRegenerating((prev) => ({ ...prev, [style]: false }))
    }
  }

  const handleRetry = () => {
    if (formData && apiKey) {
      generateEmails(formData, apiKey)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <Link
          href="/craft"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Editor
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] mb-6">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">AI Generated</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4 tracking-tight">
            Your Cold Emails
          </h1>
          <p className="text-gray-500 text-lg font-light">
            Three distinct approaches. Pick the one that resonates.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <GeneratingLoader size="default" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-red-400 mb-2 text-lg font-medium">Generation Failed</p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : results ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmailCard
                style="formal"
                label="Formal"
                color="blue"
                subject={results.formal.subject}
                body={results.formal.body}
                isRegenerating={regenerating.formal}
                onRegenerate={() => handleRegenerate("formal")}
              />
              <EmailCard
                style="casual"
                label="Casual"
                color="green"
                subject={results.casual.subject}
                body={results.casual.body}
                isRegenerating={regenerating.casual}
                onRegenerate={() => handleRegenerate("casual")}
              />
              <EmailCard
                style="bold"
                label="Bold"
                color="orange"
                subject={results.bold.subject}
                body={results.bold.body}
                isRegenerating={regenerating.bold}
                onRegenerate={() => handleRegenerate("bold")}
              />
            </div>

            <ProTips tips={results.tips} />
          </div>
        ) : null}
      </div>
    </main>
  )
}
