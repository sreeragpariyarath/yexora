"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import MenuIcon from "./MenuIcon";
import MenuOverlay, { type NavItem } from "./MenuOverlay";

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "WORKS", href: "#works" },
  { label: "SERVICES", href: "#services" },
  { label: "CONTACT", href: "#contact" },
];

const MENU_ITEMS: NavItem[] = [{ label: "HOME", href: "/" }, ...NAV_ITEMS];

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`w-full z-50 pt-5 sm:pt-5 px-4 sm:px-8 lg:px-8 ${className}`}>
      {/* Desktop Navigation Grid */}
      <div className="hidden lg:grid grid-cols-12 gap-5 xl:gap-8 items-end w-full">
        {/* Brand / Logo Column */}
        <div className="col-span-3 border-b border-white/35 pb-3">
          <Link href="/" className="inline-flex items-center group focus:outline-none">
            <span
              style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
              className="font-bebas text-2xl xl:text-3xl text-white tracking-widest leading-none pt-1 transition-opacity group-hover:opacity-90"
            >
              YEXORA
            </span>
          </Link>
        </div>

        {/* Navigation Link Columns */}
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="col-span-2 border-b border-white/35 pb-3 group">
            <Link
              href={item.href}
              className="flex items-center gap-2.5 text-xs xl:text-sm font-semibold tracking-widest text-white/90 group-hover:text-white transition-colors uppercase"
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/70 group-hover:border-white group-hover:bg-white/20 transition-all shrink-0" />
              <span>{item.label}</span>
            </Link>
          </div>
        ))}

        {/* Right Menu Action Column */}
        <div className="col-span-1 border-b border-white/35 pb-3 flex justify-center">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="group relative w-8 h-8 flex items-center justify-center text-white focus:outline-none cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <MenuIcon isOpen={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Header Bar */}
      <div className="lg:hidden flex items-center justify-between border-b border-white/35 pb-3">
        <Link href="/" className="inline-flex items-center">
          <span
            style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
            className="font-bebas text-2xl text-white tracking-widest leading-none pt-0.5"
          >
            YEXORA
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="group relative w-8 h-8 flex items-center justify-center text-white focus:outline-none cursor-pointer"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <MenuIcon isOpen={menuOpen} />
        </button>
      </div>

      {/* Full-screen menu (all breakpoints) */}
      <MenuOverlay open={menuOpen} onClose={closeMenu} items={MENU_ITEMS} />
    </header>
  );
}
