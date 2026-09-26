import Image from "next/image";
import heroImage from "@/public/hero-image.png";
import Header from "@/components/Header";

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
    </main>
  );
}
