"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ShimmerCards() {
  const colors = ["blue", "emerald", "orange"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.06]" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16 rounded bg-white/[0.06]" />
              <Skeleton className="h-3 w-10 rounded bg-white/[0.04]" />
            </div>
          </div>

          {/* Subject */}
          <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] mb-5">
            <Skeleton className="h-2.5 w-12 rounded mb-2 bg-white/[0.04]" />
            <Skeleton className="h-4 w-full rounded bg-white/[0.06]" />
          </div>

          {/* Body lines */}
          <div className="space-y-2.5 mb-6">
            <Skeleton className="h-3.5 w-full rounded bg-white/[0.06]" />
            <Skeleton className="h-3.5 w-full rounded bg-white/[0.04]" />
            <Skeleton className="h-3.5 w-3/4 rounded bg-white/[0.06]" />
            <Skeleton className="h-3.5 w-full rounded bg-white/[0.04]" />
            <Skeleton className="h-3.5 w-5/6 rounded bg-white/[0.06]" />
            <Skeleton className="h-3.5 w-full rounded bg-white/[0.04]" />
            <Skeleton className="h-3.5 w-2/3 rounded bg-white/[0.06]" />
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-full rounded-xl bg-white/[0.06]" />
        </div>
      ))}
    </div>
  )
}
