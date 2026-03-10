"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { CraftForm } from "@/components/craft-form"

export default function CraftPage() {
  return (
    <main className="min-h-screen bg-black py-8 px-4 sm:px-6">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white/60">AI Email Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4 tracking-tight">
            Craft Your Email
          </h1>
          <p className="text-white/40 text-lg font-light max-w-md mx-auto">
            Fill in the details and let AI generate 3 unique cold email styles for you
          </p>
        </div>

        <CraftForm />
      </div>
    </main>
  )
}
