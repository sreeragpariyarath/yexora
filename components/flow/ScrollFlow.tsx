"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import FlowSections from "./sections";
import SceneFallback from "./SceneFallback";
import type { SectionLayout } from "./FlowCanvas";

// WebGL only runs in the browser; keep three.js out of the server render and the initial bundle.
// Start fetching the chunk as soon as this module runs in the browser, not at first render.
const loadCanvas = () => import("./FlowCanvas");
if (typeof window !== "undefined") loadCanvas();
const FlowCanvas = dynamic(loadCanvas, { ssr: false });

/**
 * If the WebGL context can't be created, R3F throws (its `fallback` prop only renders
 * inside the <canvas>), which would take the whole page down. Show the gradient instead.
 */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

/**
 * The page: real sections scrolling over one fixed WebGL scene. The canvas maps
 * the scroll position onto the sections' measured tops to get the timeline's
 * chapter value, so the 3D chain stays locked to whichever section is on screen.
 */
export default function ScrollFlow() {
  const contentRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<SectionLayout>({ tops: [], maxScroll: 0 });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const sections = el.querySelectorAll<HTMLElement>("[data-chapter]");
      layoutRef.current = {
        tops: Array.from(sections, (s) => s.getBoundingClientRect().top + window.scrollY),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="fixed inset-0">
        <SceneBoundary>
          <FlowCanvas layoutRef={layoutRef} />
        </SceneBoundary>
      </div>
      <div ref={contentRef} className="relative z-10">
        <FlowSections />
      </div>
    </>
  );
}
