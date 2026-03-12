"use client"

import { BrainCircuit, ShieldCheck, SlidersHorizontal, Sparkles, Terminal } from "lucide-react"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function FeaturesSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 65%",
      }
    });

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

    // Initial Card entrance
    tl.fromTo(".bento-card",
      { y: 100, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: "power4.out" },
      "-=0.8"
    );

    // Dynamic Mouse Spotlight effect on cards using quickTo
    const cards = gsap.utils.toArray<HTMLElement>(".bento-card");
    cards.forEach((card) => {
      const effect = card.querySelector('.spotlight-effect') as HTMLElement;
      if (!effect) return;
      
      const xTo = gsap.quickTo(effect, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(effect, "y", { duration: 0.4, ease: "power3" });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      });
      
      card.addEventListener("mouseenter", () => {
        gsap.to(effect, { opacity: 1, duration: 0.3, scale: 1.2 });
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(effect, { opacity: 0, duration: 0.5, scale: 1 });
      });
    });

    // Content Micro-animations
    
    // Card 1: Terminal Cursor Blinking
    gsap.to(".term-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" });

    // Card 2: Deliverability Score Build UI
    gsap.fromTo(".score-num", 
      { textContent: 0 }, 
      { 
        textContent: 99, 
        duration: 2.5, 
        ease: "power3.out", 
        snap: { textContent: 1 },
        scrollTrigger: { trigger: ".score-container", start: "top 80%" }
      }
    );
    // Circumference of r=45 is ~283 
    gsap.fromTo(".score-ring", 
      { strokeDashoffset: 283 }, 
      { 
        strokeDashoffset: 5, // Leaves a small gap to hit 99%
        duration: 2.5, 
        ease: "power3.out",
        scrollTrigger: { trigger: ".score-container", start: "top 80%" }
      }
    );

    // Card 3: Tone Pills Sequencer
    gsap.to(".tone-pill", { 
        boxShadow: "0 0 40px -5px var(--glow-color)",
        opacity: 1,
        stagger: {
          amount: 1.5,
          yoyo: true,
          repeat: -1,
        },
        duration: 0.8, 
        ease: "power1.inOut",
        scrollTrigger: { trigger: ".tone-container", start: "top 80%" }
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative py-32 sm:py-40 overflow-hidden perspective-1000">
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 sm:mb-24 flex flex-col items-center">
          <div className="feature-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8 opacity-0">
            <Sparkles className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Bento Masterpiece</span>
          </div>
          
          <h2 className="feature-title text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] text-white leading-[1.05] flex flex-col items-center justify-center">
            <span className="block transform-gpu origin-bottom opacity-0 mb-1 lg:mb-2">Beyond templates.</span>
            <span className="block text-gray-600 transform-gpu origin-bottom opacity-0">Engineered for responses.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          
          {/* Card 1: Context Engine (Span 2) */}
          <div className="bento-card relative md:col-span-2 group rounded-[28px] bg-white/[0.03] border border-white/[0.06] overflow-hidden transform-gpu opacity-0 backdrop-blur-xl">
            <div className="spotlight-effect absolute w-[500px] h-[500px] bg-purple-500/[0.06] rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.06]" />
            
            {/* Visual Header Graphic */}
            <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-purple-500/[0.08] to-transparent flex items-center justify-center border-b border-white/[0.04]">
              <div className="w-[80%] max-w-[420px] rounded-xl border border-white/[0.08] bg-gray-900 shadow-2xl overflow-hidden font-mono text-[11px] sm:text-xs z-10 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center px-4 py-2 border-b border-white/10 bg-white/[0.05]">
                  <div className="flex gap-1.5 ">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"/><div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"/><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"/>
                  </div>
                  <span className="ml-4 text-white/30 truncate hidden sm:block">ai_context_engine.ts</span>
                </div>
                <div className="p-4 space-y-2 text-white/50 bg-gray-950/50">
                  <div><span className="text-purple-400">const</span> <span className="text-blue-400">payload</span> = <span className="text-amber-300">await</span> <span className="text-cyan-400">analyzeTarget</span>({`{`}</div>
                  <div className="pl-4"><span className="text-white/80">"recipient"</span>: <span className="text-emerald-400">"CTO @ Fintech Startup"</span>,</div>
                  <div className="pl-4"><span className="text-white/80">"intent"</span>: <span className="text-emerald-400">"Demo Meeting"</span>,</div>
                  <div className="pl-4"><span className="text-white/80">"temperature"</span>: <span className="text-orange-400">0.8</span></div>
                  <div>{`}`});<span className="term-cursor inline-block w-2 h-3.5 align-middle ml-1 bg-white/70" /></div>
                </div>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 pointer-events-none z-10">
              <div className="w-12 h-12 rounded-[14px] bg-purple-500/[0.12] border border-purple-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:bg-purple-500/[0.18] transition-colors">
                <BrainCircuit className="w-[18px] h-[18px] text-purple-400" />
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-3 tracking-tight">Deep Context Analysis</h3>
              <p className="text-gray-500 leading-[1.6] text-[15px] font-light max-w-sm">We don't use fill-in-the-blank templates. Our engine fully understands the nuance of your target and objective to write a bespoke draft.</p>
            </div>
          </div>

          {/* Card 2: Deliverability Shield (Span 1) */}
          <div className="bento-card relative md:col-span-1 group rounded-[28px] bg-white/[0.03] border border-white/[0.06] overflow-hidden transform-gpu opacity-0 backdrop-blur-xl">
            <div className="spotlight-effect absolute w-[350px] h-[350px] bg-emerald-500/[0.08] rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.06]" />
            
            {/* Visual Graphic */}
            <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/[0.08] to-transparent">
              <div className="relative w-32 h-32 score-container z-10 group-hover:scale-105 transition-transform duration-500">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/[0.06]" />
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" className="text-emerald-500 score-ring drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" strokeDasharray="283" strokeDashoffset="283" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col shadow-inner">
                  <span className="text-3xl font-bold text-white tracking-tighter drop-shadow-md"><span className="score-num">0</span><span className="text-emerald-400 text-xl">%</span></span>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 pointer-events-none z-10">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-500/[0.12] border border-emerald-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-500/[0.18] transition-colors">
                <ShieldCheck className="w-[18px] h-[18px] text-emerald-400" />
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-3 tracking-tight">Always Land</h3>
              <p className="text-gray-500 leading-[1.6] text-[15px] font-light">Built-in deliverability checks strip out algorithmic spam triggers instantly.</p>
            </div>
          </div>

          {/* Card 3: Dynamic Tone Calibrator (Span 1) */}
          <div className="bento-card relative md:col-span-1 group rounded-[28px] bg-white/[0.03] border border-white/[0.06] overflow-hidden transform-gpu opacity-0 backdrop-blur-xl">
            <div className="spotlight-effect absolute w-[350px] h-[350px] bg-blue-500/[0.08] rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.06]" />
            
            <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center tone-container z-10">
              <div className="flex flex-col gap-3 w-full px-10">
                <div style={{"--glow-color": "rgba(59,130,246,0.3)"} as any} className="tone-pill px-4 py-3 rounded-[14px] border border-blue-500/30 bg-blue-500/10 text-blue-600 text-xs sm:text-sm font-semibold flex justify-between items-center opacity-30 box-shadow-[0_0_0_0_transparent] transition-all duration-300">
                  FORMAL <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"/>
                </div>
                <div style={{"--glow-color": "rgba(236,72,153,0.3)"} as any} className="tone-pill px-4 py-3 rounded-[14px] border border-pink-500/30 bg-pink-500/10 text-pink-600 text-xs sm:text-sm font-semibold flex justify-between items-center opacity-30 box-shadow-[0_0_0_0_transparent] transition-all duration-300">
                  BOLD <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"/>
                </div>
                <div style={{"--glow-color": "rgba(245,158,11,0.3)"} as any} className="tone-pill px-4 py-3 rounded-[14px] border border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs sm:text-sm font-semibold flex justify-between items-center opacity-30 box-shadow-[0_0_0_0_transparent] transition-all duration-300">
                  CASUAL <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"/>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 pointer-events-none z-10">
              <div className="w-12 h-12 rounded-[14px] bg-blue-500/[0.12] border border-blue-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:bg-blue-500/[0.18] transition-colors">
                <SlidersHorizontal className="w-[18px] h-[18px] text-blue-400" />
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-3 tracking-tight">Adaptive Tones</h3>
              <p className="text-gray-500 leading-[1.6] text-[15px] font-light">Calibrate the phrasing to match your recipient's expectation precisely.</p>
            </div>
          </div>

          {/* Card 4: Hyper-Personalized Tags (Span 2) */}
          <div className="bento-card relative md:col-span-2 group rounded-[28px] bg-white/[0.03] border border-white/[0.06] overflow-hidden transform-gpu opacity-0 backdrop-blur-xl">
            <div className="spotlight-effect absolute w-[500px] h-[500px] bg-cyan-500/[0.06] rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 z-0" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.06]" />
            
            <div className="absolute inset-x-0 top-0 h-[55%] flex items-center justify-center z-10 border-b border-white/[0.04]">
              <div className="w-[85%] max-w-[500px] p-5 sm:p-6 rounded-[18px] border border-white/[0.08] bg-gray-900 flex flex-col gap-4 font-medium text-[13px] sm:text-sm text-white/60 leading-relaxed shadow-2xl group-hover:scale-[1.03] transition-transform duration-500">
                <p>Hi <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">{'{{'}FirstName{'}}'}</span>,</p>
                <p>I noticed your recent launch of <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-purple-300 bg-purple-500/10 border border-purple-500/20 drop-shadow-[0_0_10px_rgba(192,132,252,0.2)]">{'{{'}Recent_Product{'}}'}</span>. <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-amber-300 bg-amber-500/10 border border-amber-500/20 drop-shadow-[0_0_10px_rgba(252,211,77,0.2)]">{'{{'}Icebreaker_Compliment{'}}'}</span></p>
                <p>Are you open to a quick chat about scaling your outreach infrastructure?</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 pointer-events-none z-10">
              <div className="w-12 h-12 rounded-[14px] bg-cyan-500/[0.12] border border-cyan-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:bg-cyan-500/[0.18] transition-colors">
                <Terminal className="w-[18px] h-[18px] text-cyan-400" />
              </div>
              <h3 className="text-[22px] font-semibold text-white mb-3 tracking-tight">Hyper-Personalized Tags</h3>
              <p className="text-gray-500 leading-[1.6] text-[15px] font-light max-w-sm">Inject custom attributes and AI-generated icebreakers effortlessly.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
