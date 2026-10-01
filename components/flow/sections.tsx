"use client";

import Contact from "./Contact";
import CopyBlock from "./CopyBlock";
import Principles from "./Principles";
import Services from "./ServicesSection";
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
          glass
          eyebrow="Yexora IT Solutions"
          title="Immersive Tech & Software, Engineered to Scale"
          body="We build software, AR/VR experiences and AI solutions that move businesses forward."
          className="max-w-xl lg:max-w-none lg:w-[44vw]"
        />
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
            glass
            revealOnPin
            eyebrow="About us"
            title="One Team. Every Layer of Technology."
            body="Yexora IT Solutions is an Indian technology company that designs, builds and supports software, immersive experiences and AI solutions for businesses, institutions and government organisations."
            className="max-w-xl lg:max-w-none lg:w-[54vw] lg:py-[3.2vw] lg:px-[3.4vw]"
          >
            <p className="font-poppins text-sm sm:text-base lg:text-[1.02vw] leading-relaxed text-white/90 mt-4 max-w-none mx-auto lg:mx-0">
              We handle the whole journey — design, development, testing, deployment and ongoing support — so you
              work with one accountable team instead of juggling vendors.
            </p>
            <p className="hidden sm:block font-poppins text-sm sm:text-base lg:text-[1.02vw] leading-relaxed text-white/90 mt-4 max-w-none mx-auto lg:mx-0">
              From web, mobile and cloud platforms to AR/VR, 3D and AI, we work with teams in education,
              healthcare, manufacturing, engineering, architecture, real estate and retail.
            </p>
          </CopyBlock>
        </div>
      </section>

      <Principles />

      <Services />

      {/* Works intro on the glass card over the hourglass; the videos follow (Works.tsx) */}
      <section data-chapter id="works" aria-label="Our work" className="relative h-[200vh] w-full">
        <div className={`${PIN} lg:items-end lg:pb-[18vh]`}>
          <CopyBlock
            glass
            eyebrow="Selected works"
            title="Our Work in Motion"
            body="A look at the software and immersive experiences we've built."
            className="max-w-xl lg:max-w-[42vw]"
          />
        </div>
      </section>

      <Works />

      <Contact />
    </>
  );
}
