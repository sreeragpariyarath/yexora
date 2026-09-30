"use client";

import { type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import SocialLinks from "@/components/socials";
import { COMPANY, EMAIL, LOCATION, PHONE } from "@/components/contact";
import CopyBlock from "./CopyBlock";
import { SERVICES } from "./services";

const FIELD =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-accent focus:bg-white/[0.07]";

/**
 * Closing section: contact details + a project form. There is no backend yet, so
 * submitting opens the visitor's mail app with the enquiry filled in.
 */
export default function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const subject = `Project enquiry — ${data.get("service")}`;
    const body = `Name: ${name}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section data-chapter id="contact" aria-label="Contact" className="relative w-full px-6 sm:px-10 lg:px-[6vw] pt-[16vh] pb-10">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-[6vw] items-start">
        <div className="text-center lg:text-left">
          <CopyBlock
            eyebrow="Contact"
            title="Let's Talk About Your Project"
            body="Tell us what you want to build — software, an immersive experience or an AI solution — and we'll get back to you."
            className="max-w-xl mx-auto lg:mx-0"
          />

          <dl className="mt-10 space-y-5 font-poppins text-white">
            {[
              ["Email", <a key="e" href={`mailto:${EMAIL}`} className="hover:text-accent transition-colors">{EMAIL}</a>],
              ["Phone", <a key="p" href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-accent transition-colors">{PHONE}</a>],
              ["Location", LOCATION],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</dt>
                <dd className="mt-1 text-lg">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-white font-poppins text-sm">
            <span>Follow us</span>
            <span aria-hidden className="w-10 h-px bg-white/60" />
            <SocialLinks iconClassName="w-5 h-5" />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-[#0c0f1f]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(143,107,255,0.18)] p-6 sm:p-8 flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" required autoComplete="name" placeholder="Your name" aria-label="Your name" className={FIELD} />
            <input name="email" type="email" required autoComplete="email" placeholder="Email address" aria-label="Email address" className={FIELD} />
          </div>
          <select name="service" aria-label="What do you need?" defaultValue={SERVICES[0]} className={`${FIELD} appearance-none`}>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-[#0c0f1f]">
                {s}
              </option>
            ))}
          </select>
          <textarea name="message" required rows={5} placeholder="Tell us about your project" aria-label="Project details" className={`${FIELD} resize-none`} />
          <button
            type="submit"
            className="group self-start inline-flex items-center gap-3 rounded-full bg-white text-[#0b0d1a] pl-5 pr-1.5 py-1.5 font-poppins font-medium text-xs tracking-[0.12em] uppercase shadow-[0_0_30px_rgba(143,107,255,0.35)] transition-shadow hover:shadow-[0_0_40px_rgba(143,107,255,0.6)] cursor-pointer"
          >
            Send enquiry
            <span className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-accent text-white flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </button>
        </form>
      </div>

      <p className="mt-[14vh] pt-6 border-t border-white/10 font-poppins text-xs text-white/45 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© 2026 {COMPANY}</span>
        <span>{LOCATION}</span>
      </p>
    </section>
  );
}
