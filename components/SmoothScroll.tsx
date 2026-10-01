"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { runFrame } from "@/lib/frame";

// Nav/anchor clicks glide to their section instead of jumping there quickly
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const ANCHOR_SCROLL = { duration: 2, easing: easeInOutCubic };

/**
 * Drives Lenis and everything else from a single requestAnimationFrame: scroll first,
 * then the frame subscribers (the 3D canvas). Two independent rAF loops let the canvas
 * draw the glass lens a frame behind the page, which made the copy boxes shimmer.
 */
function FrameDriver() {
  const lenis = useLenis();

  useEffect(() => {
    let frame = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      runFrame(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Same-page "#section" links (nav, logo, Get started, menu) glide there slowly. Handled in
    // the capture phase so it runs before next/link, which would otherwise jump instantly.
    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.start();
      lenis.scrollTo(target as HTMLElement, ANCHOR_SCROLL);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick, true);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root autoRaf={false} options={{ lerp: 0.1 }}>
      <FrameDriver />
      {children}
    </ReactLenis>
  );
}
