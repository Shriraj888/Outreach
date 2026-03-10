"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { EmailCard } from "@/components/email-card"
import { ShimmerCards } from "@/components/shimmer-cards"
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
        // Use the actual error message from the API response
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

  const handleRegenerate = (style: "formal" | "casual" | "bold") => {
    if (formData && apiKey) {
      generateEmails(formData, apiKey)
    }
  }

  const handleRetry = () => {
    if (formData && apiKey) {
      generateEmails(formData, apiKey)
    }
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <div className="max-w-6xl mx-auto">
        <Link
          href="/craft"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Try Another
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Your Cold Emails
          </h1>
          <p className="text-muted-foreground">
            Choose the style that fits your situation best
          </p>
        </div>

        {isLoading ? (
          <ShimmerCards />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : results ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <EmailCard
                style="formal"
                label="Formal"
                color="blue"
                subject={results.formal.subject}
                body={results.formal.body}
                onRegenerate={() => handleRegenerate("formal")}
              />
              <EmailCard
                style="casual"
                label="Casual"
                color="green"
                subject={results.casual.subject}
                body={results.casual.body}
                onRegenerate={() => handleRegenerate("casual")}
              />
              <EmailCard
                style="bold"
                label="Bold"
                color="orange"
                subject={results.bold.subject}
                body={results.bold.body}
                onRegenerate={() => handleRegenerate("bold")}
              />
            </div>

            <ProTips tips={results.tips} />
          </>
        ) : null}
      </div>
    </main>
  )
}
