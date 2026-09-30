"use client";

import { useEffect, useRef, useState } from "react";
import CopyBlock from "./CopyBlock";
import useReducedMotion from "./useReducedMotion";

type From = "left" | "right" | "bottom";

interface Work {
  title: string;
  category: string;
  /** Drop the files into public/works/ */
  src: string;
  poster?: string;
  from: From;
}

// TODO: real titles and categories for each video.
const WORKS: Work[] = [
  { title: "Project One", category: "Immersive experience", src: "/works/work1.mp4", from: "left" },
  { title: "Project Two", category: "Web platform", src: "/works/work1.mp4", from: "right" },
  { title: "Project Three", category: "AR / VR solution", src: "/works/work1.mp4", from: "bottom" },
  { title: "Project Four", category: "App development", src: "/works/work1.mp4", from: "right" },
];

// Entrance per direction, driven by the --p CSS var (0 → 1) so scrolling never re-renders React
const ENTER: Record<From, string> = {
  left: "translateX(calc((1 - var(--p, 0)) * -35vw))",
  right: "translateX(calc((1 - var(--p, 0)) * 35vw))",
  bottom: "translateY(calc((1 - var(--p, 0)) * 30vh)) rotateX(calc((1 - var(--p, 0)) * 20deg))",
};

const PLACE: Record<From, string> = {
  left: "lg:self-start lg:w-[58vw]",
  right: "lg:self-end lg:w-[58vw]",
  bottom: "lg:self-center lg:w-[70vw]",
};

function WorkCard({ work }: { work: Work }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Autoplay while on screen, pause when it leaves (saves CPU and battery)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // The server-rendered <video> starts loading before hydration, so a fast failure
    // (e.g. a missing file) can fire before React's onError is attached
    let frame = 0;
    if (video.error) frame = requestAnimationFrame(() => setFailed(true));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <figure
      data-work
      className={`w-full will-change-transform origin-bottom ${PLACE[work.from]}`}
      style={{ transform: ENTER[work.from], opacity: "var(--p, 0)" }}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0c0f1f]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(143,107,255,0.22)]">
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,92,246,0.35),transparent_60%),radial-gradient(ellipse_at_75%_70%,rgba(47,107,255,0.3),transparent_55%)]">
            <span className="font-poppins text-xs tracking-[0.18em] uppercase text-white/60">Video coming soon</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={work.src}
            poster={work.poster}
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4 font-poppins text-white">
        <span className="text-lg lg:text-[1.35vw] font-medium tracking-tight">{work.title}</span>
        <span className="text-[11px] lg:text-xs uppercase tracking-[0.18em] text-white/60 inline-flex items-center gap-2.5">
          <span aria-hidden className="w-2 h-2 rotate-45 border border-white/70" />
          {work.category}
        </span>
      </figcaption>
    </figure>
  );
}

/** Four work videos that slide in from the left, right or bottom as you scroll, then autoplay. */
export default function Works() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-work]"));
    const update = () => {
      const vh = window.innerHeight;
      for (const card of cards) {
        // 0 when the card's top reaches the bottom of the screen, 1 once it's 30% up
        const x = Math.min(Math.max((vh - card.getBoundingClientRect().top) / (vh * 0.7), 0), 1);
        const p = reduced ? 1 : 1 - Math.pow(1 - x, 3);
        card.style.setProperty("--p", p.toFixed(4));
      }
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  return (
    <section data-chapter id="works" aria-label="Our work" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[30vh] pb-[20vh]">
      <CopyBlock
        eyebrow="Selected works"
        title="Our Work in Motion"
        body="A look at the software and immersive experiences we've built."
        className="text-center lg:text-left max-w-xl lg:max-w-[40vw]"
      />
      <div ref={listRef} className="mt-[12vh] flex flex-col gap-[14vh] [perspective:1400px] overflow-x-clip">
        {WORKS.map((work) => (
          <WorkCard key={work.src} work={work} />
        ))}
      </div>
    </section>
  );
}
