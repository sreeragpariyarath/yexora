"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ScrambleText from "./ScrambleText";
import { COPY_OUT, STAGES, stageAt, type CopyAlign } from "./stages";

// WebGL only runs in the browser; keep three.js out of the server render and the initial bundle.
const FlowCanvas = dynamic(() => import("./FlowCanvas"), { ssr: false });

const LAST = STAGES.length - 1;

// Mobile: copy sits centred near the bottom. Desktop: per-stage placement, as in the reference.
const ALIGN: Record<CopyAlign, string> = {
  right: "lg:items-center lg:justify-end lg:text-left lg:pb-0",
  center: "lg:items-center lg:justify-center lg:text-center lg:pb-0",
  left: "lg:items-end lg:justify-start lg:text-left lg:pb-[16vh]",
};

/**
 * Pinned 3D "fibre flow": a tall section whose sticky viewport holds one WebGL scene that
 * morphs through the STAGES as you scroll, with each stage's copy fading in over it.
 */
export default function ScrollFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  // Written on scroll, read by the canvas every frame — never causes a React render
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [copyStage, setCopyStage] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const p = distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;
      progress.current = p;

      const { index, local } = stageAt(p);
      setStage(index);
      setCopyStage(index === LAST || local < COPY_OUT ? index : -1);
    };

    // Lenis drives the native scroll position, so plain scroll events stay in sync with it
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "100px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="flow" aria-label="What we do" className="relative w-full h-[700vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <FlowCanvas progressRef={progress} active={active} eventSourceRef={stickyRef} />
        </div>

        {/* Stage copy */}
        {STAGES.map((s, i) => {
          if (!s.copy) return null;
          const shown = copyStage === i;
          return (
            <div
              key={i}
              aria-hidden={!shown}
              className={`pointer-events-none absolute inset-0 flex items-end justify-center text-center px-6 sm:px-10 lg:px-[6vw] pb-[14vh] ${ALIGN[s.copy.align]}`}
            >
              <div
                className={`max-w-[34rem] lg:max-w-[40vw] text-white transition-[opacity,translate,filter] duration-700 ease-out drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] ${
                  shown ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"
                }`}
              >
                <p className="font-poppins uppercase text-xs lg:text-[0.8vw] tracking-[0.2em] text-white/70 inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full border border-white/70" />
                  {s.copy.eyebrow}
                </p>
                <h2
                  style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
                  className="font-bebas uppercase text-5xl sm:text-6xl lg:text-[4.4vw] leading-[0.95] mt-3"
                >
                  <ScrambleText text={s.copy.title} active={shown} />
                </h2>
                {s.copy.body && (
                  <p className="font-poppins text-sm sm:text-base lg:text-[1.05vw] leading-relaxed text-white/75 mt-4">
                    {s.copy.body}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <DashboardPanel shown={stage === LAST} />
      </div>
    </section>
  );
}

/** Placeholder product panel that rises in front of the final burst. TODO: real content. */
function DashboardPanel({ shown }: { shown: boolean }) {
  return (
    <div
      aria-hidden={!shown}
      className={`absolute inset-x-0 bottom-0 flex justify-center px-4 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[40%] pointer-events-none"
      }`}
    >
      <div className="w-full max-w-6xl h-[62vh] rounded-t-2xl border border-b-0 border-white/10 bg-[#0c0f1f]/85 backdrop-blur-xl shadow-[0_-20px_80px_rgba(47,107,255,0.25)] flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden sm:flex w-44 shrink-0 flex-col gap-3 border-r border-white/10 p-5">
          <span
            style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
            className="font-bebas text-xl tracking-widest text-white"
          >
            YEXORA
          </span>
          {[70, 55, 62, 48, 58].map((w, i) => (
            <span key={i} className={`h-2.5 rounded-full ${i === 0 ? "bg-accent/70" : "bg-white/10"}`} style={{ width: `${w}%` }} />
          ))}
        </div>

        <div className="flex-1 min-w-0 p-5 sm:p-7 flex flex-col gap-5">
          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <span className="block h-2 w-16 rounded-full bg-white/15" />
                <span className="block h-5 w-24 rounded-full bg-white/25 mt-3" />
              </div>
            ))}
          </div>

          <div className="h-12 rounded-xl bg-linear-to-r from-white/[0.04] via-accent/25 to-white/[0.04] border border-white/10" />

          <div className="flex-1 min-h-0 grid lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-end gap-2">
              {[88, 70, 70, 52, 52, 38, 38, 30, 22].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-md bg-linear-to-t from-violet-500/40 to-violet-300/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            {/* List */}
            <div className="hidden lg:flex rounded-xl border border-white/10 bg-white/[0.03] p-4 flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="h-2 w-3/4 rounded-full bg-white/20" />
                  <span className="h-2 w-1/2 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
