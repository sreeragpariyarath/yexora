"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import FlowSections from "./sections";
import type { SectionLayout } from "./FlowCanvas";

// WebGL only runs in the browser; keep three.js out of the server render and the initial bundle.
const FlowCanvas = dynamic(() => import("./FlowCanvas"), { ssr: false });

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
        <FlowCanvas layoutRef={layoutRef} />
      </div>
      <div ref={contentRef} className="relative z-10">
        <FlowSections />
      </div>
    </>
  );
}
