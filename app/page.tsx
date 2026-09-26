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
          className="font-bebas text-white uppercase text-center font-bold text-[14.8vw] leading-none tracking-normal whitespace-nowrap"
        >
          YEXORA IT SOLUTIONS
        </h1>
      </div>
    </main>
  );
}
