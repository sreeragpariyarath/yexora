"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { runFrame } from "@/lib/frame";

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
    return () => cancelAnimationFrame(frame);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root autoRaf={false} options={{ lerp: 0.1, anchors: true }}>
      <FrameDriver />
      {children}
    </ReactLenis>
  );
}
