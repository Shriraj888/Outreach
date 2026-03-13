"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const proofItems: Array<{
  value: string
  label: string
}> = [
  {
    value: "3 angles",
    label: "One brief. Three tones.",
  },
  {
    value: "12 sec",
    label: "Blank page to first draft.",
  },
  {
    value: "Reply-ready",
    label: "Sounds human, not generated.",
  },
]

const toneItems = [
  {
    name: "Formal",
    description: "Clear framing for recruiters and operators.",
    background: "linear-gradient(135deg, rgba(96,165,250,0.22), rgba(34,211,238,0.04))",
  },
  {
    name: "Casual",
    description: "Relaxed, warm, and easy to respond to.",
    background: "linear-gradient(135deg, rgba(167,139,250,0.22), rgba(232,121,249,0.04))",
  },
  {
    name: "Bold",
    description: "Sharper positioning when you need contrast.",
    background: "linear-gradient(135deg, rgba(251,113,133,0.22), rgba(251,146,60,0.04))",
  },
]

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null)
  const spotlight = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const root = container.current
    if (!root) return

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } })

    intro
      .fromTo(
        ".hero-heading",
        { y: 72, opacity: 0, rotateX: -24 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "expo.out",
        }
      )
      .fromTo(
        ".hero-copy",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
        "-=0.75"
      )
      .fromTo(
        ".hero-actions",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.55"
      )
      .fromTo(
        ".hero-proof-card",
        { y: 20, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08 },
        "-=0.45"
      )
      .fromTo(
        ".hero-panel",
        { y: 40, opacity: 0, scale: 0.96, rotateX: 10 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.15, ease: "expo.out" },
        "-=0.95"
      )
      .fromTo(
        ".hero-panel-card",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 },
        "-=0.85"
      )

    gsap.to(".hero-orbit-one", {
      rotate: 360,
      duration: 24,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    })

    gsap.to(".hero-orbit-two", {
      rotate: -360,
      duration: 30,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    })

    gsap.to(".hero-depth-one", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    })

    gsap.to(".hero-depth-two", {
      yPercent: -18,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    })

    const parallaxItems = gsap.utils.toArray<HTMLElement>(".hero-parallax")

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5

      if (spotlight.current) {
        gsap.to(spotlight.current, {
          x: relativeX * 70,
          y: relativeY * 50,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        })
      }

      parallaxItems.forEach((item, index) => {
        const strength = 18 + index * 4
        gsap.to(item, {
          x: relativeX * strength,
          y: relativeY * strength,
          duration: 1.1,
          ease: "power3.out",
          overwrite: "auto",
        })
      })
    }

    const resetPointer = () => {
      if (spotlight.current) {
        gsap.to(spotlight.current, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })
      }

      parallaxItems.forEach((item) => {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          overwrite: "auto",
        })
      })
    }

    root.addEventListener("pointermove", handlePointerMove)
    root.addEventListener("pointerleave", resetPointer)

    return () => {
      root.removeEventListener("pointermove", handlePointerMove)
      root.removeEventListener("pointerleave", resetPointer)
    }
  }, { scope: container })

  return (
    <section ref={container} className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-18 lg:pt-32 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="hero-depth-one absolute left-1/2 top-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(173,95,255,0.2) 0%, rgba(173,95,255,0) 72%)",
          }}
        />
        <div
          className="hero-depth-two absolute right-[6%] top-[16%] h-[20rem] w-[20rem] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 72%)",
          }}
        />
        <div
          className="hero-depth-one absolute left-[4%] bottom-[8%] h-[18rem] w-[18rem] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(214,10,71,0.14) 0%, rgba(214,10,71,0) 72%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(380px,0.98fr)] xl:gap-16">
          <div className="relative">
            <div className="space-y-2 sm:space-y-3">
              <div className="overflow-hidden">
                <h1 className="hero-heading [text-wrap:balance] text-5xl font-medium tracking-[-0.06em] text-white opacity-0 sm:text-6xl lg:text-[5.25rem] lg:leading-[0.98]">
                  Cold emails with
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-heading [text-wrap:balance] text-5xl font-medium tracking-[-0.06em] opacity-0 sm:text-6xl lg:text-[5.25rem] lg:leading-[0.98]">
                  <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                    taste, timing,
                  </span>
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-heading [text-wrap:balance] text-5xl font-medium tracking-[-0.06em] text-white opacity-0 sm:text-6xl lg:text-[5.25rem] lg:leading-[0.98]">
                  and intent.
                </h1>
              </div>
            </div>

            <p className="hero-copy mt-5 max-w-xl text-base leading-7 text-gray-400 opacity-0 sm:text-lg sm:leading-8">
              Write first drafts that feel researched, personal, and confident.
              Feed three inputs, generate three distinct angles, and send the
              one that matches your voice.
            </p>

            <div className="hero-actions mt-7 opacity-0">
              <Link
                href="/craft"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 sm:px-8 sm:text-base"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 55%, #8b5cf6 100%)",
                  boxShadow: "0 0 0 1px rgba(139,92,246,0.45), 0 12px 40px -10px rgba(109,40,217,0.65), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))" }}
                />
                <span className="relative">Craft your first draft</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-8 flex items-stretch divide-x divide-white/[0.07]">
              {proofItems.map((item) => (
                <div
                  key={item.value}
                  className="hero-proof-card flex flex-1 flex-col gap-1 px-4 first:pl-0 last:pr-0 opacity-0"
                >
                  <p className="text-lg font-semibold tracking-tight text-white">{item.value}</p>
                  <p className="text-[11px] leading-snug text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] lg:mt-1 lg:mx-0">
            <div
              className="hero-orbit hero-orbit-one absolute -left-6 top-2 z-0 h-[26rem] w-[26rem] rounded-full opacity-70"
              style={{
                background:
                  "conic-gradient(from 180deg, rgba(173,95,255,0) 0deg, rgba(173,95,255,0.42) 90deg, rgba(173,95,255,0) 180deg, rgba(255,255,255,0.16) 260deg, rgba(173,95,255,0) 360deg)",
                maskImage:
                  "radial-gradient(circle, transparent 63%, black 65%, black 68%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 63%, black 65%, black 68%, transparent 70%)",
              }}
            />
            <div
              className="hero-orbit hero-orbit-two absolute -right-10 bottom-10 z-0 h-[18rem] w-[18rem] rounded-full opacity-60"
              style={{
                background:
                  "conic-gradient(from 120deg, rgba(59,130,246,0) 0deg, rgba(59,130,246,0.4) 120deg, rgba(59,130,246,0) 220deg, rgba(214,10,71,0.2) 300deg, rgba(59,130,246,0) 360deg)",
                maskImage:
                  "radial-gradient(circle, transparent 60%, black 63%, black 67%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 60%, black 63%, black 67%, transparent 70%)",
              }}
            />

            <div
              ref={spotlight}
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(173,95,255,0.18) 0%, rgba(173,95,255,0) 72%)",
              }}
            />

            <div
              className="hero-panel hero-depth-two relative overflow-hidden rounded-[2rem] border border-white/[0.1] p-4 opacity-0 shadow-[0_40px_120px_-48px_rgba(114,74,255,0.45)] backdrop-blur-2xl sm:p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Sequence preview</p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">First draft, already refined.</h2>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Live preview
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.18fr)_minmax(220px,0.82fr)]">
                <div className="hero-panel-card rounded-[1.75rem] border border-white/[0.08] bg-black/30 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-white">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Internship outreach</p>
                        <p className="text-xs text-gray-500">Generated from 3 structured inputs</p>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
                      Draft 01
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Subject</p>
                    <p className="mt-1.5 text-base font-medium text-white">
                      A quick idea for your product growth team
                    </p>
                  </div>

                  <div className="mt-3 space-y-2.5 text-sm leading-6 text-gray-300">
                    <p>
                      Hi Riya, loved how Acme is simplifying onboarding for first-time users.
                    </p>
                    <p>
                      I build React product experiments fast and would love to bring that pace to your growth team.
                    </p>
                    <p>
                      If useful, I can share a few projects directly relevant to this role.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-3 text-xs text-gray-500">
                    <span>Warm intro tone</span>
                    <span>Clear ask</span>
                    <span>Easy to reply</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="hero-panel-card rounded-[1.75rem] border border-white/[0.08] bg-black/30 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Quality signal</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-medium tracking-tight text-white">87%</p>
                        <p className="mt-1 text-sm text-gray-400">Human tone score</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                          <span>Clarity</span>
                          <span>94</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.05]">
                          <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-white to-violet-300" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                          <span>Specificity</span>
                          <span>88</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.05]">
                          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    {toneItems.map((tone) => (
                      <div
                        key={tone.name}
                        className="hero-panel-card relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-black/30 p-3.5 backdrop-blur-xl"
                      >
                        <div
                          className="absolute inset-0 opacity-80"
                          style={{ background: tone.background }}
                        />
                        <div className="relative">
                          <p className="text-sm font-medium text-white">{tone.name}</p>
                          <p className="mt-1 text-xs leading-[1.35] text-gray-300">{tone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
