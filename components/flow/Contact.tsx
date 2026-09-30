"use client";

import { type ComponentType, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import SocialLinks from "@/components/socials";
import { COMPANY, EMAIL, LOCATION, PHONE } from "@/components/contact";
import logoMark from "@/public/logo-mark.png";
import CopyBlock from "./CopyBlock";
import { SERVICES } from "./services";

const FOOTER_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Contact", href: "#contact" },
];

// Floating-label fields: the label sits in the field and floats up on focus or once
// filled (CSS only, via `peer` + `placeholder-shown`; the placeholder is a single space)
const INPUT =
  "peer w-full rounded-xl bg-white/[0.035] border border-white/10 px-4 pt-6 pb-2.5 font-poppins text-sm text-white outline-none transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/20 focus:border-violet-400/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(139,92,246,0.14)]";
const LABEL =
  "pointer-events-none absolute left-4 top-2 font-poppins text-[10px] uppercase tracking-[0.16em] text-white/45 transition-all duration-200 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-violet-300";

function Field({ name, label, type = "text", autoComplete, multiline = false }: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const id = `contact-${name}`;
  return (
    <div className="relative">
      {multiline ? (
        <textarea id={id} name={name} required rows={5} placeholder=" " className={`${INPUT} resize-none`} />
      ) : (
        <input id={id} name={name} type={type} required autoComplete={autoComplete} placeholder=" " className={INPUT} />
      )}
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
    </div>
  );
}

function Detail({ icon: Icon, label, children, href }: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white bg-linear-to-br from-violet-500/35 to-accent/25 ring-1 ring-white/15 shadow-[0_0_24px_rgba(139,92,246,0.25)]">
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</span>
        <span className="block mt-0.5 text-[15px] text-white truncate">{children}</span>
      </span>
      {href && (
        <ArrowUpRight
          aria-hidden
          className="ml-auto w-4 h-4 shrink-0 text-white/40 transition-[translate,color] duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  const box =
    "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-poppins transition-[translate,border-color,background-color,box-shadow] duration-300";
  return href ? (
    <a
      href={href}
      className={`${box} hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/[0.05] hover:shadow-[0_10px_40px_-12px_rgba(139,92,246,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400`}
    >
      {inner}
    </a>
  ) : (
    <div className={box}>{inner}</div>
  );
}

/**
 * Closing section: contact details + a project form. There is no backend yet, so
 * submitting opens the visitor's mail app with the enquiry filled in.
 */
export default function Contact() {
  const lenis = useLenis();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const services = data.getAll("service").map(String);
    const needs = services.length ? services.join(", ") : "Not specified";
    const subject = `Project enquiry — ${services[0] ?? "New project"}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nServices: ${needs}\n\n${data.get("message")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section data-chapter id="contact" aria-label="Contact" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[16vh] pb-10">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-[5vw] items-start">
        <div className="text-center lg:text-left">
          <CopyBlock
            eyebrow="Contact"
            title={
              <>
                Let&apos;s Talk About{" "}
                <span className="bg-linear-to-r from-violet-300 via-violet-400 to-[#7b9bff] bg-clip-text text-transparent">
                  Your Project
                </span>
              </>
            }
            body="Tell us what you want to build — software, an immersive experience or an AI solution — and we'll get back to you."
            className="max-w-xl mx-auto lg:mx-0"
          />

          <div className="mt-10 grid gap-3 max-w-md mx-auto lg:mx-0">
            <Detail icon={Mail} label="Email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </Detail>
            <Detail icon={Phone} label="Phone" href={`tel:${PHONE.replace(/\s/g, "")}`}>
              {PHONE}
            </Detail>
            <Detail icon={MapPin} label="Location">
              {LOCATION}
            </Detail>
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-white/70 font-poppins text-sm">
            <span>Follow us</span>
            <span aria-hidden className="w-10 h-px bg-white/30" />
            <SocialLinks
              iconClassName="w-4 h-4"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center transition-[border-color,background-color] hover:border-violet-400/60 hover:bg-violet-500/10"
            />
          </div>
        </div>

        {/* Gradient hairline border around the form card */}
        <div className="relative rounded-[1.75rem] p-px bg-linear-to-br from-violet-400/50 via-white/10 to-accent/40 shadow-[0_0_100px_-10px_rgba(143,107,255,0.3)]">
          <form onSubmit={onSubmit} className="rounded-[calc(1.75rem-1px)] bg-[#080a17]/95 backdrop-blur-xl p-6 sm:p-9 flex flex-col gap-5">
            <div className="font-poppins">
              <h3 className="text-xl lg:text-[1.5vw] font-medium text-white tracking-tight">Start a project</h3>
              <p className="mt-1.5 text-sm text-white/55">Tell us a little about it — it only takes a minute.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="name" label="Your name" autoComplete="name" />
              <Field name="email" label="Email address" type="email" autoComplete="email" />
            </div>

            {/* Service chips instead of a <select>: real checkboxes, so several can be picked */}
            <fieldset>
              <legend className="font-poppins text-[10px] uppercase tracking-[0.16em] text-white/45 mb-3">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <label
                    key={s}
                    className="group cursor-pointer select-none inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 font-poppins text-xs text-white/70 transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-white/30 hover:text-white has-checked:border-violet-400/70 has-checked:bg-violet-500/20 has-checked:text-white has-checked:shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet-400"
                  >
                    <input type="checkbox" name="service" value={s} className="sr-only" />
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full bg-white/25 transition-[background-color,box-shadow] group-has-checked:bg-violet-300 group-has-checked:shadow-[0_0_8px_rgba(196,181,253,0.9)]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>

            <Field name="message" label="Tell us about your project" multiline />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              <button
                type="submit"
                className="group w-full sm:w-auto justify-between sm:justify-start inline-flex items-center gap-3 rounded-full bg-white text-[#0b0d1a] pl-5 pr-1.5 py-1.5 font-poppins font-medium text-xs tracking-[0.12em] uppercase shadow-[0_0_30px_rgba(143,107,255,0.35)] transition-shadow hover:shadow-[0_0_40px_rgba(143,107,255,0.6)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                Send enquiry
                <span className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-accent text-white flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </button>
              <span className="font-poppins text-xs text-white/40 text-center sm:text-left">Opens your email app</span>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-[14vh] pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 font-poppins text-xs text-white/50">
        <div className="flex items-center gap-3">
          <Image src={logoMark} alt="" className="w-6 h-6 brightness-0 invert opacity-80" />
          <span>
            © 2026 {COMPANY} · {LOCATION}
          </span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-6 uppercase tracking-[0.16em]">
          {FOOTER_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={toTop}
          className="group inline-flex items-center gap-2 uppercase tracking-[0.16em] hover:text-white transition-colors cursor-pointer"
        >
          Back to top
          <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center transition-[border-color,translate] group-hover:border-white/40 group-hover:-translate-y-0.5">
            <ArrowUp className="w-3.5 h-3.5" />
          </span>
        </button>
      </footer>
    </section>
  );
}
