"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { CraftForm } from "@/components/craft-form"

export default function CraftPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] mb-6">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">AI Email Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4 tracking-tight">
            Craft Your Email
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-md mx-auto">
            Fill in the details and let AI generate 3 unique cold email styles for you
          </p>
        </div>

        <CraftForm />
      </div>
    </main>
  )
}
