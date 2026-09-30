"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import MenuIcon from "./MenuIcon";
import MenuLink from "./MenuLink";
import SocialLinks from "./socials";
import { EMAIL, PHONE } from "./contact";

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
              <SocialLinks />
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
