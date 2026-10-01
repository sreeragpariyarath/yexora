import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { SERVICES_CONTENT } from "./services";

/**
 * Services list (layout from the owner's reference, in the site's dark theme): each service
 * is a row with its name and description on the left and two example thumbnails on the right.
 * On desktop the rows are sticky, so each new row slides up over the previous one.
 */
export default function Services() {
  const { index, label, watermark, title, items } = SERVICES_CONTENT;

  return (
    <section data-chapter id="services" aria-label="Services" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[22vh] pb-[16vh]">
      <SectionHeading index={index} label={label} watermark={watermark} title={title} />

      <ul className="mt-12 lg:mt-16 font-poppins">
        {items.map((service) => (
          <li
            key={service.title}
            className="lg:sticky lg:top-20 bg-[#050713] border-t border-white/10 py-8 lg:py-10 grid lg:grid-cols-2 gap-6 lg:gap-[4vw]"
          >
            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-[3.1vw] font-medium tracking-[-0.03em] leading-[1.05] text-white">
                {service.title}
              </h3>
              <p className="mt-4 text-sm sm:text-base lg:text-[1.02vw] leading-relaxed text-white/65 max-w-[34rem]">
                {service.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {service.works.map((work) => (
                <figure key={work.title}>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Image
                      src={work.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-[scale] duration-700 ease-out hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3">
                    <span className="block text-xs lg:text-[0.85vw] font-medium uppercase tracking-[0.02em] text-white">
                      {work.title}
                    </span>
                    <span className="block mt-0.5 text-xs lg:text-[0.85vw] uppercase text-white/50">{work.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
