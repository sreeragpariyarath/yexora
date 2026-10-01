"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { markReady, startLoading, useRevealed } from "@/lib/loading";

// Matches the fade-out duration below
const FADE_MS = 700;

/**
 * Full-screen loading screen: the Yexora mark spins one full turn, rests a second, and
 * spins again (CSS only, so it keeps turning even while the main thread compiles
 * shaders). It is in the static HTML, so it shows from the very first paint. Behind it
 * the 3D scene warms up (FlowCanvas `Warmup`), fonts load and the section images
 * download, so the first scroll is smooth. See lib/loading.ts for when it lifts.
 */
export default function Loader() {
  const revealed = useRevealed();
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    startLoading();
    document.fonts.ready.then(() => markReady("fonts"), () => markReady("fonts"));
    // Fetch the section photos now (they're lazy-loaded), so they're cached before you scroll to them
    document.querySelectorAll<HTMLImageElement>("img[loading='lazy']").forEach((img) => {
      img.loading = "eager";
    });
  }, []);

  // No scrolling under the loader
  useEffect(() => {
    if (!lenis) return;
    if (revealed) lenis.start();
    else lenis.stop();
  }, [lenis, revealed]);

  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [revealed]);

  if (gone) return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-live="polite"
      aria-busy={!revealed}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] transition-opacity duration-700 ease-out ${
        revealed ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a plain img is in the static HTML with no wrapper or lazy loading */}
      <img src="/logo-mark-loader.png" alt="" width={256} height={255} fetchPriority="high" className="loader-mark w-20 sm:w-24 h-auto" />
      <span className="sr-only">{revealed ? "Loaded" : "Loading"}</span>
    </div>
  );
}
