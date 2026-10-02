import CopyBlock from "./CopyBlock";
import GlassPanel from "./GlassPanel";
import TintedImage from "./TintedImage";
import { SERVICES_CONTENT } from "./services";

/**
 * Services: each one is a liquid-glass row with its name and description on the left and
 * two example thumbnails on the right (layout from the owner's reference, styled like the
 * rest of the site).
 */
export default function Services() {
  return (
    <section data-chapter id="services" aria-label="Services" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[24vh] pb-[10vh]">
      <CopyBlock
        glass
        eyebrow="What we do"
        title="Built End-to-End."
        body="From immersive experiences to the platforms behind them — design, build and support under one roof."
        className="text-center lg:text-left max-w-xl mx-auto lg:mx-0 lg:max-w-[40vw]"
      />

      <ul className="mt-10 lg:mt-[8vh] grid gap-4 lg:gap-5">
        {SERVICES_CONTENT.items.map((service, i) => (
          <li key={service.title}>
            <GlassPanel className="grid lg:grid-cols-[1fr_1.15fr] gap-6 lg:gap-[3vw] p-6 sm:p-8 lg:p-[2.2vw] items-center">
              <div>
                <p className="font-poppins font-medium uppercase text-[11px] lg:text-xs tracking-[0.18em] text-white/70 inline-flex items-center gap-2.5">
                  <span aria-hidden className="w-2 h-2 rotate-45 border border-white/70" />
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-poppins font-medium tracking-tight leading-[1.08] text-white text-2xl sm:text-3xl lg:text-[2.2vw]">
                  {service.title}
                </h3>
                <p className="mt-4 font-poppins text-sm sm:text-base lg:text-[1.02vw] leading-relaxed text-white/85 max-w-[34rem]">
                  {service.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {service.works.map((work) => (
                  <figure key={work.title} className="group">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
                      <TintedImage src={work.image} sizes="(min-width: 1024px) 22vw, 45vw" />
                    </div>
                    <figcaption className="mt-3 font-poppins">
                      <span className="block text-xs lg:text-[0.8vw] font-medium uppercase tracking-[0.12em] text-white">
                        {work.title}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>
    </section>
  );
}
