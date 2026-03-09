import { generateText, Output } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const EmailSchema = z.object({
  formal: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  casual: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  bold: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  tips: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    // Create Google Generative AI provider with user's API key
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      output: Output.object({ schema: EmailSchema }),
    })

    if (!result.object) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      )
    }

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("API route error:", error)
    
    // Check for API key errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    if (errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("403")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Gemini API key and try again." },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to generate emails. Please try again." },
      { status: 500 }
    )
  }
}
