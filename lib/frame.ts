// One shared animation clock. SmoothScroll's loop moves the page (Lenis) first, then
// runs these subscribers in the same frame — so the 3D canvas and its glass lens always
// render against the scroll position the DOM is about to paint, never one frame behind.
type FrameCallback = (time: number) => void;

const subscribers = new Set<FrameCallback>();

export function onFrame(callback: FrameCallback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function runFrame(time: number) {
  subscribers.forEach((callback) => callback(time));
}
