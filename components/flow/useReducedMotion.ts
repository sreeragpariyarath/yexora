import { useSyncExternalStore } from "react";

/** Live `matchMedia` result (false during SSR). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export default function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
