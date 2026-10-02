import Image from "next/image";

/** Section photo filling its card, in its normal colours (slightly dimmed, full on hover). */
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
