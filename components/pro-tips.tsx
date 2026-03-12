"use client"

import { Lightbulb, ChevronRight } from "lucide-react"

interface ProTipsProps {
  tips: string[]
}

export function ProTips({ tips }: ProTipsProps) {
  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Accent gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-500/[0.06] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Pro Tips</h3>
            <p className="text-xs text-gray-500">Expert advice for your outreach</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-amber-500/20 transition-all duration-300"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold mt-0.5">
                {index + 1}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
