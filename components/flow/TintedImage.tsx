import Image from "next/image";

/**
 * Photo tinted into the site's blue palette (desaturated + an accent wash), so stock
 * placeholders and project shots sit on the dark fibre scene instead of fighting it.
 */
export default function TintedImage({
  src,
  sizes,
  className = "",
}: {
  src: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover grayscale contrast-110 opacity-80 transition-[opacity,scale] duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
      />
      {/* Blue wash + a dark fade at the bottom so text on top stays readable */}
      <div aria-hidden className="absolute inset-0 bg-accent/25 mix-blend-color" />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#050713]/55 via-transparent to-transparent"
      />
    </div>
  );
}
