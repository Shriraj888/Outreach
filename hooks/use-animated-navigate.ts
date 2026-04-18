"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback, type RefObject } from "react"
import gsap from "gsap"

/**
 * Custom hook to handle animated navigation transitions.
 * Consolidates navigation logic that was previously duplicated across
 * Navbar, Footer, and HeroSection components.
 */
export function useAnimatedNavigate() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigate = useCallback(
    (path: string, animateRef?: RefObject<HTMLElement | null>) => {
      setIsNavigating(true)

      if (animateRef?.current) {
        gsap.to(animateRef.current, {
          scale: 0.95,
          y: -5,
          opacity: 0.6,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => {
            router.push(path)
            setTimeout(() => setIsNavigating(false), 500)
          },
        })
      } else {
        router.push(path)
        setTimeout(() => setIsNavigating(false), 500)
      }
    },
    [router]
  )

  return { navigate, isNavigating }
}

/**
 * Handles smooth scrolling to a section on the homepage.
 * If the user is not on the homepage, lets the default Link navigation happen.
 */
export function useSmoothScroll() {
  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
      if (window.location.pathname !== "/") return
      e.preventDefault()
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    []
  )

  const handleScrollToHome = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (window.location.pathname === "/") {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    []
  )

  return { handleScroll, handleScrollToHome }
}
