"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { markReady, startLoading, useLeaving, useRevealed } from "@/lib/loading";

// The logo fades out first (500ms), the black layer follows after 300ms (700ms);
// unmount once both are done
const EXIT_MS = 1100;

/**
 * Full-screen loading screen: the Yexora mark spins one full turn, rests a second, and
 * spins again (CSS only, so it keeps turning even while the main thread compiles
 * shaders). It is in the static HTML, so it shows from the very first paint. Behind it
 * the 3D scene warms up (FlowCanvas `Warmup`), fonts load and the section images
 * download, so the first scroll is smooth. See lib/loading.ts for when it lifts.
 */
export default function Loader() {
  const leaving = useLeaving();
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
    if (!leaving) return;
    const timer = setTimeout(() => setGone(true), EXIT_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  if (gone) return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] transition-opacity duration-700 ease-out will-change-[opacity] ${
        leaving ? "opacity-0 pointer-events-none delay-300" : "opacity-100"
      }`}
    >
      {/* The logo fades and shrinks away first (it keeps spinning: the spin is on the img,
          the fade on this wrapper), then the black layer fades and the page shows through */}
      <span
        className={`flex transition-[opacity,scale] duration-500 ease-out will-change-[opacity,scale] ${
          leaving ? "opacity-0 scale-[0.85]" : "opacity-100 scale-100"
        }`}
      >
      {/* eslint-disable-next-line @next/next/no-img-element -- a plain img is in the static HTML with no wrapper or lazy loading */}
      <img src="/logo-mark-loader.png" alt="" width={256} height={255} fetchPriority="high" className="loader-mark w-12 sm:w-14 h-auto will-change-transform" />
      </span>
      <span className="sr-only">{leaving ? "Loaded" : "Loading"}</span>
    </div>
  );
}
