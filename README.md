# Outreach - AI Cold Emails That Actually Get Replies

> 3 inputs. 3 styles. 12 seconds. One unfair advantage in every inbox.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Live Demo:** [v0-outreach-app.vercel.app](https://v0-outreach-app.vercel.app)  
**GitHub:** [github.com/Shriraj888/v0-outreach-app](https://github.com/Shriraj888/v0-outreach-app)

---

## What is Outreach?

Cold outreach is broken. Writing one cold email takes 30–60 minutes and it still sounds generic. Most people don't even send it. **Blank page paralysis is real.**

**Outreach** fixes that. Tell it who you're emailing, what you want, and why they should care and it generates three ready-to-send cold emails in 12 seconds.

- **Formal** - professional, structured, recruiter-ready
- **Casual** - warm, friendly, easy to respond to
- **Bold** - direct, confident, attention-grabbing

No account. No subscription. No setup. Just results.

---

## Features

- **Dual AI Provider Support** - Gemini (`gemini-2.5-flash`) and OpenRouter (`gemma-3-27b-it`), auto-detected by key prefix (`AIza*` → Gemini, `sk-or-*` → OpenRouter)
- **Live API Key Verification** - key is verified before form submission, never sent to any server
- **Partial Generation** - Casual and Bold ready while Formal is still generating
- **Stop Generation** - halts the API call mid-stream via `AbortController`, no refresh needed
- **Per-Style Regeneration** - regenerate one email without restarting all three
- **Suggest Edits** - natural language refinement per email card, other variants untouched
- **One-Click Export** - opens Gmail, Outlook, Yahoo, or default mail client with email pre-populated
- **Pro Tips** - context-aware outreach insights generated from your exact inputs
- **Fully Serverless** - no database, no backend infra, zero operational cost

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Scaffolding | v0.dev |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animation | GSAP + Framer Motion |
| AI — Gemini | `@ai-sdk/google` → `gemini-2.5-flash` |
| AI — OpenRouter | `@openrouter/ai-sdk-provider` → `gemma-3-27b-it` |
| AI SDK | Vercel AI SDK (`generateText`) |
| Deployment | Vercel |

---

## How It Works

```
Form Submit
    ↓
Key prefix detected (AIza* → Gemini / sk-or-* → OpenRouter)
    ↓
POST /api/generate
    ↓
generateText() via Vercel AI SDK
    ↓
extractJSON() → strips markdown fences, finds JSON anywhere in response
    ↓
3× exponential backoff (5s / 10s / 15s) on failure
    ↓
3 email variants + Pro Tips returned
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- A free API key from [Google AI Studio](https://aistudio.google.com/apikey) or [OpenRouter](https://openrouter.ai/keys)

### Installation

```bash
git clone https://github.com/Shriraj888/v0-outreach-app.git
cd v0-outreach-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### No `.env` needed

API keys are entered directly in the UI and stored in `localStorage`. Nothing is sent to any server, your key stays on your device.

---

## Project Structure

```
├── app/
│   ├── api/generate/route.ts   # AI pipeline — routing, retry, JSON parsing
│   ├── craft/page.tsx          # Email form page
│   └── craft/results/page.tsx  # Results page with email cards
├── components/
│   ├── email-card.tsx          # Email variant card with all controls
│   ├── craft-form.tsx          # Form with live key verification
│   ├── api-key-input.tsx       # Key input with auto-detect + verify
│   ├── generating-loader.tsx   # Animated orb loader
│   ├── pro-tips.tsx            # AI-generated outreach tips
│   ├── hero-section.tsx        # Landing page hero
│   ├── features-section.tsx    # Bento grid features
│   └── how-it-works-section.tsx
└── lib/utils.ts
```

---

## AI Pipeline Details

### Provider Auto-Detection

```typescript
const isOpenRouter = apiKey.startsWith("sk-or-")
// AIza* → Gemini (gemini-2.5-flash)
// sk-or-* → OpenRouter (gemma-3-27b-it)
```

### Resilient JSON Parsing

```typescript
function extractJSON(text: string) {
  // 1. Direct parse
  // 2. Strip markdown code fences
  // 3. Find JSON object anywhere in response
}
```

### Exponential Backoff

```typescript
// 3 attempts: 5s → 10s → 15s
// Handles rate limits, 503s, and malformed responses
```

### Mid-Stream Stop

```typescript
const controller = new AbortController()
// One click → controller.abort() → request cancelled instantly
```

---

## Target Audience

- Students hunting internships and jobs
- Freelancers pitching clients
- Founders doing early-stage outreach
- Professionals at every level

---

## Future Scope

- Chrome Extension - generate cold emails from any LinkedIn profile
- CRM Integration - HubSpot, Notion, Airtable
- Multi-language Support
- Analytics Dashboard - open rates, reply rates, best-performing tone
- Email Sequences -auto-generate follow-up emails
- Fine-tuned models trained on high-reply-rate datasets

---

## Built With

This project was scaffolded entirely with **[v0.dev](https://v0.dev)** and deployed on **[Vercel](https://vercel.com)**.

---

## Author

**Shriraj Patil**  
[LinkedIn](https://www.linkedin.com/in/shriraj-patil888/) · [GitHub](https://github.com/Shriraj888) · [Twitter](https://x.com/shriraj399)

---
