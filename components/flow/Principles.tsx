import Image from "next/image";
import { Box, Copyright, Glasses, Globe } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { thumb } from "./services";

// Bento grid of working principles (layout from the owner's reference, in the site's dark theme).
// Images are temporary placeholders (see `thumb` in services.ts).

// Near-opaque so the bright fibres behind the grid never wash out the text
const CARD = "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e1c]/90";

function Photo({ seed, className = "" }: { seed: string; className?: string }) {
  return (
    <Image
      src={thumb(seed, 1200, 800)}
      alt=""
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={`object-cover ${className}`}
    />
  );
}

export default function Principles() {
  return (
    <section
      data-chapter
      id="principles"
      aria-label="Work principles"
      className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[22vh] pb-[18vh]"
    >
      <SectionHeading index="03" label="Principles" watermark="/how we work" title="work principles" />

      <div className="mt-10 lg:mt-14 grid lg:grid-cols-2 gap-6 lg:gap-[6vw] items-start font-poppins">
        <p className="text-sm lg:text-[1vw] leading-relaxed text-white/60 max-w-sm">
          Solutions are tailored for VR headsets, real-time 3D, the web, and the cloud.
        </p>
        <p className="text-2xl sm:text-3xl lg:text-[2.3vw] leading-[1.2] tracking-tight text-white">
          Every project is shaped around the client and their business.
        </p>
      </div>

      <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 font-poppins">
        {/* Row 1 */}
        <article className={`${CARD} lg:col-span-6 h-72 lg:h-[40vh]`}>
          <Photo seed="principle-transparency" />
          <div className="absolute inset-0 bg-[#050713]/55" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
            <h3 className="text-3xl lg:text-[2.6vw] font-medium tracking-tight text-white">Transparency</h3>
            <p className="mt-3 text-sm lg:text-[0.95vw] text-white/85 max-w-sm">
              We align on goals, scope, and outcomes before we start.
            </p>
          </div>
        </article>

        <article className={`${CARD} lg:col-span-6 h-72 lg:h-[40vh]`}>
          <Photo seed="principle-aesthetics" className="grayscale" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050713]/85 via-[#050713]/45 to-[#050713]/60" />
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
            <p className="text-sm lg:text-[0.95vw] text-white/80 max-w-sm">
              Not beauty for its own sake — clarity, performance, and impact.
            </p>
            <h3 className="text-3xl lg:text-[2.6vw] font-medium tracking-tight text-white">Smart aesthetics</h3>
          </div>
        </article>

        {/* Row 2 */}
        <article className={`${CARD} lg:col-span-4 h-56 lg:h-[30vh] flex flex-col items-center justify-center gap-5 text-center px-6`}>
          <div className="flex items-center gap-4 text-white/85">
            <Glasses className="w-7 h-7" strokeWidth={1.5} />
            <Box className="w-7 h-7" strokeWidth={1.5} />
            <Globe className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm lg:text-[1vw] font-medium uppercase tracking-[0.08em] text-white">
            Honesty about
            <br />
            technology
          </h3>
        </article>

        <article className={`${CARD} lg:col-span-5 h-56 lg:h-[30vh]`}>
          <Photo seed="principle-engineering" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050713]/90 via-[#050713]/30 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6">
            <h3 className="text-sm lg:text-[1vw] font-medium uppercase tracking-[0.06em] text-white">
              Value-driven engineering
            </h3>
            <p className="mt-1.5 text-sm lg:text-[0.9vw] text-white/80">Every pixel and polygon serves your goals.</p>
          </div>
        </article>

        <div className="lg:col-span-3 grid gap-3 lg:gap-4 lg:h-[30vh] lg:grid-rows-[3fr_2fr]">
          <article className={`${CARD} h-40 lg:h-auto`}>
            <Photo seed="principle-schedule" />
            <div className="absolute inset-0 bg-[#050713]/60" />
            <div className="relative h-full flex flex-col justify-between p-5">
              <h3 className="font-mono text-[11px] lg:text-[0.75vw] uppercase tracking-[0.22em] text-white">
                On schedule
              </h3>
              <p className="text-xs lg:text-[0.8vw] text-white/85">
                We respect deadlines and take full ownership of quality.
              </p>
            </div>
          </article>
          <article className={`${CARD} h-28 lg:h-auto flex items-center gap-4 px-5`}>
            <Copyright className="w-7 h-7 shrink-0 text-white/45" strokeWidth={1.5} />
            <p className="text-xs lg:text-[0.8vw] text-white/80">We only use properly licensed assets and code.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
