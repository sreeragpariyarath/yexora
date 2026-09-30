"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
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

// A card can become the active one once this much of it is on screen
const MIN_VISIBLE = 0.55;
// Volume fade when the sound hands over from one card to the next
const FADE_MS = 400;

interface WorkCardProps {
  work: Work;
  active: boolean;
  /** Play with sound (false: muted, because the visitor muted it or the browser blocked it) */
  sound: boolean;
  /** The browser refused to play with sound (no click/tap/key press on the page yet) */
  blocked: boolean;
  onBlocked: () => void;
  onToggleSound: (video: HTMLVideoElement) => void;
}

function WorkCard({ work, active, sound, blocked, onBlocked, onToggleSound }: WorkCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // The server-rendered <video> starts loading before hydration, so a fast failure
  // (e.g. a missing file) can fire before React's onError is attached
  useEffect(() => {
    const video = videoRef.current;
    if (!video?.error) return;
    const frame = requestAnimationFrame(() => setFailed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Only the active card plays; the sound fades in on it and out on the one it replaces
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frame = 0;
    let cancelled = false;
    const fadeTo = (to: number, done?: () => void) => {
      const from = video.volume;
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - start) / FADE_MS, 1);
        video.volume = Math.min(Math.max(from + (to - from) * k, 0), 1);
        if (k < 1) frame = requestAnimationFrame(step);
        else done?.();
      };
      frame = requestAnimationFrame(step);
    };

    if (active) {
      video.muted = !sound;
      if (video.paused) video.volume = 0;
      video
        .play()
        .then(() => {
          if (!cancelled) fadeTo(1);
        })
        .catch((err: unknown) => {
          // Sound needs a prior click/tap/key press; the parent retries muted
          if (!cancelled && !video.muted && err instanceof DOMException && err.name === "NotAllowedError") onBlocked();
        });
    } else if (!video.paused) {
      fadeTo(0, () => video.pause());
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [active, sound, onBlocked]);

  const muted = !sound;

  return (
    <figure
      data-work
      data-active={active ? "1" : "0"}
      className={`w-full will-change-transform origin-bottom ${PLACE[work.from]}`}
      style={{ transform: ENTER[work.from], opacity: "var(--p, 0)" }}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0c0f1f]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(143,107,255,0.22)]">
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,92,246,0.35),transparent_60%),radial-gradient(ellipse_at_75%_70%,rgba(47,107,255,0.3),transparent_55%)]">
            <span className="font-poppins text-xs tracking-[0.18em] uppercase text-white/60">Video coming soon</span>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={work.src}
              poster={work.poster}
              loop
              playsInline
              preload="metadata"
              onError={() => setFailed(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-700 ${
                active ? "saturate-100" : "saturate-50"
              }`}
            />
            {/* Dims the cards that aren't playing */}
            <div
              aria-hidden
              className={`absolute inset-0 bg-[#050713] pointer-events-none transition-opacity duration-700 ease-out ${
                active ? "opacity-0" : "opacity-60"
              }`}
            />
            <button
              type="button"
              data-sound-toggle
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-pressed={!muted}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              onClick={() => videoRef.current && onToggleSound(videoRef.current)}
              className={`absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 backdrop-blur-md px-3.5 py-2 font-poppins text-[11px] uppercase tracking-[0.16em] text-white transition-opacity duration-500 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {muted ? <VolumeX aria-hidden className="w-4 h-4" /> : <Volume2 aria-hidden className="w-4 h-4" />}
              {blocked ? "Tap for sound" : muted ? "Sound off" : "Sound on"}
            </button>
          </>
        )}
      </div>
      <figcaption
        className={`mt-4 flex items-center justify-between gap-4 font-poppins transition-colors duration-700 ${
          active ? "text-white" : "text-white/50"
        }`}
      >
        <span className="text-lg lg:text-[1.35vw] font-medium tracking-tight">{work.title}</span>
        <span className="text-[11px] lg:text-xs uppercase tracking-[0.18em] opacity-60 inline-flex items-center gap-2.5">
          <span aria-hidden className="w-2 h-2 rotate-45 border border-current" />
          {work.category}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Three work videos that slide in from the left, right and bottom as you scroll. The card
 * nearest the middle of the screen is the active one: it plays with sound and is fully lit,
 * the others pause and dim. Browsers only allow sound after a click/tap/key press on the
 * page, so until then the active video plays muted with a "Tap for sound" pill.
 */
export default function Works() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(-1);
  const [blocked, setBlocked] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const sound = !blocked && !userMuted;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-work]"));
    const update = () => {
      const vh = window.innerHeight;
      let best = -1;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        // 0 when the card's top reaches the bottom of the screen, 1 once it's 30% up
        const x = Math.min(Math.max((vh - r.top) / (vh * 0.7), 0), 1);
        const p = reduced ? 1 : 1 - Math.pow(1 - x, 3);
        card.style.setProperty("--p", p.toFixed(4));

        // Active = the card nearest the middle of the screen, once enough of it shows.
        // So the hand-over happens when the next card is half in and this one half out.
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible < r.height * MIN_VISIBLE) return;
        const dist = Math.abs(r.top + r.height / 2 - vh / 2);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      // Only re-renders when the active card changes
      setActive(best);
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

  // Sound was blocked: the visitor's first click, tap or key press anywhere turns it on.
  // Unmute inside the gesture itself, as Safari requires.
  useEffect(() => {
    if (!blocked) return;
    const unlock = (e: Event) => {
      if (e.target instanceof Element && e.target.closest("[data-sound-toggle]")) return;
      const video = listRef.current?.querySelector<HTMLVideoElement>('[data-active="1"] video');
      if (video && !userMuted) {
        video.muted = false;
        video.play().catch(() => {});
      }
      setBlocked(false);
    };
    const events = ["pointerup", "touchend", "keydown"] as const;
    events.forEach((type) => window.addEventListener(type, unlock, { passive: true }));
    return () => events.forEach((type) => window.removeEventListener(type, unlock));
  }, [blocked, userMuted]);

  const onBlocked = useCallback(() => setBlocked(true), []);

  const onToggleSound = useCallback(
    (video: HTMLVideoElement) => {
      const turnOn = blocked || userMuted;
      if (turnOn) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.muted = true;
      }
      setBlocked(false);
      setUserMuted(!turnOn);
    },
    [blocked, userMuted]
  );

  return (
    <section data-chapter id="works" aria-label="Our work" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[30vh] pb-[20vh]">
      <CopyBlock
        eyebrow="Selected works"
        title="Our Work in Motion"
        body="A look at the software and immersive experiences we've built."
        className="text-center lg:text-left max-w-xl lg:max-w-[40vw]"
      />
      <div ref={listRef} className="mt-[12vh] flex flex-col gap-[14vh] [perspective:1400px] overflow-x-clip">
        {WORKS.map((work, i) => (
          <WorkCard
            key={work.title}
            work={work}
            active={active === i}
            sound={sound}
            blocked={blocked}
            onBlocked={onBlocked}
            onToggleSound={onToggleSound}
          />
        ))}
      </div>
    </section>
  );
}
