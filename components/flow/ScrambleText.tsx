"use client";

import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?";
const DURATION = 900;

interface ScrambleTextProps {
  text: string;
  /** Replays the scramble each time this turns true */
  active: boolean;
  className?: string;
}

/** Letters cycle through random glyphs and resolve left to right when `active` turns on. */
export default function ScrambleText({ text, active, className = "" }: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active || reduced) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // Each letter settles a little after the one before it
        const settleAt = DURATION * (0.3 + 0.7 * (i / text.length));
        out += ch === " " || elapsed >= settleAt ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (elapsed < DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{reduced ? text : display}</span>
    </span>
  );
}
