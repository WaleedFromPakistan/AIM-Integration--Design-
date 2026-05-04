"use client";

import { useEffect } from "react";

/**
 * Page-scoped smooth scroll. Initializes Lenis on mount, animates the
 * single global scroll container, and tears down cleanly. Respects
 * prefers-reduced-motion.
 */
export default function LenisProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lenis;
    let frameId;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });

      const raf = (time) => {
        lenis.raf(time);
        frameId = window.requestAnimationFrame(raf);
      };
      frameId = window.requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return children;
}
