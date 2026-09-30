"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ScrambleText from "./ScrambleText";

interface CopyBlockProps {
  eyebrow: string;
  title: string;
  body?: string;
  hero?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Eyebrow + scrambling title + body. The title re-scrambles each time the block scrolls into view. */
export default function CopyBlock({ eyebrow, title, body, hero = false, children, className = "" }: CopyBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`text-white drop-shadow-[0_2px_18px_rgba(5,7,19,0.6)] ${className}`}>
      <p className="font-poppins font-medium uppercase text-[11px] lg:text-xs tracking-[0.18em] text-white/60 inline-flex items-center gap-2.5">
        <span aria-hidden className="w-2 h-2 rotate-45 border border-white/70" />
        {eyebrow}
      </p>
      <h2
        className={`font-poppins font-medium tracking-tight leading-[1.08] mt-4 ${
          hero ? "text-4xl sm:text-5xl lg:text-[3.6vw]" : "text-3xl sm:text-4xl lg:text-[2.5vw]"
        }`}
      >
        <ScrambleText text={title} active={inView} />
      </h2>
      {body && (
        <p className="font-poppins text-sm sm:text-base lg:text-[1.02vw] leading-relaxed text-white/70 mt-5 max-w-[34rem] mx-auto lg:mx-0">
          {body}
        </p>
      )}
      {children}
    </div>
  );
}
