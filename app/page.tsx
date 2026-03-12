import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <footer className="border-t border-white/[0.06] py-16 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center mb-6">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600 tracking-widest font-light text-xs uppercase">
          ColdMailCrafter &copy; 2026. Engineered for Replies.
        </p>
      </footer>
    </main>
  )
}
