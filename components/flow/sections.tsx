"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import Contact from "./Contact";
import CopyBlock from "./CopyBlock";
import { SERVICES } from "./services";
import Works from "./Works";

// Real page sections scrolled over the fixed 3D canvas. Every [data-chapter]
// section is one chapter of the timeline (timeline.ts) — keep them in order and
// update the tracks when adding, removing or resizing one.
// Content rules: no founder names, no game development or training, location is "India".

// Mobile: copy centred near the bottom. Desktop: per-section placement from the reference.
const PIN = "sticky top-0 h-screen w-full flex items-end justify-center text-center px-6 sm:px-10 pb-[14vh] lg:pb-0";

function Hero() {
  return (
    <section data-chapter id="home" className="relative h-screen w-full">
      <div className="h-full flex items-end justify-center text-center px-6 sm:px-10 pb-[14vh] lg:items-center lg:justify-end lg:text-left lg:pb-0 lg:pr-[6vw]">
        <CopyBlock
          hero
          eyebrow="Yexora IT Solutions"
          title="Immersive Tech & Software, Engineered to Scale"
          body="We build software, AR/VR experiences and AI solutions that move businesses forward."
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

export default function FlowSections() {
  return (
    <>
      <Hero />

      <section data-chapter id="about" className="relative h-[220vh] w-full">
        <div className={`${PIN} lg:items-center lg:justify-start lg:text-left lg:pl-[30vw]`}>
          <CopyBlock
            eyebrow="About us"
            title="One Team. Every Layer of Technology."
            body="Yexora IT Solutions is an Indian technology company bringing software, immersive tech and AI under one roof — from idea to launch and beyond."
            className="max-w-xl lg:max-w-[30vw]"
          />
        </div>
      </section>

      <section data-chapter id="problem" aria-label="The challenge" className="relative h-[220vh] w-full">
        <div className={`${PIN} lg:items-end lg:justify-start lg:text-left lg:pl-[22vw] lg:pb-[16vh]`}>
          <CopyBlock
            eyebrow="The challenge"
            title="Technology Is Complex. We Make It Simple."
            body="Too many vendors, disconnected tools and slow delivery hold ambitious businesses back."
            className="max-w-xl lg:max-w-[30vw]"
          />
        </div>
      </section>

      <section data-chapter id="services" className="relative h-[180vh] w-full">
        <div className={`${PIN} lg:items-center lg:justify-center lg:text-left lg:pl-[12vw]`}>
          <CopyBlock eyebrow="What we do" title="Built End-to-End." className="max-w-xl lg:max-w-[36vw]">
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-left font-poppins text-sm lg:text-[0.95vw] text-white/80">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(47,107,255,0.9)] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CopyBlock>
        </div>
      </section>

      <section data-chapter id="future" aria-label="What's next" className="relative h-[200vh] w-full">
        <div className={`${PIN} lg:items-end lg:pb-[18vh]`}>
          <CopyBlock
            eyebrow="What's next"
            title="The Future Is Immersive. Let's Build It Together."
            className="max-w-xl lg:max-w-[34vw]"
          />
        </div>
      </section>

      <Works />

      <Contact />
    </>
  );
}
