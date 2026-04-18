"use client"

import { Bot, FileEdit, RefreshCcw, Lightbulb, Sparkles, ExternalLink, ImagePlus } from "lucide-react"
import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// ── Reusable Bento Card wrapper ──────────────────────────────────────
interface BentoCardProps {
  children: ReactNode;
  accentRGB: string;           // CSS rgb values e.g. "168,85,247"
  className?: string;          // custom layout classes
  spotlightSize?: "sm" | "md" | "lg";
}

function BentoCard({ children, accentRGB, className = "", spotlightSize = "md" }: BentoCardProps) {
  const sizeMap = {
    sm: "w-[350px] h-[350px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[800px] h-[800px]",
  }
  
  return (
    <div className={`bento-card group relative rounded-[28px] overflow-hidden transform-gpu opacity-0 w-full h-full ${className}`}
      style={{
        background: `linear-gradient(160deg, rgba(${accentRGB},0.06) 0%, rgba(255,255,255,0.025) 40%, rgba(${accentRGB},0.03) 100%)`,
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Mouse‑following spotlight */}
      <div className={`spotlight-effect absolute ${sizeMap[spotlightSize]} rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0`}
        style={{ background: `rgba(${accentRGB},0.10)` }} />

      {/* Animated top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
        <div className="w-full h-full animate-[shimmer_3s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${accentRGB},0.5), transparent)`,
          }} />
      </div>

      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 80px -20px rgba(${accentRGB},0.08)`,
        }} />

      {children}
    </div>
  );
}

// ── Reusable bottom content block (icon + title + desc) ──────────────
interface CardContentProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentRGB: string;
  wide?: boolean;
}

function CardContent({ icon, title, description, accentRGB, wide }: CardContentProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pointer-events-none z-10 w-full flex flex-col justify-end">
      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg bg-gray-900/50"
        style={{
          background: `linear-gradient(135deg, rgba(${accentRGB},0.18), rgba(${accentRGB},0.08))`,
          border: `1px solid rgba(${accentRGB},0.25)`,
          boxShadow: `0 0 20px -5px rgba(${accentRGB},0.15)`,
        }}>
        {icon}
      </div>
      <h3 className="text-[20px] font-semibold text-white mb-2.5 tracking-tight">{title}</h3>
      <p className={`text-gray-400 leading-[1.65] text-[14px] font-light ${wide ? "max-w-md" : ""}`}>
        {description}
      </p>
    </div>
  );
}

// ── Main Features Section ────────────────────────────────────────────
export function FeaturesSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollConfig = { trigger: container.current, start: "top 65%" };
    const tl = gsap.timeline({ scrollTrigger: scrollConfig });

    // Header animation
    tl.fromTo(".feature-badge",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    tl.fromTo(".feature-title span",
      { y: 80, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: "expo.out" },
      "-=0.6"
    );

    // Cards entrance
    tl.fromTo(".bento-card",
      { y: 100, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: "power4.out" },
      "-=0.8"
    );

    // ── Spotlight (quickTo) ──
    gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card) => {
      const effect = card.querySelector('.spotlight-effect') as HTMLElement;
      if (!effect) return;

      const xTo = gsap.quickTo(effect, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(effect, "y", { duration: 0.4, ease: "power3" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseenter", () => gsap.to(effect, { opacity: 1, duration: 0.3, scale: 1.2 }));
      card.addEventListener("mouseleave", () => gsap.to(effect, { opacity: 0, duration: 0.5, scale: 1 }));
    });

    // ── Micro‑animations ──
    // Terminal cursor blink
    gsap.to(".term-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.4, ease: "steps(1)" });

    // Regeneration Icon Spin
    gsap.to(".regen-spin", {
      rotation: 360,
      repeat: -1,
      duration: 6,
      ease: "linear"
    });

    // Floating UI elements
    gsap.to(".float-ui", {
      y: -5,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
      stagger: 0.2
    });

  }, { scope: container });

  return (
    <section id="features" ref={container} className="relative py-32 sm:py-40 overflow-hidden perspective-1000">

      {/* Background grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="text-center mb-20 sm:mb-24 flex flex-col items-center">
          <div className="feature-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8 opacity-0">
            <Sparkles className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Core Capabilities</span>
          </div>

          <h2 className="feature-title text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] text-white leading-[1.05] flex flex-col items-center justify-center">
            <span className="block transform-gpu origin-bottom opacity-0 mb-1 lg:mb-2">The complete toolkit.</span>
            <span className="block bg-gradient-to-r from-gray-300 to-gray-600 bg-clip-text text-transparent transform-gpu origin-bottom opacity-0 pb-2">End-to-end outreach.</span>
          </h2>
        </div>

        {/* ── Custom Heights Bento Grid Structure ────────────────── */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Top Row: AI Generation (Span 2) + Manual Edit (Span 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[460px]">
            
            {/* 1. Cold Mails Generation (Span 2) */}
            <div className="md:col-span-2 h-[440px] md:h-full">
              <BentoCard accentRGB="168,85,247" spotlightSize="md">
                <div className="absolute inset-x-0 top-0 h-[65%] pt-8 sm:pt-10 bg-gradient-to-b from-purple-500/[0.08] to-transparent flex justify-center items-start">
                  <div className="w-[85%] max-w-[480px] rounded-xl border border-white/[0.08] bg-[#0a0a0a]/90 shadow-[0_30px_60px_-15px_rgba(168,85,247,0.15)] overflow-hidden font-mono text-[10px] sm:text-[12px] md:text-[13px] z-10 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                      </div>
                      <span className="ml-4 text-white/40 truncate">generate.ts</span>
                    </div>
                    <div className="p-5 space-y-2.5 text-white/60 bg-[#050505]/50 leading-relaxed">
                      <div><span className="text-purple-400">await</span> <span className="text-blue-400">AI</span>.<span className="text-cyan-400">generateEmail</span>({`{`}</div>
                      <div className="pl-6"><span className="text-white/80">&quot;intent&quot;</span>: <span className="text-emerald-400">&quot;Meeting Request&quot;</span>,</div>
                      <div className="pl-6"><span className="text-white/80">&quot;recipient&quot;</span>: <span className="text-emerald-400">&quot;VPE at TechScale&quot;</span></div>
                      <div>{`}`})</div>
                      <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-cyan-300">
                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> 
                        Synthesizing hyper-personalized copy...
                        <span className="term-cursor inline-block w-2 h-4 align-middle bg-white/70" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent
                  icon={<Bot className="w-5 h-5 text-purple-400" />}
                  title="AI Cold Mail Generation"
                  description="Leverage advanced LLMs to automatically forge unique, highly-contextualized outreach copy that cuts through the noise and guarantees high reply rates."
                  accentRGB="168,85,247"
                  wide
                />
              </BentoCard>
            </div>

            {/* 2. Editable Mails (Span 1) */}
            <div className="md:col-span-1 h-[420px] md:h-full">
              <BentoCard accentRGB="16,185,129" spotlightSize="sm">
                <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/[0.06] to-transparent p-6 z-10">
                  <div className="bg-gray-900 border border-white/10 p-5 rounded-2xl text-[13px] text-white/50 shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out w-full max-w-[280px]">
                    <p className="mb-2">Hi Sarah,</p>
                    <p className="leading-relaxed">
                      I loved your recent post about <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded relative z-10 group/edit cursor-pointer transition-colors hover:bg-emerald-500/20">
                        scaling teams
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111] text-emerald-400 border border-emerald-500/30 px-2 py-1.5 rounded-md text-[10px] whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity font-medium tracking-wide shadow-lg flex items-center gap-1.5">
                          <FileEdit className="w-3 h-3" /> Manual Override
                        </span>
                      </span>. Are you open to a quick call?
                    </p>
                  </div>
                </div>
                <CardContent
                  icon={<FileEdit className="w-5 h-5 text-emerald-400" />}
                  title="Full Editing Control"
                  description="Don't lose your human touch. Visually review and flawlessly intervene on any AI-generated drafts before dispatching."
                  accentRGB="16,185,129"
                />
              </BentoCard>
            </div>

          </div>

          {/* Middle Row: Regeneration + Email Branding + Direct Sending */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[420px]">
            
            {/* 3. Mail Regeneration */}
            <div className="md:col-span-1 h-[400px] md:h-full">
              <BentoCard accentRGB="59,130,246" spotlightSize="sm">
                <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center z-10 from-blue-500/[0.05] bg-gradient-to-b to-transparent">
                  <div className="relative w-full h-full flex flex-col items-center justify-center -translate-y-4">
                    <div className="relative w-28 h-28 rounded-full border-[1px] border-dashed border-blue-500/30 flex items-center justify-center bg-blue-500/[0.02] regen-spin shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:border-blue-500/50 transition-colors duration-700">
                      <div className="w-16 h-16 rounded-full border border-blue-500/20 flex items-center justify-center bg-gray-950/80 backdrop-blur-md">
                        <RefreshCcw className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    {/* Floating elements */}
                    <div className="float-ui absolute top-[25%] left-[20%] px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-[10px] text-blue-300 shadow-xl backdrop-blur-md rotate-[-10deg]">Variant A</div>
                    <div className="float-ui absolute bottom-[20%] right-[15%] px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-[10px] text-pink-300 shadow-xl backdrop-blur-md rotate-[12deg] delay-100">Variant B</div>
                    <div className="float-ui absolute top-[15%] right-[25%] px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-[10px] text-emerald-300 shadow-xl backdrop-blur-md rotate-[5deg] delay-300">Variant C</div>
                  </div>
                </div>
                <CardContent
                  icon={<RefreshCcw className="w-5 h-5 text-blue-400" />}
                  title="One-Click Regeneration"
                  description="Not quite the right tone? Effortlessly pivot email styles, structures, and angles to find the absolute perfect pitch with a single click."
                  accentRGB="59,130,246"
                />
              </BentoCard>
            </div>

            {/* 4. Email Branding — Header & Footer Banners (NEW) */}
            <div className="md:col-span-1 h-[400px] md:h-full">
              <BentoCard accentRGB="236,72,153" spotlightSize="sm">
                <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center z-10 bg-gradient-to-b from-pink-500/[0.06] to-transparent">
                  <div className="relative w-[85%] max-w-[260px] flex flex-col gap-3 group-hover:-translate-y-2 transition-transform duration-500">
                    {/* Header banner preview */}
                    <div className="w-full h-10 rounded-xl bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-blue-500/20 border border-pink-500/20 flex items-center justify-center gap-2 shadow-[0_4px_20px_-4px_rgba(236,72,153,0.2)]">
                      <ImagePlus className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-[10px] font-semibold text-pink-300 uppercase tracking-wider">Header Banner</span>
                    </div>

                    {/* Email body mockup */}
                    <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-pink-500/60" />
                        <span className="text-[10px] text-white/40 font-medium">Subject line here...</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 bg-white/[0.06] rounded-full w-full" />
                        <div className="h-1.5 bg-white/[0.06] rounded-full w-[85%]" />
                        <div className="h-1.5 bg-white/[0.06] rounded-full w-[70%]" />
                        <div className="h-1.5 bg-white/[0.06] rounded-full w-[90%]" />
                      </div>
                    </div>

                    {/* Footer banner preview */}
                    <div className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/20 border border-violet-500/20 flex items-center justify-center gap-2 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.2)]">
                      <ImagePlus className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-[10px] font-semibold text-violet-300 uppercase tracking-wider">Footer Banner</span>
                    </div>
                  </div>
                </div>
                <CardContent
                  icon={<ImagePlus className="w-5 h-5 text-pink-400" />}
                  title="Email Branding"
                  description="Add custom header and footer banners to your emails. Upload branded images that make every outreach look professional and trustworthy."
                  accentRGB="236,72,153"
                />
              </BentoCard>
            </div>

            {/* 5. Client Handoff */}
            <div className="md:col-span-1 h-[400px] md:h-full">
              <BentoCard accentRGB="34,211,238" spotlightSize="sm">
                <div className="absolute inset-x-0 top-0 h-[55%] flex flex-col items-center justify-center z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/[0.08] to-transparent">
                  
                  <div className="flex flex-col gap-4 bg-[#0a0a0a]/90 border border-white/10 p-5 rounded-[20px] w-[90%] max-w-[280px] shadow-[0_20px_40px_-10px_rgba(34,211,238,0.1)] group-hover:-translate-y-2 transition-transform duration-500 z-10 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[20px] blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-[13px] font-medium text-white/80">Export to Mail</span>
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                          <span className="text-[11px] font-bold text-red-400">G</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                          <span className="text-[11px] font-bold text-blue-400">O</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-white/10 relative z-10"></div>

                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-[10px] shrink-0 bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                        <ExternalLink className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-white/95 font-medium tracking-tight mb-0.5">Draft exported</span>
                        <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">Redirecting<span className="animate-pulse">...</span></span>
                      </div>
                    </div>
                  </div>

                </div>
                <CardContent
                  icon={<ExternalLink className="w-5 h-5 text-cyan-400" />}
                  title="1-Click Client Export"
                  description="Select your preferred mailing platform natively. We instantly populate the compose window with your AI-generated copy."
                  accentRGB="34,211,238"
                />
              </BentoCard>
            </div>

          </div>

          {/* Bottom Row: Pro Tips (Span 3 - Full Width) */}
          <div className="w-full h-auto md:h-[320px]">
             <BentoCard accentRGB="245,158,11" spotlightSize="lg">
                <div className="absolute inset-0 flex flex-col md:flex-row items-center p-8 md:p-12 z-10 gap-8 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.05),_transparent_60%)]">
                  
                  <div className="flex-1 max-w-xl md:pr-10">
                    <div className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-6 shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))`,
                        border: `1px solid rgba(245,158,11,0.3)`,
                        boxShadow: `0 0 30px -5px rgba(245,158,11,0.2)`,
                      }}>
                      <Lightbulb className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-[26px] md:text-3xl font-semibold text-white mb-4 tracking-tight drop-shadow-sm">Strategic Pro Tips & Insights</h3>
                    <p className="text-gray-400 leading-[1.7] text-[15px] font-light">
                      Stop guessing what drives replies. Our platform natively provides actionable strategies, proven structural templates, and critical deliverability recommendations so you operate like a seasoned outbound veteran.
                    </p>
                  </div>

                  <div className="flex-1 w-full flex justify-center md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10 h-full items-center">
                    <div className="bg-[#080808]/80 backdrop-blur-sm border border-amber-500/20 rounded-[20px] p-6 w-full max-w-sm hover:border-amber-500/50 transition-colors duration-500 shadow-[0_15px_40px_-15px_rgba(245,158,11,0.15)] relative group/tip cursor-default">
                      <div className="absolute top-0 right-8 -mt-3.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover/tip:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-shadow">
                        <Sparkles className="w-3 h-3" /> Live Insight
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[15px] font-semibold text-white/90">Deliverability Protection</span>
                      </div>
                      <p className="text-white/50 text-[13px] leading-relaxed">
                        Always warm up your email accounts gradually. Scale your sending limits up consistently over 3 weeks to prevent severely damaging your domain reputation and hitting spam traps.
                      </p>
                    </div>
                  </div>

                </div>
             </BentoCard>
          </div>

        </div>
      </div>
    </section>
  )
}
