"use client";

import { useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, LoaderCircle, Mail, MapPin } from "lucide-react";
import SocialLinks from "@/components/socials";
import { EMAIL, LEGAL_NAME, LOCATION, WEB3FORMS_KEY } from "@/components/contact";
import CopyBlock from "./CopyBlock";
import Eyebrow from "./Eyebrow";
import ServiceSelect from "./ServiceSelect";
import { SERVICES } from "./services";

// Floating-label fields: the label sits in the field and floats up on focus or once
// filled (CSS only, via `peer` + `placeholder-shown`; the placeholder is a single space).
// Fields are flat, filled dark boxes on the solid form card, with an accent ring on focus.
const INPUT =
  "peer w-full rounded-xl bg-[#121212] border border-white/10 px-4 pt-6 pb-2.5 font-poppins text-sm text-white outline-none transition-[border-color,box-shadow] duration-300 hover:border-white/20 focus:border-accent/70 focus:shadow-[0_0_0_4px_rgba(47,107,255,0.18)]";
const LABEL =
  "pointer-events-none absolute left-4 top-2 font-poppins text-[10px] uppercase tracking-[0.16em] text-white/50 transition-all duration-200 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-blue-300";
const TITLE = "font-poppins font-medium tracking-tight leading-[1.08] text-white";
const BODY = "font-poppins text-sm lg:text-[0.95vw] leading-relaxed text-white/85";
const ROW_LABEL = "block font-poppins font-medium text-[10px] uppercase tracking-[0.18em] text-white/55";

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

/** Flat round icon chip. */
function IconChip({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-blue-300 bg-white/[0.06] ring-1 ring-white/10">
      <Icon className="w-[18px] h-[18px]" />
    </span>
  );
}

/** One contact detail as a plain row; a link when it has an href. */
function Detail({ icon, label, children, href }: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <IconChip icon={icon} />
      <span className="min-w-0 text-left">
        <span className={ROW_LABEL}>{label}</span>
        <span className="block mt-1 font-poppins text-sm sm:text-[15px] lg:text-[1.05vw] text-white/90 transition-colors group-hover:text-white [overflow-wrap:anywhere]">{children}</span>
      </span>
      {href && (
        <ArrowUpRight
          aria-hidden
          className="ml-auto w-4 h-4 shrink-0 text-white/50 transition-[translate,color] duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  const row = "flex items-center gap-4 py-5";
  return href ? (
    <a href={href} className={`group ${row} rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}>
      {inner}
    </a>
  ) : (
    <div className={row}>{inner}</div>
  );
}

/**
 * Closing section (no liquid glass here, at the owner's request): the heading and contact
 * details as plain rows on the left, the project form on one solid dark card on the right.
 * The form posts to Web3Forms, which emails the enquiry to the owner's inbox (no backend of our own).
 */
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  // Bumped to remount (clear) the form, including the services dropdown, after a send
  const [formKey, setFormKey] = useState(0);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    const services = data.getAll("service").map(String);
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry: ${services[0] ?? "New project"}`,
          from_name: "Yexora website",
          name: data.get("name"),
          // Web3Forms sets this as the reply-to, so replying goes straight to the visitor
          email: data.get("email"),
          services: services.length ? services.join(", ") : "Not specified",
          message: data.get("message"),
          // Honeypot: humans never see or tick it; Web3Forms drops submissions where it's set
          botcheck: data.get("botcheck") === "on",
        }),
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
      setStatus(res.ok && json?.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const sendAnother = () => {
    setFormKey((k) => k + 1);
    setStatus("idle");
  };

  return (
    <section data-chapter id="contact" aria-label="Contact" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[16vh] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[5vw] items-start">
        <div className="lg:col-span-5">
          <CopyBlock
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

          <div className="mt-10 max-w-md mx-auto lg:mx-0 divide-y divide-white/10 border-y border-white/10">
            <Detail icon={Mail} label="Email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </Detail>
            <Detail icon={MapPin} label="Location">
              {LOCATION}
            </Detail>
            <div className="flex items-center justify-between gap-4 py-5">
              <span className={ROW_LABEL}>Follow us</span>
              <div className="flex items-center gap-2">
                <SocialLinks
                  iconClassName="w-4 h-4"
                  className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center transition-[border-color,background-color,color] duration-300 hover:border-accent/60 hover:bg-accent/15 hover:text-white!"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Solid, flat dark card (no glass, glow or blur). Not clipped, so the services
            dropdown can open past the fields below it */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0a0a0a] border border-white/10">
          {status === "sent" ? (
            <div role="status" className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 p-6 sm:p-8 lg:p-[2.4vw] min-h-80 justify-center">
              <span className="w-14 h-14 rounded-full flex items-center justify-center bg-accent text-white">
                <Check className="w-7 h-7" strokeWidth={2.5} />
              </span>
              <h3 className={`${TITLE} text-2xl lg:text-[2vw]`}>Thanks, We&apos;ll Be in Touch</h3>
              <p className={BODY}>Your enquiry has been sent. We&apos;ll get back to you at the email you gave us.</p>
              <button
                type="button"
                onClick={sendAnother}
                className="mt-1 font-poppins text-xs tracking-[0.14em] uppercase text-blue-300 hover:text-white transition-colors cursor-pointer"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
          <form key={formKey} onSubmit={onSubmit} className="flex flex-col gap-4 p-6 sm:p-8 lg:p-[2.4vw]">
            {/* Honeypot for bots (see onSubmit): hidden from people and from keyboard focus */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
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

            <Field name="message" label="Tell us about your project" multiline />

            <button
              type="submit"
              disabled={status === "sending"}
              className="group self-center lg:self-start mt-2 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-poppins font-medium text-xs tracking-[0.14em] uppercase text-white cursor-pointer transition-colors duration-300 hover:bg-[#4a80ff] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {status === "sending" ? "Sending…" : "Send enquiry"}
              {status === "sending" ? (
                <LoaderCircle aria-hidden className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpRight
                  aria-hidden
                  className="w-4 h-4 transition-[translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              )}
            </button>
            {status === "error" && (
              <p role="alert" className="font-poppins text-sm text-red-300 text-center lg:text-left">
                Couldn&apos;t send right now. Please try again, or email us at{" "}
                <a href={`mailto:${EMAIL}`} className="underline hover:text-white">
                  {EMAIL}
                </a>
                .
              </p>
            )}
          </form>
          )}
        </div>
      </div>

      <footer className="mt-[12vh] pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center font-poppins text-[10px] lg:text-[11px] capitalize tracking-[0.24em] text-white/45">
        <span className="text-white/65">{LEGAL_NAME}</span>
        <span aria-hidden className="text-white/25">·</span>
        <span>© 2026 {LOCATION}</span>
      </footer>
    </section>
  );
}
