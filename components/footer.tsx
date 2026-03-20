"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, Linkedin, Loader2, ArrowUpRight, Mail } from "lucide-react"
import { useState } from "react"

const socialLinks = [
  { icon: Github, href: "https://github.com/shriraj888", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/shriraj-patil888/", label: "LinkedIn" },
  { 
    icon: (props: any) => (
      <svg className={props.className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    ), 
    href: "https://x.com/shriraj399", 
    label: "Twitter" 
  }
]

export function Footer() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    if (window.location.pathname !== '/') return; 
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToHome = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCraftNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push('/craft');
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };

  return (
    <footer className="relative bg-[#050505] text-white pt-24 pb-8 px-6 sm:px-10 lg:px-16 w-full overflow-hidden border-t border-white/[0.05]">
      {/* Background flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-gradient-to-b from-white/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 w-full">
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-semibold tracking-tight text-white mb-4 flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <Mail className="w-4 h-4 text-gray-900 relative z-10" />
              </div>
              Outreach
            </h3>
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-sm">
              Stop guessing what gets replies. Use AI-driven insights and beautifully crafted variants to scale your outreach effortlessly.
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-white/30 mb-6 uppercase">Navigate</h4>
            <ul className="space-y-4 text-[15px] font-medium text-gray-400">
              <li>
                <Link href="/" onClick={handleScrollToHome} className="hover:text-white transition-colors duration-300 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/craft" onClick={handleCraftNavigation} className="hover:text-white transition-colors duration-300 flex items-center gap-2 w-fit group">
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span className="text-white">Connecting...</span>
                    </>
                  ) : (
                    <>
                      Generator
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                    </>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/#features" onClick={(e) => handleScroll(e, '#features')} className="hover:text-white transition-colors duration-300 inline-block">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" onClick={(e) => handleScroll(e, '#how-it-works')} className="hover:text-white transition-colors duration-300 inline-block">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-white/30 mb-6 uppercase">Connect</h4>
            <div className="flex flex-row gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a key={social.label} href={social.href} className="group flex items-center gap-3 text-[15px] font-medium text-gray-400 hover:text-white transition-colors w-fit">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.08] group-hover:border-white/[0.1] transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    {social.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Massive Text Section */}
        <div className="w-full flex justify-center mb-12 relative select-none">
          <h2 
            className="font-black leading-[0.8] tracking-tighter uppercase text-center w-full"
            style={{ 
              fontSize: "clamp(3rem, 15vw, 15rem)",
              backgroundImage: "linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.4) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0px 10px 40px rgba(255,255,255,0.05))"
            }}
          >
            OUTREACH
          </h2>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10 pointer-events-none" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-white/[0.06] text-[13px] font-medium text-gray-500 relative z-20 w-full">
          <div className="flex items-center gap-4">
            <p>© 2026 Outreach.</p>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <p className="hover:text-white transition-colors cursor-pointer">Privacy Policy</p>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <p className="hover:text-white transition-colors cursor-pointer hidden sm:block">Terms of Service</p>
          </div>
          
          <button onClick={scrollToTop} className="flex items-center gap-2 hover:text-white transition-all group px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05]">
            Back to top 
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}


