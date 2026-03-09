import { generateText, Output } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const EmailSchema = z.object({
  emails: z.array(
    z.object({
      style: z.string(),
      subject: z.string(),
      body: z.string(),
      tips: z.array(z.string()),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    const result = await generateText({
      model: "google/gemini-2.0-flash",
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
