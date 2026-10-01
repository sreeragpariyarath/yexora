"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

interface ServiceSelectProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
}

/**
 * Multi-select dropdown in the site's style (a native <select> clashes with it).
 * It's a select-only combobox: focus stays on the trigger and the highlighted option is
 * exposed through aria-activedescendant. Picks are mirrored into hidden inputs named
 * `name`, so the surrounding <form> reads them with FormData.getAll(name).
 */
export default function ServiceSelect({ name, label, options, placeholder = "Choose one or more" }: ServiceSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const labelId = `${uid}-label`;
  const valueId = `${uid}-value`;
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  // Keep picks in the options' order, whatever order they were clicked in
  const chosen = options.filter((o) => selected.includes(o));
  const summary = chosen.length > 1 ? `${chosen[0]} +${chosen.length - 1} more` : chosen[0];

  // Close on a press outside. (Blur alone isn't enough: Safari doesn't focus buttons on click.)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(chosen[0] ?? options[0])));
    setOpen(true);
  };

  const toggle = (value: string) =>
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (open) setActive((i) => Math.min(i + 1, options.length - 1));
        else openList();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setActive((i) => Math.max(i - 1, 0));
        else openList();
        break;
      case "Home":
      case "End":
        if (!open) break;
        e.preventDefault();
        setActive(e.key === "Home" ? 0 : options.length - 1);
        break;
      case "Enter":
      case " ":
        // Handled here (not via click) so Space/Enter toggle the highlighted option when open
        e.preventDefault();
        if (open) toggle(options[active]);
        else openList();
        break;
      case "Escape":
        if (!open) break;
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const onTriggerClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) return; // a keyboard-generated click: onKeyDown already handled it
    if (open) setOpen(false);
    else openList();
  };

  return (
    <div ref={rootRef} className="relative">
      {chosen.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        onClick={onTriggerClick}
        onKeyDown={onKeyDown}
        className={`relative w-full text-left rounded-2xl border px-4 pt-6 pb-2.5 pr-11 font-poppins text-sm outline-none cursor-pointer transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/25 focus-visible:border-accent/70 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_0_4px_rgba(47,107,255,0.18)] ${
          open
            ? "border-accent/70 bg-white/[0.06] shadow-[0_0_0_4px_rgba(47,107,255,0.18)]"
            : "border-white/12 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
        }`}
      >
        <span
          id={labelId}
          className={`pointer-events-none absolute left-4 top-2 text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 ${
            open ? "text-blue-300" : "text-white/50"
          }`}
        >
          {label}
        </span>
        <span id={valueId} className={`block truncate ${summary ? "text-white" : "text-white/40"}`}>
          {summary ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute right-4 top-1/2 w-4 h-4 -translate-y-1/2 text-white/50 transition-[rotate,color] duration-300 ${
            open ? "rotate-180 text-blue-300" : ""
          }`}
        />
      </button>

      {/* Mouse-down is cancelled so clicking an option never pulls focus off the trigger */}
      <ul
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        aria-labelledby={labelId}
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-2xl border border-white/12 bg-[#0b0e1d]/95 p-1.5 backdrop-blur-xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_44px_-10px_rgba(47,107,255,0.4)] transition-[opacity,translate,scale,visibility] duration-200 ease-out ${
          open ? "visible opacity-100 translate-y-0 scale-100" : "invisible opacity-0 -translate-y-1.5 scale-[0.98]"
        }`}
      >
        {options.map((option, i) => {
          const isSelected = selected.includes(option);
          return (
            <li
              key={option}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onClick={() => toggle(option)}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-poppins text-sm cursor-pointer select-none transition-colors ${
                i === active ? "bg-white/[0.07]" : ""
              } ${isSelected ? "text-white" : "text-white/70"}`}
            >
              <span
                aria-hidden
                className={`w-[18px] h-[18px] shrink-0 rounded-md border flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-200 ${
                  isSelected
                    ? "border-transparent bg-linear-to-br from-blue-400 to-accent shadow-[0_0_12px_rgba(47,107,255,0.6)]"
                    : "border-white/25"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
