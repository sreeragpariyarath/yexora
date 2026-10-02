import { Box, Copyright, Glasses, Globe } from "lucide-react";
import CopyBlock from "./CopyBlock";
import Eyebrow from "./Eyebrow";
import GlassPanel from "./GlassPanel";
import TintedImage from "./TintedImage";
import { projectImage } from "./services";

// Working principles as a bento grid of liquid-glass cards (layout from the owner's
// reference, styled like the rest of the site).

const TITLE = "font-poppins font-medium tracking-tight leading-[1.08] text-white";
const BODY = "font-poppins text-sm lg:text-[0.95vw] leading-relaxed text-white/85";

export default function Principles() {
  return (
    <section
      data-chapter
      id="principles"
      aria-label="Work principles"
      className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[24vh] pb-[18vh]"
    >
      <CopyBlock
        glass
        eyebrow="How we work"
        title="Every Project Is Shaped Around the Client and Their Business."
        body="Solutions are tailored for VR headsets, real-time 3D, the web and the cloud — and every one follows the same principles."
        className="text-center lg:text-left max-w-xl mx-auto lg:mx-0 lg:max-w-[46vw]"
      />

      <div className="mt-10 lg:mt-[8vh] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        <GlassPanel className="group lg:col-span-6 min-h-64 lg:h-[38vh]">
          <TintedImage src={projectImage("transparency")} sizes="(min-width: 1024px) 50vw, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#000000]/85 via-[#000000]/35 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-7 lg:p-[2.2vw]">
            <Eyebrow>Transparency</Eyebrow>
            <h3 className={`${TITLE} mt-3 text-2xl lg:text-[2vw]`}>Clear From Day One.</h3>
            <p className={`${BODY} mt-3 max-w-md`}>We align on goals, scope and outcomes before we start.</p>
          </div>
        </GlassPanel>

        <GlassPanel delay={100} className="group lg:col-span-6 min-h-64 lg:h-[38vh]">
          <TintedImage src={projectImage("smart-aesthetics")} sizes="(min-width: 1024px) 50vw, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#000000]/85 via-[#000000]/35 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-7 lg:p-[2.2vw]">
            <Eyebrow>Smart aesthetics</Eyebrow>
            <h3 className={`${TITLE} mt-3 text-2xl lg:text-[2vw]`}>Design That Earns Its Place.</h3>
            <p className={`${BODY} mt-3 max-w-md`}>Not beauty for its own sake — clarity, performance and impact.</p>
          </div>
        </GlassPanel>

        <GlassPanel className="lg:col-span-4 min-h-56 lg:min-h-[30vh]">
          <div className="h-full flex flex-col justify-center p-7 lg:p-[2.2vw]">
            <div className="flex items-center gap-4 text-white/90">
              <Glasses className="w-7 h-7" strokeWidth={1.5} />
              <Box className="w-7 h-7" strokeWidth={1.5} />
              <Globe className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className={`${TITLE} mt-5 text-xl lg:text-[1.45vw]`}>Honesty About Technology</h3>
            <p className={`${BODY} mt-2`}>We recommend what fits the problem, not what is fashionable.</p>
          </div>
        </GlassPanel>

        <GlassPanel delay={100} className="group lg:col-span-5 min-h-56 lg:min-h-[30vh]">
          <TintedImage src={projectImage("value-driven-engineering")} sizes="(min-width: 1024px) 40vw, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#000000]/85 via-[#000000]/35 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-7 lg:p-[2.2vw]">
            <Eyebrow>Value-driven engineering</Eyebrow>
            <p className={`${BODY} mt-3`}>Every pixel and polygon serves your goals.</p>
          </div>
        </GlassPanel>

        <div className="lg:col-span-3 grid gap-4 lg:gap-5 lg:grid-rows-2">
          <GlassPanel delay={200} className="min-h-36 lg:min-h-0">
            <div className="h-full flex flex-col justify-center p-6 lg:p-[1.6vw]">
              <Eyebrow>On schedule</Eyebrow>
              <p className={`${BODY} mt-3`}>We respect deadlines and take full ownership of quality.</p>
            </div>
          </GlassPanel>
          <GlassPanel delay={300} className="min-h-28 lg:min-h-0">
            <div className="h-full flex items-center gap-4 p-6 lg:p-[1.6vw]">
              <Copyright className="w-7 h-7 shrink-0 text-white/70" strokeWidth={1.5} />
              <p className={BODY}>We only use properly licensed assets and code.</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
