import { useSyncExternalStore } from "react";

// The loading screen's state. The loader (components/Loader.tsx) stays up until the 3D
// scene has compiled its shaders and drawn its first frames, and the fonts are ready —
// so that work happens behind it instead of as a stutter on the first scroll. It always
// shows one full spin, and never stays longer than MAX_MS.
type ReadyKey = "scene" | "fonts";

const NEEDED: ReadyKey[] = ["scene", "fonts"];
/** One spin of the logo (see .loader-mark in globals.css), counted from navigation start */
const MIN_MS = 1400;
/** Reveal anyway after this, so a slow device or a stuck task can never trap the page */
const MAX_MS = 15000;

const ready = new Set<ReadyKey>();
const listeners = new Set<() => void>();
let revealed = false;
let started = false;

function reveal() {
  if (revealed) return;
  revealed = true;
  listeners.forEach((listener) => listener());
}

function check() {
  if (revealed || !NEEDED.every((key) => ready.has(key))) return;
  const wait = MIN_MS - performance.now();
  if (wait > 0) setTimeout(reveal, wait);
  else reveal();
}

/** Starts the safety timeout. Called once by the Loader. */
export function startLoading() {
  if (started) return;
  started = true;
  setTimeout(reveal, Math.max(MAX_MS - performance.now(), 0));
  check();
}

export function markReady(key: ReadyKey) {
  ready.add(key);
  check();
}

export function isRevealed() {
  return revealed;
}

/** Runs `callback` once the loader starts leaving (right away if it already has). */
export function onRevealed(callback: () => void) {
  if (revealed) {
    callback();
    return () => {};
  }
  const once = () => {
    listeners.delete(once);
    callback();
  };
  listeners.add(once);
  return () => {
    listeners.delete(once);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True once the loader has started to fade out (always false in the static HTML). */
export function useRevealed() {
  return useSyncExternalStore(subscribe, isRevealed, () => false);
}

/** requestIdleCallback with a timeout fallback (Safari has no requestIdleCallback). */
export function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") return window.requestIdleCallback(callback, { timeout: 3000 });
  return window.setTimeout(callback, 1500);
}

export function cancelIdle(handle: number) {
  if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
  else window.clearTimeout(handle);
}
