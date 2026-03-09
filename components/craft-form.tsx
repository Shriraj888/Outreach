"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { ApiKeyInput } from "@/components/api-key-input"

const purposes = [
  "Internship",
  "Freelance Project",
  "Mentorship",
  "Collaboration",
  "Job Opportunity",
  "Investment / Funding",
  "Other",
]

export interface FormData {
  recipient: string
  purpose: string
  background: string
  recipientName: string
  senderName: string
}

export function CraftForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    purpose: "",
    background: "",
    recipientName: "",
    senderName: "",
  })

  const handleSubmit = async () => {
    if (!formData.recipient || !formData.purpose || !formData.background || !formData.senderName || !apiKey) {
      return
    }

    setIsLoading(true)
    
    // Store form data and API key in sessionStorage for the results page
    sessionStorage.setItem("craftFormData", JSON.stringify(formData))
    sessionStorage.setItem("craft_api_key", apiKey)
    
    router.push("/craft/results")
  }

  const isValid = formData.recipient && formData.purpose && formData.background && formData.senderName && apiKey

  return (
    <div className="space-y-0">
      <ApiKeyInput value={apiKey} onChange={setApiKey} />
      
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-lg">
      <FieldGroup>
        <Field>
          <FieldLabel>Who are you emailing?</FieldLabel>
          <Input
            placeholder="e.g. CTO of a Mumbai fintech startup"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            className="bg-input border-border"
          />
        </Field>

        <Field>
          <FieldLabel>What do you want?</FieldLabel>
          <Select
            value={formData.purpose}
            onValueChange={(value) => setFormData({ ...formData, purpose: value })}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select your purpose" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Why should they care about you?</FieldLabel>
          <Textarea
            placeholder="e.g. I'm a React developer, built 3 projects, 2nd year IT student at SPPU"
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            className="bg-input border-border min-h-[120px] resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>
            {"Recipient's name"} <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            placeholder="e.g. Rahul"
            value={formData.recipientName}
            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            className="bg-input border-border"
          />
        </Field>

        <Field>
          <FieldLabel>Your name</FieldLabel>
          <Input
            placeholder="e.g. Shriraj"
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            className="bg-input border-border"
          />
        </Field>
      </FieldGroup>

      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <>
            <Spinner className="w-5 h-5" />
            Generating...
          </>
        ) : (
          <>
            Generate My Emails
            <Zap className="w-5 h-5" />
          </>
        )}
      </button>
      </div>
    </div>
  )
}
