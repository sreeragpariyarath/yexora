"use client";

import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "ABOUT", href: "#about" },
    { label: "WORKS", href: "#works" },
    { label: "SERVICES", href: "#services" },
    { label: "CONTACT", href: "#contact" },
  ];

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
        {navItems.map((item) => (
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
        <div className="col-span-1 border-b border-white/35 pb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group relative w-7 h-7 flex items-center justify-center text-white focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {/* Default // Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`stroke-white transition-all duration-300 ease-out ${
                mobileMenuOpen
                  ? "opacity-0 rotate-45 scale-75"
                  : "opacity-100 group-hover:opacity-0 group-hover:rotate-45 group-hover:scale-75"
              }`}
            >
              <line x1="6" y1="20" x2="14" y2="4" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="20" x2="20" y2="4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* Hover / Active X Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`absolute stroke-white transition-all duration-300 ease-out ${
                mobileMenuOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-45 scale-75 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100"
              }`}
            >
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="group relative w-7 h-7 flex items-center justify-center text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {/* Default // Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`stroke-white transition-all duration-300 ease-out ${
              mobileMenuOpen
                ? "opacity-0 rotate-45 scale-75"
                : "opacity-100 group-hover:opacity-0 group-hover:rotate-45 group-hover:scale-75"
            }`}
          >
            <line x1="6" y1="20" x2="14" y2="4" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="20" x2="20" y2="4" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Hover / Active X Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute stroke-white transition-all duration-300 ease-out ${
              mobileMenuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-45 scale-75 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100"
            }`}
          >
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-semibold tracking-widest text-white/90 hover:text-white uppercase py-2 border-b border-white/10"
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/70" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
