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
/**
 * The loader starts leaving (its logo fades) this long before the page is told it's revealed.
 * The reveal sets off a burst of work (re-renders, Lenis, the hero intro); starting the
 * loader's compositor fade first means that burst can't stall it.
 */
const REVEAL_DELAY_MS = 350;

const ready = new Set<ReadyKey>();
const listeners = new Set<() => void>();
const leaveListeners = new Set<() => void>();
let leaving = false;
let revealed = false;
let started = false;

function reveal() {
  if (revealed) return;
  revealed = true;
  listeners.forEach((listener) => listener());
}

function leave() {
  if (leaving) return;
  leaving = true;
  leaveListeners.forEach((listener) => listener());
  setTimeout(reveal, REVEAL_DELAY_MS);
}

function check() {
  if (leaving || !NEEDED.every((key) => ready.has(key))) return;
  const wait = MIN_MS - performance.now();
  if (wait > 0) setTimeout(leave, wait);
  else leave();
}

/** Starts the safety timeout. Called once by the Loader. */
export function startLoading() {
  if (started) return;
  started = true;
  setTimeout(leave, Math.max(MAX_MS - performance.now(), 0));
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

function subscribeLeaving(listener: () => void) {
  leaveListeners.add(listener);
  return () => {
    leaveListeners.delete(listener);
  };
}

/** True once loading is done and the loader has started to fade out (Loader only). */
export function useLeaving() {
  return useSyncExternalStore(subscribeLeaving, () => leaving, () => false);
}

/** True once the page is revealed, shortly after the loader starts fading (always false in the static HTML). */
export function useRevealed() {
  return useSyncExternalStore(subscribe, isRevealed, () => false);
}

// The loader logo's animation cycle (.loader-mark in globals.css): it turns for the first
// SPIN_MS of every CYCLE_MS, then rests
const CYCLE_MS = 2400;
const SPIN_MS = 1400;

/**
 * Calls `callback` at the start of the loader logo's next rest (right away if it's resting
 * now or there's no loader). The scene's first real frames are heavy enough to stall the
 * GPU process, which would freeze the spinning logo; during the rest nothing moves, so
 * that stall can't be seen.
 */
export function whenLoaderResting(callback: () => void) {
  const mark = document.querySelector(".loader-mark");
  const time = mark?.getAnimations()[0]?.currentTime;
  const t = typeof time === "number" ? time : null;
  if (leaving || t === null) {
    callback();
    return () => {};
  }
  const phase = t % CYCLE_MS;
  // Still early in the rest: go now. Otherwise wait for the next rest to begin.
  if (phase >= SPIN_MS && phase < SPIN_MS + 250) {
    callback();
    return () => {};
  }
  const timer = window.setTimeout(callback, (SPIN_MS - phase + CYCLE_MS) % CYCLE_MS);
  return () => window.clearTimeout(timer);
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
