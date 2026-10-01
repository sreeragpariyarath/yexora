"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// A 3× copy of logo2.png sized for the header (the original is 3623×2192, decoded in full for a 56px logo)
import logo from "@/public/logo2-header.png";
import { GLASS_PILL, GlassPillParts } from "./GlassPill";
import MenuIcon from "./MenuIcon";
import MenuOverlay, { type NavItem } from "./MenuOverlay";

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "WORKS", href: "#works" },
  { label: "SERVICES", href: "#services" },
];

// Desktop has no Contact link (the "Get started" pill goes there); the phone menu keeps it
const MENU_ITEMS: NavItem[] = [{ label: "HOME", href: "#home" }, ...NAV_ITEMS, { label: "CONTACT", href: "#contact" }];

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={`w-full z-50 px-4 sm:px-8 lg:px-10 pt-5 pb-8 bg-linear-to-b from-[#000000]/70 to-transparent ${className}`}
    >
      {/* Logo · nav (centred on desktop) · actions */}
      <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-6">
        <Link href="#home" aria-label="Yexora home" className="group inline-flex items-center justify-self-start">
          <Image src={logo} alt="" priority className="h-11 lg:h-14 w-auto transition-opacity group-hover:opacity-80" />
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-poppins font-medium text-xs tracking-[0.14em] uppercase text-white/80 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          {/* Liquid-glass pill (GlassPill.tsx): same CSS rim/sheen as the copy cards, and
              data-glass lets the GPU lens refract the fibres behind it */}
          <Link href="#contact" data-glass="" data-glass-shown="1" className={GLASS_PILL}>
            <GlassPillParts>Get started</GlassPillParts>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden group relative w-8 h-8 flex items-center justify-center text-white focus:outline-none cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <MenuIcon isOpen={menuOpen} />
          </button>
        </div>
      </div>

      {/* Full-screen menu (opened from the mobile/tablet bar) */}
      <MenuOverlay open={menuOpen} onClose={closeMenu} items={MENU_ITEMS} />
    </header>
  );
}
