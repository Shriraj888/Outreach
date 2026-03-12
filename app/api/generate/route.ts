import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { NextRequest, NextResponse } from "next/server"

// Simple delay helper
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Parse JSON from text, even if wrapped in markdown code blocks
function extractJSON(text: string) {
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

  // Try to find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      // noop
    }
  }

  return null
}

const MAX_RETRIES = 3

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, singleStyle } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    let model;

    // Check if the API key is an OpenRouter key (starts with sk-or-)
    if (apiKey.startsWith("sk-or-")) {
      const { createOpenRouter } = await import("@openrouter/ai-sdk-provider")
      const openrouter = createOpenRouter({ apiKey })
      // Use a reliable free model on OpenRouter
      model = openrouter("google/gemma-3-27b-it:free")
    } else {
      // Google Gemini direct
      const google = createGoogleGenerativeAI({ apiKey })
      model = google("gemini-2.0-flash")
    }

    // Retry loop for rate limits
    let lastError: unknown = null
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await generateText({
          model,
          prompt: singleStyle
            ? prompt + `\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation. Just the raw JSON object with keys: subject, body.`
            : prompt + `\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation. Just the raw JSON object with keys: formal, casual, bold, tips.`,
        })

        const text = result.text
        const parsed = extractJSON(text)

        // Single style regeneration
        if (singleStyle) {
          if (parsed && parsed.subject && parsed.body) {
            return NextResponse.json(parsed)
          }
          lastError = new Error("AI response was not valid JSON for single style. Raw: " + text.substring(0, 200))
          continue
        }

        // Full generation (all 3 styles)

        if (
          parsed &&
          parsed.formal &&
          parsed.casual &&
          parsed.bold &&
          parsed.formal.subject &&
          parsed.formal.body &&
          parsed.casual.subject &&
          parsed.casual.body &&
          parsed.bold.subject &&
          parsed.bold.body
        ) {
          // Ensure tips is an array
          if (!Array.isArray(parsed.tips)) {
            parsed.tips = ["Keep the email short and concise", "Follow up within 3-5 days"]
          }
          return NextResponse.json(parsed)
        }

        // If we got text but couldn't parse it properly, fail with context
        lastError = new Error("AI response was not valid JSON. Raw: " + text.substring(0, 200))
      } catch (err) {
        lastError = err
        const errMsg = err instanceof Error ? err.message : ""
        const statusCode = (err as { statusCode?: number })?.statusCode

        // If rate limited or quota exceeded, wait and retry
        if (
          statusCode === 429 ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("quota") ||
          errMsg.includes("rate")
        ) {
          const waitTime = attempt * 5000 // 5s, 10s, 15s
          console.log(`Rate limited. Retrying in ${waitTime / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`)
          await delay(waitTime)
          continue
        }

        // Non-retryable errors, break immediately
        break
      }
    }

    // If we got here, all retries failed
    console.error("API route error after retries:", lastError)

    const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error"
    const statusCode = (lastError as { statusCode?: number })?.statusCode ?? 500

    if (
      errorMessage.includes("Key limit exceeded") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("quota") ||
      statusCode === 429
    ) {
      return NextResponse.json(
        { error: "API quota exceeded. Please wait a minute and try again, or use a different API key." },
        { status: 429 }
      )
    }

    if (statusCode === 401 || statusCode === 403 || errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid or unauthorized API key. Please check your key." },
        { status: 401 }
      )
    }

    if (errorMessage.includes("No endpoints found") || errorMessage.includes("not found")) {
      return NextResponse.json(
        { error: "Model not available. Please try a different API key or try again later." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: `Generation failed: ${errorMessage.substring(0, 200)}` },
      { status: 500 }
    )
  } catch (error) {
    console.error("API route unexpected error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
