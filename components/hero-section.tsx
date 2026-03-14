"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react"
import type { IconType } from "react-icons"
import {
  SiGmail,
  SiZoho,
} from "react-icons/si"
import { FaMicrosoft, FaYahoo } from "react-icons/fa6"
import { useRef, useState } from "react"
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

const mailProviders: Array<{
  name: string
  icon: IconType
  color: string
}> = [
  { name: "Gmail", icon: SiGmail, color: "#EA4335" },
  { name: "Yahoo", icon: FaYahoo, color: "#7B0099" },
  { name: "Microsoft", icon: FaMicrosoft, color: "#00A4EF" },
  { name: "Zoho", icon: SiZoho, color: "#F59E0B" },
]

const mailMarqueeItems = Array(20).fill(mailProviders).flat()

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

export function HeroSection() {
  const router = useRouter()
  const container = useRef<HTMLDivElement>(null)
  const spotlight = useRef<HTMLDivElement>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleCraftNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsNavigating(true);
    
    // Zoom out the whole container perfectly to create a "warping" feel, then navigate
    gsap.to(container.current, {
      scale: 0.98,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        router.push('/craft');
        setTimeout(() => setIsNavigating(false), 500); 
      }
    });
  };

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
      .fromTo(
        ".hero-mail-marquee",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.7"
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

    const marqueeTween = gsap.to(".hero-mail-track", {
      xPercent: -50,
      duration: 30, // Reduced from 80 for a slightly faster baseline speed
      repeat: -1,
      ease: "none",
      force3D: true, // Forces GPU acceleration for smoother continuous loop
    })

    // Advance progress to half so it can infinitely loop in both directions instantly without hitting 0 bounds.
    marqueeTween.progress(0.5);

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Change direction based on scroll (-1 for up = move right, 1 for down = move left)
        const direction = self.direction === -1 ? -1 : 1
        
        // Boost speed smoothly based on scroll velocity (parallax effect)
        let velocity = Math.max(0.2, Math.abs(self.getVelocity() / 300))
        
        gsap.to(marqueeTween, {
          timeScale: direction * (1 + velocity),
          duration: 0.5,
          overwrite: true,
        })
        
        // Return to normal speed when scroll stops, maintaining the current direction
        gsap.to(marqueeTween, {
          timeScale: direction,
          duration: 1,
          delay: 0.2,
          overwrite: "auto",
        })
      }
    })

    gsap.to(".hero-mail-motion", {
      y: -54,
      scale: 1.04,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    })

    gsap.to(".hero-mail-parallax", {
      x: -150, // Move by fixed pixel amount instead of huge percentage of w-max
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smoother scrub
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
                onClick={handleCraftNavigation}
                className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all duration-300 sm:px-8 sm:text-base ${
                  isNavigating ? "scale-95 shadow-none opacity-80" : "hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,0.4)]"
                }`}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0))" }}
                />
                
                {isNavigating ? (
                  <>
                    <Loader2 className="relative h-5 w-5 animate-spin" />
                    <span className="relative">Activating Engine...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Craft your first draft</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
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

              <div className="flex items-center justify-between gap-4 pb-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400/80">Sequence preview</p>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">Outreach, optimized.</h2>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Live preview
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.18fr)_minmax(220px,0.82fr)]">
                <div className="hero-panel-card rounded-[1.75rem] border border-white/[0.08] bg-black/30 p-5 backdrop-blur-xl transition-colors hover:bg-black/40">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-white shadow-inner">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white tracking-tight">Internship outreach</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Generated via AI synthesis</p>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-gray-400">
                      Draft
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.03]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/80">Subject</p>
                    <p className="mt-1.5 text-[15px] font-medium text-white tracking-tight">
                      SWE Intern for Acme's Growth Pod
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-gray-300">
                    <p>
                      <span className="text-white font-medium">Hi Alex,</span> noticed Acme just shipped the new workspace sync. Beautifully executed.
                    </p>
                    <p>
                      I'm a CS undergrad who builds & ships React projects quickly. I'm looking to bring that same velocity to your growth team as a summer intern.
                    </p>
                    <p>
                      Can I share a live app I built using your exact tech stack?
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[11px] font-medium text-gray-400">
                    <span className="rounded-full bg-white/[0.03] px-2.5 py-1 border border-white/[0.05]">Warm intro</span>
                    <span className="rounded-full bg-white/[0.03] px-2.5 py-1 border border-white/[0.05]">Clear ask</span>
                    <span className="rounded-full bg-white/[0.03] px-2.5 py-1 border border-white/[0.05]">Easy reply</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="hero-panel-card rounded-[1.75rem] border border-white/[0.08] bg-black/30 p-5 backdrop-blur-xl transition-colors hover:bg-black/40">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Quality signal</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-4xl font-semibold tracking-tighter text-white">87<span className="text-2xl text-gray-400 font-medium">%</span></p>
                        <p className="mt-1 text-[13px] font-medium text-gray-400">Human tone score</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3.5">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                          <span>Clarity</span>
                          <span className="text-white">94</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-violet-500/50 to-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                          <span>Specificity</span>
                          <span className="text-white">88</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-fuchsia-500/50 to-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {toneItems.map((tone) => (
                      <div
                        key={tone.name}
                        className="group hero-panel-card relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-black/30 p-4 backdrop-blur-xl transition-all hover:bg-white/[0.02]"
                      >
                        <div
                          className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-80"
                          style={{ background: tone.background }}
                        />
                        <div className="relative">
                          <p className="text-[13px] font-semibold text-white">{tone.name}</p>
                          <p className="mt-1 text-[12px] leading-relaxed text-gray-400">{tone.description}</p>
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

      <div className="hero-mail-motion relative left-1/2 z-10 mt-12 w-screen -translate-x-1/2 sm:mt-14">
        <div
          className="hero-mail-marquee relative overflow-hidden py-2 opacity-0 sm:py-3"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
          }}
        >
          <div className="hero-mail-parallax w-max will-change-transform">
            <div className="hero-mail-track flex w-max items-center gap-7 sm:gap-10 will-change-transform">
              {mailMarqueeItems.map((provider, index) => {
                const Icon = provider.icon

                return (
                  <div
                    key={`${provider.name}-${index}`}
                    className="group flex items-center justify-center px-1"
                    aria-label={provider.name}
                  >
                    <Icon
                      className="h-8 w-8 opacity-45 grayscale transition-all duration-300 group-hover:scale-110 group-hover:opacity-90 group-hover:grayscale-0 sm:h-9 sm:w-9"
                      style={{ color: provider.color }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
