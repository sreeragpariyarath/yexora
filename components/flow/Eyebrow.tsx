/** Small uppercase label with the outlined diamond, as used on the glass cards. */
export default function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      className={`font-poppins font-medium uppercase text-[11px] lg:text-xs tracking-[0.18em] text-white/80 inline-flex items-center gap-2.5 ${className}`}
    >
      <span aria-hidden className="w-2 h-2 rotate-45 border border-white/70" />
      {children}
    </p>
  );
}
