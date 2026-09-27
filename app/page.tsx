import Image from "next/image";
import heroImage from "@/public/hero-image.png";
import Header from "@/components/Header";
import SocialLinks from "@/components/socials";

// Double-chevron of square "pixels" on a 5×5 grid, as in the reference stat badge
const PIXELS = [
  [0, 0], [2, 0],
  [1, 1], [3, 1],
  [2, 2], [4, 2],
  [1, 3], [3, 3],
  [0, 4], [2, 4],
];

function PixelMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 5" aria-hidden className={`fill-white ${className}`}>
      {PIXELS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.22} y={y + 0.22} width={0.56} height={0.56} />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative h-[150vh] min-h-[150vh] w-full overflow-hidden flex flex-col items-center">
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center -z-10 origin-center"
      />

      {/* Reusable Header */}
      <Header />

      <div className="w-full pt-[4vh] sm:pt-[6vh] lg:pt-[10vh] px-2 flex justify-center select-none pointer-events-none">
        <h1
          style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
          className="font-bebas text-white uppercase text-center font-bold text-[14.5vw] leading-none tracking-normal whitespace-nowrap"
        >
          YEXORA IT SOLUTIONS
        </h1>
      </div>

      {/* Headline (left, beside the headphone) + intro (right, beside the face) */}
      <div className="absolute inset-x-0 top-[52%] lg:top-[50%] px-6 sm:px-10 lg:px-[5.2vw] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.25)]">
        <h2
          style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
          className="font-bebas uppercase text-[15vw] sm:text-[10vw] lg:text-[6.5vw] leading-[0.92] tracking-[-0.035em]"
        >
          Design-first
          <br />
          Digital Agency
        </h2>

        <p className="font-poppins uppercase text-base sm:text-lg lg:text-[1.3vw] leading-[1.45] tracking-[0.01em] max-w-[28em] lg:max-w-[24em]">
          A multi-awarded digital studio crafting immersive &amp; interactive experiences for global
          brands since 2006.
        </p>
      </div>

      {/* Socials (left) + client stat (right), lower on the hero beside the neck/shoulder */}
      <div className="absolute inset-x-0 bottom-[6%] sm:bottom-auto sm:top-[84%] px-6 sm:px-10 lg:px-[5.2vw] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-4 lg:gap-[1vw] font-poppins font-medium text-lg lg:text-[1.4vw]">
          <span>Follow us</span>
          <span aria-hidden className="w-12 lg:w-[2.8vw] h-px bg-white/80" />
          <SocialLinks iconClassName="w-6 h-6 lg:w-[1.4vw] lg:h-[1.4vw]" />
        </div>

        <div className="flex items-center gap-5 lg:gap-[1.8vw]">
          <PixelMark className="w-14 h-14 lg:w-[3.6vw] lg:h-[3.6vw] shrink-0" />
          <div>
            {/* TODO: confirm this figure before launch */}
            <p
              style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}
              className="font-bebas text-5xl lg:text-[3.1vw] leading-none tracking-[-0.01em]"
            >
              $200M+
            </p>
            <p className="font-poppins uppercase text-sm lg:text-[1.1vw] mt-2 lg:mt-[0.5vw]">
              Raised by clients
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
