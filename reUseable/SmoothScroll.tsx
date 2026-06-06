"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    gsap.ticker.lagSmoothing(0);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    // Initial refresh — sets up pin positions with current DOM state
    ScrollTrigger.refresh();

    // Refresh after images, fonts, and all assets finish loading
    const handleLoad = () => {
      lenis.resize();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    // Refresh after web fonts load (fonts affect text height → section size → pin position)
    document.fonts?.ready.then(() => {
      lenis.resize();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  // Refresh ScrollTrigger + Lenis on route change
  useEffect(() => {
    requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return <>{children}</>;
}
