// Whether a Works video is on screen and playing (set by Works.tsx). While one is, the 3D
// canvas only redraws when the page scrolls: behind the videos only a few faint specks are
// left, and redrawing the bloom/glass passes every frame competed with decoding a
// high-quality video, which made it stutter.
export const media = { videoActive: false };
