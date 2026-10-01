// Shared social links (menu footer + hero). TODO: replace "#" with real profile URLs.
export const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z" />
    ),
  }
];

interface SocialLinksProps {
  iconClassName?: string;
  className?: string;
}

export default function SocialLinks({ iconClassName = "w-4 h-4", className = "" }: SocialLinksProps) {
  return (
    <>
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          className={`text-white hover:text-accent transition-colors ${className}`}
        >
          <svg viewBox="0 0 24 24" className={`fill-current ${iconClassName}`}>
            {s.icon}
          </svg>
        </a>
      ))}
    </>
  );
}
