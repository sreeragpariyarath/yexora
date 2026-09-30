"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ScrambleText from "./ScrambleText";

// Real page sections scrolled over the fixed 3D canvas. Every [data-chapter]
// section is one chapter of the timeline (timeline.ts) — keep them in order and
// update the tracks when adding, removing or resizing one.
// TODO: real copy — everything below is placeholder text.

interface CopyBlockProps {
  eyebrow: string;
  title: string;
  body?: string;
  hero?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Eyebrow + scrambling title + body. The title re-scrambles each time the block scrolls into view. */
function CopyBlock({ eyebrow, title, body, hero = false, children, className = "" }: CopyBlockProps) {
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

// Mobile: copy centred near the bottom. Desktop: per-section placement from the reference.
const PIN = "sticky top-0 h-screen w-full flex items-end justify-center text-center px-6 sm:px-10 pb-[14vh] lg:pb-0";

function Hero() {
  return (
    <section data-chapter id="home" className="relative h-screen w-full">
      <div className="h-full flex items-end justify-center text-center px-6 sm:px-10 pb-[14vh] lg:items-center lg:justify-end lg:text-left lg:pb-0 lg:pr-[6vw]">
        <CopyBlock
          hero
          eyebrow="Digital studio"
          title="Next-Generation Digital Experiences"
          body="Strategy, design and engineering for brands that want to lead — built to scale, launched without limits."
          className="max-w-xl lg:max-w-none lg:w-[44vw]"
        >
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white text-[#0b0d1a] pl-5 pr-1.5 py-1.5 font-poppins font-medium text-xs tracking-[0.12em] uppercase shadow-[0_0_30px_rgba(143,107,255,0.35)] transition-shadow hover:shadow-[0_0_40px_rgba(143,107,255,0.6)]"
            >
              Get started
              <span className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-accent text-white flex items-center justify-center transition-transform group-hover:rotate-90">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center rounded-full px-5 py-3.5 font-poppins font-medium text-xs tracking-[0.12em] uppercase text-white bg-white/[0.06] border border-white/10 backdrop-blur-md hover:bg-white/15 transition-colors"
            >
              Request demo
            </Link>
          </div>
        </CopyBlock>
      </div>
    </section>
  );
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Final stage: the dashboard rises from below and tilts flat as you scroll (no React renders). */
function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      const panel = panelRef.current;
      if (!el || !panel) return;
      const rect = el.getBoundingClientRect();
      const progress = clamp01(-rect.top / Math.max(rect.height - window.innerHeight, 1));
      panel.style.setProperty("--rise", smoothstep(0.2, 0.75, progress).toFixed(4));
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} data-chapter id="works" aria-label="Our work" className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-end justify-center px-4 [perspective:1400px]">
        <div
          ref={panelRef}
          className="w-full max-w-6xl origin-bottom will-change-transform"
          style={{
            transform:
              "translateY(calc((1 - var(--rise, 0)) * 80%)) rotateX(calc((1 - var(--rise, 0)) * 28deg))",
            opacity: "calc(var(--rise, 0) * 1.5)",
          }}
        >
          <DashboardPanel />
        </div>
      </div>
    </section>
  );
}

export default function FlowSections() {
  return (
    <>
      <Hero />

      <section data-chapter id="about" className="relative h-[220vh] w-full">
        <div className={`${PIN} lg:items-center lg:justify-start lg:text-left lg:pl-[30vw]`}>
          <CopyBlock
            eyebrow="About the studio"
            title="One Studio. Endless Possibilities."
            body="Strategy, design and engineering in a single team — so you can focus on growth, not on managing vendors."
            className="max-w-xl lg:max-w-[30vw]"
          />
        </div>
      </section>

      <section data-chapter id="problem" aria-label="The problem" className="relative h-[220vh] w-full">
        <div className={`${PIN} lg:items-end lg:justify-start lg:text-left lg:pl-[22vw] lg:pb-[16vh]`}>
          <CopyBlock
            eyebrow="The problem"
            title="Digital Is Complex. We Make It Simple."
            body="Fragmented tools, slow delivery and brittle integrations hold ambitious teams back."
            className="max-w-xl lg:max-w-[30vw]"
          />
        </div>
      </section>

      <section data-chapter id="services" className="relative h-[180vh] w-full">
        <div className={`${PIN} lg:items-center lg:justify-center lg:text-left lg:pl-[12vw]`}>
          <CopyBlock
            eyebrow="The solution"
            title="We build next-generation products that scale."
            body="Websites, platforms and apps engineered for performance — designed to grow with your business."
            className="max-w-xl lg:max-w-[30vw]"
          />
        </div>
      </section>

      <section data-chapter id="future" aria-label="What's next" className="relative h-[200vh] w-full">
        <div className={`${PIN} lg:items-end lg:pb-[18vh]`}>
          <CopyBlock eyebrow="What's next" title="The Future of Your Brand Starts Here" className="max-w-xl lg:max-w-[34vw]" />
        </div>
      </section>

      <Product />
    </>
  );
}

/** Placeholder product panel that rises at the end of the flow. TODO: real content. */
function DashboardPanel() {
  return (
    <div className="w-full h-[62vh] rounded-t-2xl border border-b-0 border-white/10 bg-[#0c0f1f]/85 backdrop-blur-xl shadow-[0_-20px_80px_rgba(47,107,255,0.25)] flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden sm:flex w-44 shrink-0 flex-col gap-3 border-r border-white/10 p-5">
        <span className="font-poppins font-medium text-lg text-white">Yexora</span>
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
  );
}
