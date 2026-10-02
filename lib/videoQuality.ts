import { useSyncExternalStore } from "react";

// Which version of the Works videos to play. Each video has two files on R2: the full-quality
// one (work1.mp4) and a light ~10 MB one (work1-lite.mp4). Phones, tablets, slow or data-saver
// connections and low-end PCs start on the light one; fast desktops get full quality, and drop
// to light for good if a playing video starts dropping frames (see Works.tsx).
export type VideoQuality = "hq" | "lite";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

function initialQuality(): VideoQuality {
  const nav = navigator as Navigator & { connection?: NetworkInfo; deviceMemory?: number };
  const net = nav.connection;
  if (net?.saveData) return "lite";
  if (net?.effectiveType && net.effectiveType !== "4g") return "lite";
  if (Math.min(screen.width, screen.height) < 768 || window.innerWidth < 1024) return "lite";
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return "lite";
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) return "lite";
  return "hq";
}

let quality: VideoQuality | null = null;
const listeners = new Set<() => void>();

function get() {
  if (quality === null) quality = initialQuality();
  return quality;
}

/** Switch every Works video to the light version (once a full-quality one stutters). */
export function switchToLiteVideos() {
  if (get() === "lite") return;
  quality = "lite";
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The quality to play; null in the static HTML, so no video starts loading before the pick. */
export function useVideoQuality(): VideoQuality | null {
  return useSyncExternalStore(subscribe, get, () => null);
}
