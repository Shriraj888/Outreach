"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Mail, Send, Inbox, Star, CheckCircle2 } from "lucide-react"
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(".hero-badge",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
    )
      .fromTo(".hero-title-line",
        { y: 60, opacity: 0, rotationX: -15 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "expo.out", stagger: 0.15 },
        "-=0.7"
      )
      .fromTo(".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
        "-=0.8"
      )
      .fromTo(".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
        "-=0.6"
      )
      .fromTo(".float-card",
        { y: 60, opacity: 0, scale: 0.8, rotation: -5 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=1"
      )
      .fromTo(".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );

    // Parallax background items
    gsap.to(".parallax-bg", {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Scroll parallax for floating cards
    gsap.utils.toArray<HTMLElement>(".float-card-scroll").forEach((el, i) => {
      const isTopCard = i === 0 || i === 2;
      gsap.to(el, {
        y: isTopCard ? -80 : -160,
        rotation: i % 2 === 0 ? 12 : -12,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // Mouse parallax setup using quickTo for performance
    const xTo = gsap.utils.toArray<HTMLElement>(".float-card-mouse").map(el =>
      gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" })
    );
    const yTo = gsap.utils.toArray<HTMLElement>(".float-card-mouse").map(el =>
      gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" })
    );

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.utils.toArray<HTMLElement>(".float-card-mouse").forEach((_, i) => {
        const depth = (i + 1) * 20;
        xTo[i](x * depth);
        yTo[i](y * depth);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden perspective-1000">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-20 parallax-bg" />
      </div>

      {/* Floating Cards — OUTSIDE the text container, positioned to edges */}

      {/* Left side card 1 — top */}
      <div className="absolute left-[2%] xl:left-[5%] top-[30%] hidden lg:block z-20">
        <div className="float-card-scroll">
          <div className="float-card-mouse">
            <div className="float-card glass-card p-4 rounded-2xl opacity-0 hover:scale-105 transition-transform duration-500 cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                <div className="w-20 h-2 rounded-full bg-white/10 mb-1.5" />
                <div className="w-14 h-1.5 rounded-full bg-white/[0.06]" />
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">Email Delivered ✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left side card 2 — bottom */}
      <div className="absolute left-[3%] xl:left-[8%] bottom-[20%] hidden lg:block z-20">
        <div className="float-card-scroll">
          <div className="float-card-mouse">
            <div className="float-card glass-card p-4 rounded-2xl opacity-0 hover:scale-105 transition-transform duration-500 cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Inbox className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Response Rate</p>
                  <p className="text-lg font-bold text-white">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side card 1 — top */}
      <div className="absolute right-[2%] xl:right-[5%] top-[35%] hidden lg:block z-20">
        <div className="float-card-scroll">
          <div className="float-card-mouse">
            <div className="float-card glass-card p-5 rounded-2xl opacity-0 hover:scale-105 transition-transform duration-500 cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">New Email</p>
                  <p className="text-xs text-gray-300 font-semibold">Re: Internship Inquiry</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="w-full h-1.5 rounded-full bg-white/[0.08]" />
                <div className="w-3/4 h-1.5 rounded-full bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side card 2 — bottom */}
      <div className="absolute right-[4%] xl:right-[10%] bottom-[20%] hidden lg:block z-20">
        <div className="float-card-scroll">
          <div className="float-card-mouse">
            <div className="float-card glass-card p-4 rounded-2xl opacity-0 hover:scale-105 transition-transform duration-500 cursor-default">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-[11px] text-gray-400 max-w-[120px]">&quot;Got replies from 4 out of 5 emails!&quot;</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 opacity-0">
          <Sparkles className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">AI-Powered Email Crafting</span>
        </div>

        <div className="overflow-hidden">
          <h1 className="hero-title-line text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tighter text-white leading-[1.05] opacity-0">
            Cold Emails That
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-title-line text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tighter text-white leading-[1.05] opacity-0">
            <span className="text-glow">Actually</span> Land.
          </h1>
        </div>

        <p className="hero-subtitle mt-8 text-lg sm:text-xl text-gray-400 max-w-xl mx-auto font-light tracking-wide opacity-0 leading-relaxed">
          3 inputs. 3 unique styles. Infinite possibilities.
          <br className="hidden sm:block" />
          Craft the perfect sequence in seconds, not hours.
        </p>

        <div className="hero-cta mt-12 flex flex-col sm:flex-row items-center gap-4 opacity-0">
          <Link
            href="/craft"
            className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-full bg-white text-gray-900 overflow-hidden hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.2)] transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 flex items-center gap-2">
              Start Crafting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
          <p className="text-sm text-gray-500 mt-4 sm:mt-0 sm:ml-4">No credit card required. Free forever.</p>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex items-center gap-8 sm:gap-12">
          <div className="hero-stat opacity-0 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">3</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium uppercase tracking-wider">Email Styles</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="hero-stat opacity-0 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">10s</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium uppercase tracking-wider">Generation</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="hero-stat opacity-0 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">Free</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium uppercase tracking-wider">Forever</p>
          </div>
        </div>
      </div>
    </section>
  )
}
