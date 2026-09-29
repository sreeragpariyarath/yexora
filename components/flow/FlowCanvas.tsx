"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Fibers from "./Fibers";
import Particles from "./Particles";
import Tubes from "./Tubes";
import { STAGES, createFlowState, stageAt, type FlowState } from "./stages";
import useReducedMotion from "./useReducedMotion";

interface FlowCanvasProps {
  /** Raw scroll progress (0–1), written by ScrollFlow */
  progressRef: RefObject<number>;
  /** Render only while the section is on screen */
  active: boolean;
  /** Element whose pointer movement drives the parallax (covers the copy overlay too) */
  eventSourceRef: RefObject<HTMLElement | null>;
}

const INTRO_SECONDS = 2.4;

/** Turns scroll progress into the shared per-frame FlowState. Runs before everything else. */
function Driver({
  progressRef,
  flowRef,
  reduced,
}: {
  progressRef: RefObject<number>;
  flowRef: RefObject<FlowState>;
  reduced: boolean;
}) {
  const start = useRef<number | null>(null);

  useFrame((state, dt) => {
    const f = flowRef.current;
    const time = state.clock.elapsedTime;
    f.p = THREE.MathUtils.damp(f.p, progressRef.current, 5, Math.min(dt, 0.1));

    const s = stageAt(f.p);
    f.from = s.from;
    f.to = s.to;
    f.mix = s.mix;
    for (let i = 0; i < f.weights.length; i++) {
      f.weights[i] = s.from === s.to ? (i === s.from ? 1 : 0) : i === s.from ? 1 - s.mix : i === s.to ? s.mix : 0;
    }

    // Fibres draw in from the left the first time the section is rendered
    start.current ??= time;
    const g = reduced ? 1 : Math.min((time - start.current) / INTRO_SECONDS, 1);
    f.grow = 1 - Math.pow(1 - g, 3);
    f.time = time;
  }, -1);

  return null;
}

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();
const _to = new THREE.Vector3();

/** Eases the camera between stage keyframes, plus a small pointer parallax. */
function CameraRig({ flowRef, reduced }: { flowRef: RefObject<FlowState>; reduced: boolean }) {
  const look = useRef(new THREE.Vector3());
  const parallax = useRef(new THREE.Vector2());

  useFrame((state, dt) => {
    const f = flowRef.current;
    const a = STAGES[f.from].camera;
    const b = STAGES[f.to].camera;
    _pos.fromArray(a.pos).lerp(_to.fromArray(b.pos), f.mix);
    _target.fromArray(a.target).lerp(_to.fromArray(b.target), f.mix);

    // Pull back on narrow screens so the shapes still fit
    const aspect = state.size.width / state.size.height;
    const pull = aspect < 1 ? 1.8 : aspect < 1.4 ? 1.3 : 1;
    _pos.sub(_target).multiplyScalar(pull).add(_target);

    const step = Math.min(dt, 0.1);
    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, reduced ? 0 : state.pointer.x * 0.6, 3, step);
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, reduced ? 0 : state.pointer.y * 0.4, 3, step);
    _pos.x += parallax.current.x;
    _pos.y += parallax.current.y;

    state.camera.position.copy(_pos);
    look.current.copy(_target);
    state.camera.lookAt(look.current);
  });

  return null;
}

function Fallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(139,92,246,0.35),transparent_60%),radial-gradient(ellipse_at_70%_60%,rgba(47,107,255,0.3),transparent_55%)]" />
  );
}

export default function FlowCanvas({ progressRef, active, eventSourceRef }: FlowCanvasProps) {
  const flowRef = useRef<FlowState>(createFlowState());
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 45, position: [0, 0, 12], near: 0.1, far: 100 }}
      frameloop={active ? "always" : "never"}
      eventSource={eventSourceRef as RefObject<HTMLElement>}
      eventPrefix="client"
      fallback={<Fallback />}
    >
      <color attach="background" args={["#050713"]} />
      <Driver progressRef={progressRef} flowRef={flowRef} reduced={reduced} />
      <CameraRig flowRef={flowRef} reduced={reduced} />
      <Particles flowRef={flowRef} />
      <Fibers flowRef={flowRef} />
      <Tubes flowRef={flowRef} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.05} luminanceSmoothing={0.3} intensity={1.1} radius={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
