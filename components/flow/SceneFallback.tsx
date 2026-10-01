/** Static gradient shown instead of the 3D scene when WebGL is unavailable. */
export default function SceneFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(47,107,255,0.35),transparent_60%),radial-gradient(ellipse_at_70%_60%,rgba(47,107,255,0.25),transparent_55%)]" />
  );
}
