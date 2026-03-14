"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Sparkles, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function Navbar() {
  const router = useRouter();
  const navContainer = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCraftNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsNavigating(true);
    
    // Play a quick satisfying outgoing animation on the entire navbar, then navigate
    gsap.to(pillRef.current, {
      scale: 0.95,
      y: -5,
      opacity: 0.6,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => {
        router.push('/craft');
        // Reset state slightly after routing so it looks normal if user comes back
        setTimeout(() => setIsNavigating(false), 500);
      }
    });
  };

  useGSAP(() => {
    // Initial drop-in animation
    gsap.fromTo(navContainer.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.1 }
    );

    // Dynamic shrinking and blurring on scroll
    gsap.to(pillRef.current, {
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      paddingLeft: "1.25rem",
      paddingRight: "1.25rem",
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(24px)",
      scrollTrigger: {
        trigger: "body",
        start: "top -50",
        end: "top -100",
        scrub: 0.5,
      }
    });

  }, { scope: navContainer });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    if (window.location.pathname !== '/') return; // Let default navigation happen if not on home page
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav ref={navContainer} className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none perspective-1000">
      <div
        ref={pillRef}
        className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center justify-between w-full max-w-4xl pointer-events-auto shadow-lg bg-white/[0.04] border border-white/[0.06] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.06)]"
      >

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:rotate-12 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Mail className="w-4 h-4 text-gray-900 relative z-10" />
            <div className="absolute inset-0 rounded-full bg-white blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-white group-hover:text-gray-300 transition-colors uppercase">
            Outreach
          </span>
        </Link>

        {/* Navigation Links & CTA */}
        <div className="flex items-center gap-6">
          <Link
            href="/#how-it-works"
            onClick={(e) => handleScroll(e, '#how-it-works')}
            className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
          >
            How it works
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/50 group-hover:w-full transition-all duration-300" />
          </Link>

          <Link
            href="/craft"
            onClick={handleCraftNavigation}
            className="relative group overflow-hidden text-sm font-semibold px-5 py-2.5 rounded-full bg-white text-gray-900 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            {/* Pulsing glow behind the button */}
            <div className="absolute inset-0 bg-white/30 blur-xl group-hover:bg-white/50 transition-colors duration-500" />

            {/* Animated sweeping gradient highlight */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent ${isNavigating ? '' : '-translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none'}`} />

            <span className="relative z-10 flex items-center gap-1.5">
              {isNavigating ? (
                <>
                  <Loader2 className="w-4 h-4 text-gray-900 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  Craft Now
                </>
              )}
            </span>
          </Link>
        </div>

      </div>
    </nav>
  )
}
