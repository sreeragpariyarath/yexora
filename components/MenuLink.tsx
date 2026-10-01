import Link from "next/link";

interface MenuLinkProps {
  label: string;
  href: string;
  onClick?: () => void;
}

// Gentle ease-in-out: letters start softly and settle softly (no snap)
const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";
const DURATION = "duration-[650ms]";

export default function MenuLink({ label, href, onClick }: MenuLinkProps) {
  const letters = label.split("");

  const renderLetters = (className: string) =>
    letters.map((char, i) => (
      <span
        key={i}
        className={`inline-block transition-[translate,opacity] will-change-[translate,opacity] ${DURATION} ${EASE} ${className}`}
        style={{ transitionDelay: `${i * 30}ms` }}
      >
        {char === " " ? " " : char}
      </span>
    ));

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      className="group relative isolate flex justify-center overflow-hidden border-b border-white/20 hover:border-accent focus-visible:border-accent focus:outline-none transition-colors"
    >
      {/*
        overflow-hidden on the link masks the letters to their own row, so the outgoing
        and incoming words never spill over neighbouring rows (or catch their hover).
        Accent fill grows up from the bottom border.
      */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-accent origin-bottom scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100 transition-transform ${DURATION} ${EASE}`}
      />

      <span
        aria-hidden
        style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
        className="pointer-events-none relative z-10 inline-block whitespace-nowrap font-bebas uppercase text-[15vw] sm:text-7xl lg:text-7xl leading-[0.95] pt-2 -mb-[0.17em]"
      >
        {/* Grey layer: leaves upwards */}
        <span className="block">
          {renderLetters(
            "text-white/45 group-hover:-translate-y-full group-hover:opacity-0 group-focus-visible:-translate-y-full group-focus-visible:opacity-0"
          )}
        </span>

        {/* White layer: rises from below */}
        <span className="absolute inset-0 pt-2">
          {renderLetters(
            "text-white translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          )}
        </span>
      </span>
    </Link>
  );
}
