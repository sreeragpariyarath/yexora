"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";
import Fan, { type FanDrive } from "./Fan";
import Fibers from "./Fibers";
import LiquidGlass from "./glassLens";
import Particles from "./Particles";
import { FAN_A, FAN_B, chapterAt, createFlowState, evaluate, type FlowState } from "./timeline";
import useReducedMotion from "./useReducedMotion";

export interface SectionLayout {
  /** Document top of each [data-chapter] section, in order */
  tops: number[];
  maxScroll: number;
}

interface FlowCanvasProps {
  layoutRef: RefObject<SectionLayout>;
}

// Hero intro: the fan grows in from the left as soon as the scene is up. Ease-out, so it
// is visible from the first frames instead of creeping in (no artificial delay)
const LOAD_SECONDS = 2.2;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Reads the scroll position every frame and evaluates the timeline into the shared
 * FlowState. Lenis already eases window.scrollY each frame, so it is used as-is:
 * damping it again here is what made the first version feel laggy.
 */
function Driver({
  layoutRef,
  flowRef,
  reduced,
}: {
  layoutRef: RefObject<SectionLayout>;
  flowRef: RefObject<FlowState>;
  reduced: boolean;
}) {
  const introTime = useRef(0);

  useFrame((state, dt) => {
    const f = flowRef.current;
    const { tops, maxScroll } = layoutRef.current;
    evaluate(f, chapterAt(window.scrollY, tops, maxScroll));

    // Advance the intro by capped frame time, so a slow first frame (shader
    // compile) pauses the grow instead of skipping straight to the end
    introTime.current += Math.min(dt, 1 / 20);
    const g = reduced ? 1 : Math.min(introTime.current / LOAD_SECONDS, 1);
    f.load = easeOutCubic(g);
    f.time = state.clock.elapsedTime;
  }, -1);

  return null;
}

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();

/** Pans the camera along the chain, plus a small pointer parallax. */
function CameraRig({ flowRef, reduced }: { flowRef: RefObject<FlowState>; reduced: boolean }) {
  const pointer = useRef(new THREE.Vector2());
  const parallax = useRef(new THREE.Vector2());

  useEffect(() => {
    // The page content sits above the canvas, so listen on the window
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const f = flowRef.current;
    _target.set(f.camX, 0, 0);
    _pos.set(f.camX, 0, f.camZ);

    // Pull back on narrow screens so the shapes still fit
    const aspect = state.size.width / state.size.height;
    const pull = aspect < 1 ? 1.8 : aspect < 1.4 ? 1.3 : 1;
    _pos.sub(_target).multiplyScalar(pull).add(_target);

    const step = Math.min(dt, 0.1);
    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, reduced ? 0 : pointer.current.x * 0.5, 3, step);
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, reduced ? 0 : pointer.current.y * 0.3, 3, step);
    _pos.x += parallax.current.x;
    _pos.y += parallax.current.y;

    state.camera.position.copy(_pos);
    state.camera.lookAt(_target);
  });

  return null;
}

const driveFanA = (f: FlowState): FanDrive => ({ load: f.load, grow: 1, wall: f.fanAWall, alpha: f.fanAAlpha });
const driveFanB = (f: FlowState): FanDrive => ({ load: 1, grow: f.fanBGrow, wall: f.fanBWall, alpha: f.fanBAlpha });

function Fallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(47,107,255,0.35),transparent_60%),radial-gradient(ellipse_at_70%_60%,rgba(47,107,255,0.25),transparent_55%)]" />
  );
}

export default function FlowCanvas({ layoutRef }: FlowCanvasProps) {
  const flowRef = useRef<FlowState>(createFlowState());
  const reduced = useReducedMotion();
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 45, position: [0, 0, 12], near: 0.1, far: 120 }}
      fallback={<Fallback />}
    >
      {/* Drop resolution on slow devices instead of dropping frames */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <color attach="background" args={["#000000"]} />
      <Driver layoutRef={layoutRef} flowRef={flowRef} reduced={reduced} />
      <CameraRig flowRef={flowRef} reduced={reduced} />
      <Particles flowRef={flowRef} />
      <Fan config={FAN_A} flowRef={flowRef} drive={driveFanA} />
      <Fan config={FAN_B} flowRef={flowRef} drive={driveFanB} />
      <Fibers flowRef={flowRef} />
      {/* No MSAA (4x MSAA on the composer's float buffers hung even gaming GPUs); SMAA below
          smooths the 1px fibre lines in one cheap pass instead */}
      <EffectComposer multisampling={0}>
        <SMAA />
        <Bloom
          mipmapBlur
          // Only the bright fibre cores glow, and the glow stays close to them; a lower
          // threshold / wider radius fogs the empty navy background with a whitish haze
          luminanceThreshold={0.25}
          luminanceSmoothing={0.3}
          intensity={1}
          radius={0.45}
          resolutionScale={0.5}
        />
        {/* Liquid glass lens over the copy panels; after Bloom so it refracts the glow */}
        <LiquidGlass />
      </EffectComposer>
    </Canvas>
  );
}
