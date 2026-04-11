"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles, Square } from "lucide-react"
import { toast } from "sonner"
import { EmailCard } from "@/components/email-card"
import { GeneratingLoader } from "@/components/generating-loader"
import { ProTips } from "@/components/pro-tips"
import type { FormData } from "@/components/craft-form"

interface BannerData {
  headerBanner: string
  footerBanner: string
}

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
  const [banners, setBanners] = useState<BannerData>({ headerBanner: "", footerBanner: "" })
  const abortControllerRef = useRef<AbortController | null>(null)
  const regenerateControllersRef = useRef<Record<string, AbortController>>({})

  const generateEmails = async (data: FormData, key: string) => {
    // Abort any previous generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

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
        signal: controller.signal,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate emails")
      }

      setResults(responseData)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User cancelled — don't show error
        return
      }
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
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
    setBanners({
      headerBanner: data.headerBanner || "",
      footerBanner: data.footerBanner || "",
    })
    generateEmails(data, storedApiKey)
  }, [router])

  const handleRegenerate = async (style: "formal" | "casual" | "bold") => {
    if (!formData || !apiKey || regenerating[style]) return

    // Abort any previous regeneration for this style
    if (regenerateControllersRef.current[style]) {
      regenerateControllersRef.current[style].abort()
    }
    const controller = new AbortController()
    regenerateControllersRef.current[style] = controller

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
        signal: controller.signal,
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
      if (err instanceof DOMException && err.name === "AbortError") {
        // User cancelled — don't show error
        return
      }
      const message = err instanceof Error ? err.message : "Regeneration failed"
      toast.error(message)
    } finally {
      if (!controller.signal.aborted) {
        setRegenerating((prev) => ({ ...prev, [style]: false }))
      }
      if (regenerateControllersRef.current[style] === controller) {
        delete regenerateControllersRef.current[style]
      }
    }
  }

  const handleRetry = () => {
    if (formData && apiKey) {
      generateEmails(formData, apiKey)
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setError(null)
  }

  const handleStopRegeneration = (style: "formal" | "casual" | "bold") => {
    if (regenerateControllersRef.current[style]) {
      regenerateControllersRef.current[style].abort()
      delete regenerateControllersRef.current[style]
    }
    setRegenerating((prev) => ({ ...prev, [style]: false }))
  }

  const handleEditSuggestion = async (style: "formal" | "casual" | "bold", suggestion: string) => {
    if (!results || !apiKey || regenerating[style]) return

    // Abort any previous regeneration for this style
    if (regenerateControllersRef.current[style]) {
      regenerateControllersRef.current[style].abort()
    }
    const controller = new AbortController()
    regenerateControllersRef.current[style] = controller

    setRegenerating((prev) => ({ ...prev, [style]: true }))

    const currentEmail = results[style]

    const prompt = `You are an expert cold email copywriter. Here is an existing cold email:

Subject: ${currentEmail.subject}

Body:
${currentEmail.body}

The user wants the following changes applied to this email:
"${suggestion}"

Please modify the email according to the user's instructions while maintaining the overall tone and quality. Return ONLY a JSON object in this exact format, no markdown, no extra text:
{ "subject": "...", "body": "..." }`

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, apiKey, singleStyle: true }),
        signal: controller.signal,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to apply edits")
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
      toast.success("Edits applied!")
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
      const message = err instanceof Error ? err.message : "Failed to apply edits"
      toast.error(message)
    } finally {
      if (!controller.signal.aborted) {
        setRegenerating((prev) => ({ ...prev, [style]: false }))
      }
      if (regenerateControllersRef.current[style] === controller) {
        delete regenerateControllersRef.current[style]
      }
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
          <div className="flex flex-col items-center justify-center py-32 gap-8">
            <GeneratingLoader size="default" />
            <button
              id="stop-generation-btn"
              onClick={handleStopGeneration}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
            >
              <Square className="w-3.5 h-3.5 fill-current animate-pulse group-hover:animate-none" />
              Stop Generation
            </button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <EmailCard
                style="formal"
                label="Formal"
                color="blue"
                subject={results.formal.subject}
                body={results.formal.body}
                headerBanner={banners.headerBanner}
                footerBanner={banners.footerBanner}
                isRegenerating={regenerating.formal}
                onRegenerate={() => handleRegenerate("formal")}
                onStopRegenerate={() => handleStopRegeneration("formal")}
                onEditSuggestion={(suggestion) => handleEditSuggestion("formal", suggestion)}
              />
              <EmailCard
                style="casual"
                label="Casual"
                color="green"
                subject={results.casual.subject}
                body={results.casual.body}
                headerBanner={banners.headerBanner}
                footerBanner={banners.footerBanner}
                isRegenerating={regenerating.casual}
                onRegenerate={() => handleRegenerate("casual")}
                onStopRegenerate={() => handleStopRegeneration("casual")}
                onEditSuggestion={(suggestion) => handleEditSuggestion("casual", suggestion)}
              />
              <EmailCard
                style="bold"
                label="Bold"
                color="orange"
                subject={results.bold.subject}
                body={results.bold.body}
                headerBanner={banners.headerBanner}
                footerBanner={banners.footerBanner}
                isRegenerating={regenerating.bold}
                onRegenerate={() => handleRegenerate("bold")}
                onStopRegenerate={() => handleStopRegeneration("bold")}
                onEditSuggestion={(suggestion) => handleEditSuggestion("bold", suggestion)}
              />
            </div>

            <ProTips tips={results.tips} />
          </div>
        ) : null}
      </div>
    </main>
  )
}
