// The site's liquid-glass pill button (the header's "Get started", Contact's "Send enquiry"):
// CSS rim/sheen from .liquid-glass, and data-glass lets the GPU lens (glassLens.tsx)
// refract the scene behind it: give the element `data-glass="" data-glass-shown="1"` when it
// sits directly over the 3D scene (inside a glass card the card's dark layer covers that).
export const GLASS_PILL =
  "liquid-glass group relative inline-flex items-center gap-2.5 rounded-full! font-poppins font-medium text-[11px] sm:text-xs tracking-[0.16em] uppercase text-white pl-5 pr-2 py-2 cursor-pointer transition-[box-shadow,translate] duration-300 hover:-translate-y-px hover:shadow-[0_0_28px_rgba(47,107,255,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** The pill's dark backing layer and its gradient arrow chip. */
export function GlassPillParts({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-black/35" />
      {children}
      <span
        aria-hidden
        className="w-7 h-7 rounded-full bg-linear-to-br from-[#7ea6ff] to-accent flex items-center justify-center shadow-[0_0_14px_rgba(47,107,255,0.6)] transition-[rotate] duration-300 group-hover:rotate-45"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
    </>
  );
}
