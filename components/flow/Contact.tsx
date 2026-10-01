"use client";

import { type ComponentType, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import SocialLinks from "@/components/socials";
import { EMAIL, LEGAL_NAME, LOCATION } from "@/components/contact";
import { GLASS_PILL, GlassPillParts } from "@/components/GlassPill";
import CopyBlock from "./CopyBlock";
import Eyebrow from "./Eyebrow";
import GlassPanel from "./GlassPanel";
import ServiceSelect from "./ServiceSelect";
import { SERVICES } from "./services";

// Floating-label fields: the label sits in the field and floats up on focus or once
// filled (CSS only, via `peer` + `placeholder-shown`; the placeholder is a single space).
// Fields are translucent tiles inside the glass card, with an accent ring on focus.
const INPUT =
  "peer w-full rounded-2xl bg-white/[0.04] border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] px-4 pt-6 pb-2.5 font-poppins text-sm text-white outline-none transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/25 focus:border-accent/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(47,107,255,0.18)]";
const LABEL =
  "pointer-events-none absolute left-4 top-2 font-poppins text-[10px] uppercase tracking-[0.16em] text-white/50 transition-all duration-200 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-blue-300";
const TITLE = "font-poppins font-medium tracking-tight leading-[1.08] text-white";
const BODY = "font-poppins text-sm lg:text-[0.95vw] leading-relaxed text-white/85";
const CARD_LABEL = "block font-poppins font-medium text-[10px] uppercase tracking-[0.18em] text-white/55";

function Field({ name, label, type = "text", autoComplete, multiline = false, className = "" }: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  className?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div className={`relative ${className}`}>
      {multiline ? (
        <textarea id={id} name={name} required rows={5} placeholder=" " className={`${INPUT} h-full min-h-36 resize-none`} />
      ) : (
        <input id={id} name={name} type={type} required autoComplete={autoComplete} placeholder=" " className={INPUT} />
      )}
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
    </div>
  );
}

/** Round icon chip in the accent gradient (same as the glass pill's arrow chip). */
function IconChip({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white bg-linear-to-br from-[#7ea6ff] to-accent shadow-[0_0_18px_rgba(47,107,255,0.55)]">
      <Icon className="w-[18px] h-[18px]" />
    </span>
  );
}

/** One contact detail on its own glass card; a link when it has an href. */
function Detail({ icon, label, children, href, delay }: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  href?: string;
  delay: number;
}) {
  const inner = (
    <>
      <IconChip icon={icon} />
      <span className="min-w-0 text-left">
        <span className={CARD_LABEL}>{label}</span>
        <span className="block mt-1 font-poppins text-sm sm:text-[15px] lg:text-[1.05vw] text-white [overflow-wrap:anywhere]">{children}</span>
      </span>
      {href && (
        <ArrowUpRight
          aria-hidden
          className="ml-auto w-4 h-4 shrink-0 text-white/50 transition-[translate,color] duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  const row = "relative flex items-center gap-4 p-5 lg:p-[1.4vw]";
  return (
    <GlassPanel delay={delay}>
      {href ? (
        <a href={href} className={`group ${row} rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent`}>
          {inner}
        </a>
      ) : (
        <div className={row}>{inner}</div>
      )}
    </GlassPanel>
  );
}

/**
 * Closing section, in the site's glass style: the heading and contact details on glass
 * cards on the left, the project form on one glass card on the right. There is no
 * backend yet, so submitting opens the visitor's mail app with the enquiry filled in.
 */
export default function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const services = data.getAll("service").map(String);
    const needs = services.length ? services.join(", ") : "Not specified";
    const subject = `Project enquiry — ${services[0] ?? "New project"}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nServices: ${needs}\n\n${data.get("message")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section data-chapter id="contact" aria-label="Contact" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[16vh] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-5">
          <CopyBlock
            glass
            eyebrow="Contact"
            title={
              <>
                Let&apos;s Talk About{" "}
                <span className="bg-linear-to-r from-blue-300 via-accent to-[#7b9bff] bg-clip-text text-transparent">
                  Your Project
                </span>
              </>
            }
            body="Tell us what you want to build — software, an immersive experience or an AI solution — and we'll get back to you."
            className="text-center lg:text-left"
          />

          <Detail icon={Mail} label="Email" href={`mailto:${EMAIL}`} delay={100}>
            {EMAIL}
          </Detail>
          <Detail icon={MapPin} label="Location" delay={200}>
            {LOCATION}
          </Detail>

          <GlassPanel delay={300}>
            <div className="flex items-center justify-between gap-4 p-5 lg:p-[1.4vw]">
              <span className={CARD_LABEL}>Follow us</span>
              <div className="flex items-center gap-2">
                <SocialLinks
                  iconClassName="w-4 h-4"
                  className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.05] flex items-center justify-center transition-[border-color,background-color,color] duration-300 hover:border-accent/60 hover:bg-accent/15 hover:text-white!"
                />
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Not clipped, so the services dropdown can open past the fields below it */}
        <GlassPanel clip={false} delay={150} className="lg:col-span-7">
          <form onSubmit={onSubmit} className="h-full flex flex-col gap-4 p-6 sm:p-8 lg:p-[2.4vw]">
            <div className="text-center lg:text-left mb-2">
              <Eyebrow>Start a project</Eyebrow>
              <h3 className={`${TITLE} mt-3 text-2xl lg:text-[2vw]`}>Tell Us About Your Idea</h3>
              <p className={`${BODY} mt-2`}>Share a few details and we&apos;ll get back to you.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="name" label="Your name" autoComplete="name" />
              <Field name="email" label="Email address" type="email" autoComplete="email" />
            </div>

            {/* Dropdown instead of chips: several services can be picked (see ServiceSelect) */}
            <ServiceSelect name="service" label="What do you need?" options={SERVICES} />

            <Field name="message" label="Tell us about your project" multiline className="flex-1" />

            {/* Same glass pill as the header's "Get started" */}
            <button type="submit" className={`${GLASS_PILL} self-center lg:self-start mt-2`}>
              <GlassPillParts>Send enquiry</GlassPillParts>
            </button>
          </form>
        </GlassPanel>
      </div>

      <footer className="mt-[12vh] pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center font-poppins text-[10px] lg:text-[11px] capitalize tracking-[0.24em] text-white/45">
        <span className="text-white/65">{LEGAL_NAME}</span>
        <span aria-hidden className="text-white/25">·</span>
        <span>© 2026 {LOCATION}</span>
      </footer>
    </section>
  );
}
