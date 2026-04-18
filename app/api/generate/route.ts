import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { NextRequest, NextResponse } from "next/server"

// Simple delay helper
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Parse JSON from text, even if wrapped in markdown code blocks
function extractJSON(text: string) {
  if (!text) return null
  
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {
    // noop
  }

  // Try to extract from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim())
    } catch {
      // noop
    }
  }

  // Try to find JSON object in text anywhere
  const firstOpen = text.indexOf('{')
  const lastClose = text.lastIndexOf('}')
  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    try {
      const jsonStr = text.substring(firstOpen, lastClose + 1)
      return JSON.parse(jsonStr)
    } catch {
      // noop
    }
  }

  return null
}

// OpenRouter models — paid first (no rate limit), free as fallbacks
const OPENROUTER_MODELS = [
  "google/gemma-3-27b-it",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
]

function isRetryableError(errMsg: string, statusCode?: number): boolean {
  return (
    statusCode === 429 ||
    statusCode === 503 ||
    statusCode === 502 ||
    errMsg.includes("RESOURCE_EXHAUSTED") ||
    errMsg.includes("quota") ||
    errMsg.includes("rate") ||
    errMsg.includes("Too Many Requests") ||
    errMsg.includes("overloaded") ||
    errMsg.includes("capacity") ||
    errMsg.includes("503") ||
    errMsg.includes("SAFETY") ||
    errMsg.toLowerCase().includes("safety")
  )
}

function isModelUnavailable(errMsg: string, statusCode?: number): boolean {
  return (
    statusCode === 404 ||
    errMsg.includes("No endpoints found") ||
    errMsg.includes("not found") ||
    errMsg.includes("does not exist") ||
    errMsg.includes("model_not_found")
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, apiKey: rawApiKey, singleStyle } = body
    const apiKey = rawApiKey ? rawApiKey.trim() : ""

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    const isOpenRouter = apiKey.startsWith("sk-or-")
    const fullPromptSuffix = singleStyle
      ? `\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation. Just the raw JSON object with keys: subject, body.`
      : `\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation. Just the raw JSON object with keys: formal, casual, bold, tips.`

    // --- Gemini direct path (fast, single model) ---
    if (!isOpenRouter) {
      const google = createGoogleGenerativeAI({ apiKey })
      const model = google("gemini-2.5-flash")

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const result = await generateText({ model, prompt: prompt + fullPromptSuffix })
          const parsed = extractJSON(result.text)

          if (singleStyle) {
            if (parsed?.subject && parsed?.body) return NextResponse.json(parsed)
          } else {
            if (parsed?.formal?.subject && parsed?.casual?.subject && parsed?.bold?.subject) {
              if (!Array.isArray(parsed.tips)) parsed.tips = ["Keep it short and concise", "Follow up within 3-5 days"]
              return NextResponse.json(parsed)
            }
          }

          if (attempt < 2) { await delay(1000); continue }
          return NextResponse.json(
            { error: "AI returned an unparseable response. Please try again." },
            { status: 500 }
          )
        } catch (err: unknown) {
          const statusCode = (err as Record<string, unknown>)?.statusCode ?? (err as Record<string, unknown>)?.status
          if (statusCode === 429 || statusCode === 503) {
            if (attempt < 2) { await delay(2000); continue }
          }
          const msg = err instanceof Error ? err.message : "Unknown error"
          if (statusCode === 401 || statusCode === 403) {
            return NextResponse.json({ error: "Invalid Gemini API key. Please check your key." }, { status: 401 })
          }
          return NextResponse.json({ error: `Generation failed: ${msg.substring(0, 200)}` }, { status: typeof statusCode === 'number' ? statusCode : 500 })
        }
      }
    }

    // --- OpenRouter path: try each model in sequence, no long waits ---
    const { createOpenRouter } = await import("@openrouter/ai-sdk-provider")
    const openrouter = createOpenRouter({
      apiKey,
      headers: {
        "HTTP-Referer": "https://cold-mail-crafter.vercel.app",
        "X-Title": "Cold Mail Crafter"
      }
    })

    let lastError: unknown = null

    for (const modelId of OPENROUTER_MODELS) {
      const model = openrouter(modelId)
      console.log(`Trying model: ${modelId}`)

      try {
        const result = await generateText({ model, prompt: prompt + fullPromptSuffix })
        const text = result.text

        if (!text || text.trim() === "") {
          console.log(`Empty response from ${modelId}, trying next model...`)
          lastError = new Error("Empty response from model")
          continue
        }

        const parsed = extractJSON(text)

        if (singleStyle) {
          if (parsed?.subject && parsed?.body) {
            console.log(`✓ Success with ${modelId}`)
            return NextResponse.json(parsed)
          }
          console.log(`Invalid JSON from ${modelId} for single style, trying next...`)
          lastError = new Error("Invalid JSON response")
          continue
        }

        // Full generation
        if (parsed?.formal?.subject && parsed?.formal?.body &&
            parsed?.casual?.subject && parsed?.casual?.body &&
            parsed?.bold?.subject && parsed?.bold?.body) {
          if (!Array.isArray(parsed.tips)) {
            parsed.tips = ["Keep the email short and concise", "Follow up within 3-5 days"]
          }
          console.log(`✓ Success with ${modelId}`)
          return NextResponse.json(parsed)
        }

        console.log(`Incomplete JSON from ${modelId}, trying next...`)
        lastError = new Error("Incomplete JSON from model")
        continue

      } catch (err: unknown) {
        lastError = err
        const errMsg = err instanceof Error ? err.message : ""
        const statusCode = ((err as Record<string, unknown>)?.statusCode ?? (err as Record<string, unknown>)?.status) as number | undefined

        console.error(`✗ ${modelId} failed:`, errMsg.substring(0, 100), "Status:", statusCode)

        // Auth/payment errors on paid model — fall through to free models
        // Only hard-fail if a FREE model returns 401 (means key is truly invalid)
        if (statusCode === 401 || statusCode === 402 || statusCode === 403) {
          if (modelId.includes(":free")) {
            // Free model rejected the key — key is genuinely invalid
            return NextResponse.json(
              { error: "Invalid or unauthorized OpenRouter API key. Please check your key." },
              { status: 401 }
            )
          }
          // Paid model returned 401/402 — likely no credits, try free models
          console.log(`→ Paid model needs credits, trying free models...`)
          continue
        }

        // Rate limited or model unavailable — immediately try next model
        if (isRetryableError(errMsg, statusCode) || isModelUnavailable(errMsg, statusCode)) {
          console.log(`→ Switching to next model...`)
          continue
        }

        // Unknown error — try next model anyway
        console.log(`→ Unknown error, trying next model...`)
        continue
      }
    }

    // All models exhausted
    console.error("All OpenRouter models failed. Last error:", lastError instanceof Error ? lastError.message : lastError)

    const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error"
    const statusCode = (lastError as Record<string, unknown>)?.statusCode ?? (lastError as Record<string, unknown>)?.status ?? 500

    if (statusCode === 429 || errorMessage.includes("Too Many Requests") || errorMessage.includes("rate") || errorMessage.includes("quota")) {
      return NextResponse.json(
        { error: "All free models are rate-limited right now. Please wait 30 seconds and try again." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: `Generation failed: ${errorMessage.substring(0, 200)}` },
      { status: 500 }
    )
  } catch (error: unknown) {
    console.error("API route unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
