interface MenuIconProps {
  isOpen?: boolean;
  className?: string;
}

export default function MenuIcon({ isOpen = false, className = "" }: MenuIconProps) {
  return (
    <div
      className={`relative w-8 h-8 flex flex-col items-center justify-center gap-[6px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform ${
        isOpen ? "rotate-0" : "-rotate-45 group-hover:rotate-0"
      } ${className}`}
    >
      {/* Top line */}
      <span
        className={`w-7 h-[2.5px] bg-white rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center transform-gpu will-change-transform ${
          isOpen
            ? "rotate-45 translate-y-[7.5px]"
            : "scale-x-[0.64] group-hover:scale-x-100"
        }`}
      />

      {/* Middle line */}
      <span
        className={`w-7 h-[1.5px] bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
        }`}
      />

      {/* Bottom line */}
      <span
        className={`w-7 h-[2.5px] bg-white rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center transform-gpu will-change-transform ${
          isOpen
            ? "-rotate-45 -translate-y-[7.5px]"
            : "scale-x-[0.64] group-hover:scale-x-100"
        }`}
      />
    </div>
  );
}

