"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import useReducedMotion from "./useReducedMotion";

/**
 * A liquid-glass card (same look as CopyBlock glass) that fades up once when it first
 * scrolls into view. The GPU lens (glassLens.tsx) picks it up via data-glass and fades
 * in with data-glass-shown.
 */
export default function GlassPanel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shown = seen || reduced;

  return (
    <div
      ref={ref}
      data-glass=""
      data-glass-shown={shown ? "1" : "0"}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`liquid-glass overflow-hidden text-white transition-[opacity,translate] duration-1000 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {/* Dark layer (same as CopyBlock glass) so bright fibres behind the card never wash out its text */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-[#000000]/60 pointer-events-none" />
      {children}
    </div>
  );
}
