"use client"

import { motion } from "framer-motion"
import { Lightbulb, ArrowUpRight, Zap, Target, Sparkles } from "lucide-react"
import { useState } from "react"

interface ProTipsProps {
  tips: string[]
}

const icons = [Target, Zap, Sparkles]

const accents = [
  { glow: "bg-blue-500/20", border: "hover:border-blue-500/30", text: "group-hover:text-blue-400", bg: "group-hover:bg-blue-500/10" },
  { glow: "bg-purple-500/20", border: "hover:border-purple-500/30", text: "group-hover:text-purple-400", bg: "group-hover:bg-purple-500/10" },
  { glow: "bg-teal-500/20", border: "hover:border-teal-500/30", text: "group-hover:text-teal-400", bg: "group-hover:bg-teal-500/10" }
]

export function ProTips({ tips }: ProTipsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-20 relative w-full"
    >
      <div className="flex items-center gap-5 mb-10 px-2">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.1] shadow-lg backdrop-blur-md">
           <div className="absolute inset-0 rounded-full bg-white/[0.02] backdrop-blur-3xl animate-pulse" />
           <Lightbulb className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] relative z-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight">
            Pro Tips
          </h2>
          <p className="text-gray-400 text-xs mt-1.5 font-bold tracking-[0.2em] uppercase">
            Elevate your outreach
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {tips.map((tip, idx) => {
          const Icon = icons[idx % icons.length]
          const isHovered = hoveredIdx === idx
          const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx
          const accent = accents[idx % accents.length]

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`group relative flex flex-col p-4 md:p-8 rounded-[24px] md:rounded-[32px] transition-all duration-500 cursor-default ${
                isOtherHovered ? "opacity-30 scale-[0.97]" : "opacity-100 scale-100"
              } bg-[#0a0a0a] border border-white/[0.06] ${accent.border} overflow-hidden`}
              style={{
                boxShadow: isHovered ? "0 20px 40px -20px rgba(0,0,0,0.5)" : "none"
              }}
            >
              {/* Massive background number watermark */}
              <div className="absolute -top-4 -right-2 md:-top-10 md:-right-8 text-[100px] md:text-[200px] font-black text-white/[0.02] leading-none select-none pointer-events-none transition-transform duration-700 group-hover:-translate-x-4 group-hover:translate-y-4">
                {idx + 1}
              </div>

              {/* Glowing accent spot under icon */}
              <div className={`absolute top-4 left-4 md:top-8 md:left-8 w-16 h-16 md:w-20 md:h-20 ${accent.glow} rounded-full blur-[40px] transition-opacity duration-500 opacity-0 group-hover:opacity-100`} />

              <div className="relative z-10 flex-grow">
                <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.04] text-white/50 mb-4 md:mb-8 border border-white/[0.05] transition-all duration-500 group-hover:scale-110 ${accent.bg} ${accent.text}`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                
                <p className="text-[12px] md:text-[15px] text-gray-400 leading-relaxed font-light mb-4 md:mb-8 group-hover:text-gray-100 transition-colors duration-500 line-clamp-4 md:line-clamp-none">
                  {tip}
                </p>
              </div>

              <div className={`relative z-10 mt-auto flex items-center text-[11px] md:text-sm font-semibold text-white/30 ${accent.text} transition-colors duration-500`}>
                <span>Insight</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 ml-1 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
