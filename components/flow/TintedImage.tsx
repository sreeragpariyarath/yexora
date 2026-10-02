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
        className="object-cover  contrast-110 opacity-80 transition-[opacity,scale] duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
      />
    </div>
  );
}
