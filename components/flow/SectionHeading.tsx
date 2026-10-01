// Big lowercase section title with the two-dot mark (". ." + word), a small index label
// and a faint watermark, as used by Principles and Services.
export default function SectionHeading({
  index,
  label,
  watermark,
  title,
}: {
  index: string;
  label: string;
  watermark: string;
  title: string;
}) {
  return (
    <div className="relative">
      <p className="font-poppins text-[11px] lg:text-xs uppercase tracking-[0.2em] text-white/50">
        {index} <span className="mx-2 text-white/25">/</span> {label}
      </p>
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-0 -top-2 font-poppins font-semibold lowercase text-[12vw] lg:text-[7vw] leading-none tracking-[-0.04em] text-white/[0.035] whitespace-nowrap"
      >
        {watermark}
      </span>
      <h2 className="relative mt-4 flex items-end gap-[0.12em] font-poppins font-semibold lowercase leading-[0.9] tracking-[-0.055em] text-white text-[16vw] sm:text-[12vw] lg:text-[7.5vw]">
        <span aria-hidden className="mb-[0.1em] flex gap-[0.06em]">
          <span className="w-[0.14em] h-[0.14em] rounded-full bg-white" />
          <span className="w-[0.14em] h-[0.14em] rounded-full bg-white/45" />
        </span>
        {title}
      </h2>
    </div>
  );
}
