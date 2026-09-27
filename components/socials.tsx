// Shared social links (menu footer + hero). TODO: replace "#" with real profile URLs.
export const SOCIALS = [
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
