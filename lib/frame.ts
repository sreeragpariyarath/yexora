// One shared animation clock. SmoothScroll's loop moves the page (Lenis) first, then
// runs these subscribers in the same frame — so the 3D canvas and its glass lens always
// render against the scroll position the DOM is about to paint, never one frame behind.
//
// Subscribers run in phases: every "read" (layout measurements), then every "write"
// (style changes), then "render" (the WebGL canvas). Reading a rect after a style write
// forces the browser to recalculate layout mid-frame; batching reads first means the
// layout is still clean when they run, so they cost next to nothing.
type FrameCallback = (time: number) => void;
export type FramePhase = "read" | "write" | "render";

const phases: Record<FramePhase, Set<FrameCallback>> = {
  read: new Set(),
  write: new Set(),
  render: new Set(),
};

export function onFrame(callback: FrameCallback, phase: FramePhase = "write") {
  phases[phase].add(callback);
  return () => {
    phases[phase].delete(callback);
  };
}

export function runFrame(time: number) {
  phases.read.forEach((callback) => callback(time));
  phases.write.forEach((callback) => callback(time));
  phases.render.forEach((callback) => callback(time));
}
