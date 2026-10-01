"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import useReducedMotion from "./useReducedMotion";

interface CopyBlockProps {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  hero?: boolean;
  /**
   * Sit the copy on a liquid-glass panel. Use it over the 3D fibres: thin diagonal
   * fibres crossing straight lines of text make it look tilted (the Zöllner illusion),
   * and the frosted glass blurs them out right behind the text.
   */
  glass?: boolean;
  /**
   * Stay hidden while the section scrolls in, then fade and grow in place once the
   * section's top reaches the top of the screen (i.e. once the sticky copy is pinned).
   */
  revealOnPin?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Eyebrow + title + body. Fades up once the first time it scrolls into view (or grows in place with `revealOnPin`). */
export default function CopyBlock({
  eyebrow,
  title,
  body,
  hero = false,
  glass = false,
  revealOnPin = false,
  children,
  className = "",
}: CopyBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // revealOnPin watches the section against a band at the top of the viewport
    const target = (revealOnPin && el.closest("section")) || el;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      revealOnPin ? { rootMargin: "0px 0px -88% 0px" } : { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [revealOnPin]);

  const shown = seen || reduced;

  return (
    <div
      ref={ref}
      data-glass={glass ? "" : undefined}
      data-glass-shown={glass ? (shown ? "1" : "0") : undefined}
      className={`relative isolate text-white ease-out ${
        revealOnPin ? "transition-[opacity,scale] duration-900" : "transition-[opacity,translate] duration-1000"
      } ${glass ? "liquid-glass p-7 sm:p-9 lg:p-[2.5vw]" : ""} ${
        shown
          ? "opacity-100 translate-y-0 scale-100"
          : revealOnPin
            ? "opacity-0 scale-95"
            : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {/* Dark layer inside every glass card, so bright fibres behind it never wash out the text */}
      {glass && <div aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-[#000000]/60 pointer-events-none" />}
      <p className={`font-poppins font-medium uppercase text-[11px] lg:text-xs tracking-[0.18em] ${glass ? "text-white/80" : "text-white/60"} inline-flex items-center gap-2.5`}>
        <span aria-hidden className="w-2 h-2 rotate-45 border border-white/70" />
        {eyebrow}
      </p>
      <h2
        className={`font-poppins font-medium tracking-tight leading-[1.08] mt-4 ${
          hero ? "text-[2rem] sm:text-[2.6rem] lg:text-[3vw]" : "text-3xl sm:text-4xl lg:text-[2.5vw]"
        }`}
      >
        {title}
      </h2>
      {body && (
        <p className={`font-poppins text-sm sm:text-base lg:text-[1.02vw] leading-relaxed ${glass ? "text-white/90" : "text-white/75"} mt-5 max-w-[34rem] lg:max-w-none mx-auto lg:mx-0`}>
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
