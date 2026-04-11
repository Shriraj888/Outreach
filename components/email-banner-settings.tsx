"use client"

import { useState, useRef, useCallback } from "react"
import { ImagePlus, X, Upload, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailBannerSettingsProps {
  headerBanner: string
  footerBanner: string
  onHeaderChange: (value: string) => void
  onFooterChange: (value: string) => void
}

const MAX_FILE_SIZE = 500 * 1024 // 500KB
const MAX_WIDTH = 600
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

function resizeImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Canvas not supported"))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        // Use JPEG for smaller size, keep PNG for transparency
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg"
        const quality = 0.85
        const dataUrl = canvas.toDataURL(mimeType, quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error("Invalid image"))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface UploadZoneProps {
  label: string
  sublabel: string
  value: string
  onChange: (value: string) => void
  icon: React.ReactNode
  accentColor: string
}

function UploadZone({ label, sublabel, value, onChange, icon, accentColor }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are supported")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${formatFileSize(file.size)}). Max ${formatFileSize(MAX_FILE_SIZE)}.`)
      return
    }

    try {
      const dataUrl = await resizeImage(file, MAX_WIDTH)
      onChange(dataUrl)
    } catch {
      setError("Failed to process image. Please try another.")
    }
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [processFile])

  const handleRemove = useCallback(() => {
    onChange("")
    setError(null)
  }, [onChange])

  if (value) {
    return (
      <div className="group/banner space-y-2.5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-[11px] text-emerald-400/70 ml-auto">Added</span>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
          {/* Preview image */}
          <div className="relative w-full flex items-center justify-center bg-[#0a0a0a] p-3">
            <img
              src={value}
              alt={label}
              className="max-w-full h-auto max-h-[140px] object-contain rounded-lg"
            />
          </div>

          {/* Remove button */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <span className="text-[11px] text-gray-500">Banner image • Max 600px wide</span>
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all duration-300"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-[11px] text-gray-500 ml-auto">Optional</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "upload-zone relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 cursor-pointer transition-all duration-300",
          isDragging
            ? `border-${accentColor}-500/40 bg-${accentColor}-500/5 scale-[1.01]`
            : error
              ? "border-red-500/20 bg-red-500/[0.03]"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]",
          isDragging && "upload-zone-active"
        )}
      >
        <div className={cn(
          "w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300",
          isDragging
            ? "border-blue-500/30 bg-blue-500/10 text-blue-400 scale-110"
            : "border-white/[0.08] bg-white/[0.04] text-gray-500"
        )}>
          {isDragging ? (
            <Upload className="w-5 h-5 animate-bounce" />
          ) : (
            <ImagePlus className="w-5 h-5" />
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            {isDragging ? (
              <span className="text-blue-400 font-medium">Drop image here</span>
            ) : (
              <>
                <span className="text-white font-medium hover:underline">Click to upload</span>
                {" "}or drag and drop
              </>
            )}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            {sublabel} • JPG, PNG, WebP • Max 500KB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/[0.06] border border-red-500/10 animate-in fade-in slide-in-from-top-1 duration-300">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <p className="text-[11px] text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}

export function EmailBannerSettings({
  headerBanner,
  footerBanner,
  onHeaderChange,
  onFooterChange,
}: EmailBannerSettingsProps) {
  return (
    <div className="space-y-6">
      <UploadZone
        label="Header Banner"
        sublabel="Appears at the top of your email"
        value={headerBanner}
        onChange={onHeaderChange}
        icon={<ImageIcon className={cn(
          "w-4 h-4 transition-colors duration-300",
          headerBanner ? "text-emerald-400" : "text-gray-500"
        )} />}
        accentColor="blue"
      />

      <div className="relative">
        <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <UploadZone
        label="Footer Banner"
        sublabel="Appears at the bottom of your email"
        value={footerBanner}
        onChange={onFooterChange}
        icon={<ImageIcon className={cn(
          "w-4 h-4 transition-colors duration-300",
          footerBanner ? "text-emerald-400" : "text-gray-500"
        )} />}
        accentColor="violet"
      />
    </div>
  )
}
