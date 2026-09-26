"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import MenuIcon from "./MenuIcon";
import MenuLink from "./MenuLink";

export interface NavItem {
  label: string;
  href: string;
}

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

// Slow-in / slow-out so the panel eases away and settles gently (no snap at either end)
const DURATION = "duration-[1100ms]";
const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

// TODO: replace placeholder contact details with real ones
const EMAIL = "contact@yexoraitsolutions.com";
const PHONE = "+91 00000 00000";
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z" />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1ZM17.95 7.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.73 0 3.05.01 4.13.06 2.77.13 4.07 1.44 4.2 4.2.05 1.08.06 1.4.06 4.14 0 2.73-.01 3.05-.06 4.13-.13 2.76-1.42 4.07-4.2 4.2-1.08.05-1.4.06-4.13.06-2.74 0-3.06-.01-4.14-.06-2.78-.13-4.07-1.45-4.2-4.2C3.61 15.05 3.6 14.73 3.6 12c0-2.74.01-3.06.06-4.14.13-2.76 1.43-4.07 4.2-4.2C8.94 3.61 9.26 3.6 12 3.6ZM12 2c-2.72 0-3.06.01-4.13.06C4.2 2.23 2.24 4.19 2.06 7.87 2.01 8.94 2 9.28 2 12s.01 3.06.06 4.13c.17 3.67 2.13 5.64 5.81 5.81 1.07.05 1.41.06 4.13.06s3.06-.01 4.13-.06c3.67-.17 5.64-2.13 5.81-5.81.05-1.07.06-1.41.06-4.13s-.01-3.06-.06-4.13c-.17-3.67-2.13-5.64-5.81-5.81C15.06 2.01 14.72 2 12 2Z" />
    ),
  },
];

export default function MenuOverlay({ open, onClose, items }: MenuOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, onClose, lenis]);

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[60] overflow-hidden bg-[#0b0d1a] transition-transform will-change-transform ${DURATION} ${EASE} ${
        open ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="fixed top-5 right-4 sm:right-8 z-20 w-14 h-14 flex items-center justify-center rounded-2xl border border-white/20 hover:border-white/50 transition-colors cursor-pointer focus:outline-none focus-visible:border-white"
      >
        <MenuIcon isOpen />
      </button>

      {/*
        Content moves with the panel but travels less (starts 60% lower), so it is
        revealed rather than dropped in, and lands at the same moment as the panel.
        The panel's overflow-hidden clips it, so the offset never creates a scrollbar.
      */}
      <div
        data-lenis-prevent
        className={`h-full overflow-y-auto overflow-x-hidden transition-transform will-change-transform ${DURATION} ${EASE} ${
          open ? "translate-y-0" : "translate-y-[60%]"
        }`}
      >
        <div className="min-h-full flex flex-col">
          {/* Faded brand name */}
          <div className="flex justify-center select-none pointer-events-none shrink-0 -mt-[1vw]">
            <span
              aria-hidden
              style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
              className="font-bebas whitespace-nowrap text-[14vw] leading-[0.85] bg-linear-to-b from-white/35 via-white/10 via-45% to-transparent to-80% bg-clip-text text-transparent"
            >
              YEXORA IT SOLUTIONS
            </span>
          </div>
    
          {/* Nav rows */}
          <nav className="flex-1 flex flex-col justify-center pt-2 pb-[10vh]">
            {items.map((item, i) => (
              <div
                key={item.label}
                // Opacity only: rows fade in while the panel travels and never move
                // on their own, so nothing shifts after the panel lands.
                className={`transition-opacity ease-out ${open ? "opacity-100 duration-700" : "opacity-0 duration-300"}`}
                style={{ transitionDelay: open ? `${300 + i * 70}ms` : "0ms" }}
              >
                <MenuLink label={item.label} href={item.href} onClick={onClose} />
              </div>
            ))}
          </nav>
    
          {/* Footer */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-16 pb-6 pt-4 text-white text-sm sm:text-base">
            <a href={`mailto:${EMAIL}`} className="border-b border-white/80 hover:border-accent hover:text-accent transition-colors">
              {EMAIL}
            </a>
    
            <div className="flex items-center gap-3">
              <span>Follow us</span>
              <span className="w-8 h-px bg-white/60" />
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white hover:text-accent transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
    
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="border-b border-white/80 hover:border-accent hover:text-accent transition-colors">
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
