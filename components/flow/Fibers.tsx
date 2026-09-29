"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fiberFragment, fiberVertex } from "./fiberShader";
import { mulberry32 } from "./random";
import { STAGES, type FlowState } from "./stages";

const STRANDS = 650;
const POINTS = 96;
const BURST = STAGES.findIndex((s) => s.shape === 5);

function buildBuffers() {
  const count = STRANDS * POINTS;
  const t = new Float32Array(count);
  const seed = new Float32Array(count * 3);
  const index = new Uint32Array(STRANDS * (POINTS - 1) * 2);
  const rand = mulberry32(7);

  let k = 0;
  for (let s = 0; s < STRANDS; s++) {
    const sx = rand();
    const sy = rand();
    const sz = rand();
    for (let j = 0; j < POINTS; j++) {
      const v = s * POINTS + j;
      t[v] = j / (POINTS - 1);
      seed.set([sx, sy, sz], v * 3);
      if (j < POINTS - 1) {
        index[k++] = v;
        index[k++] = v + 1;
      }
    }
  }
  // Real positions come from the vertex shader; this only sizes the draw call.
  return { position: new Float32Array(count * 3), t, seed, index };
}

export default function Fibers({ flowRef }: { flowRef: RefObject<FlowState> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const buffers = useMemo(() => buildBuffers(), []);
  const params = useMemo(
    () => ({
      vertexShader: fiberVertex,
      fragmentShader: fiberFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uFrom: { value: 0 },
        uTo: { value: 1 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uGrow: { value: 0 },
        uBurst: { value: 0 },
        uCool: { value: 0 },
        uIntensity: { value: 0.55 },
        uBlue: { value: new THREE.Color("#2f6bff") },
        uViolet: { value: new THREE.Color("#8b5cf6") },
        uPink: { value: new THREE.Color("#ff5fd2") },
        uCyan: { value: new THREE.Color("#4fd8ff") },
      },
    }),
    []
  );

  useFrame(() => {
    if (!material.current) return;
    const f = flowRef.current;
    const u = material.current.uniforms;
    u.uFrom.value = STAGES[f.from].shape;
    u.uTo.value = STAGES[f.to].shape;
    u.uMix.value = f.mix;
    u.uTime.value = f.time;
    u.uGrow.value = f.grow;
    u.uBurst.value = f.weights[BURST];
    u.uCool.value = f.weights[BURST] * 0.8;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
        <bufferAttribute attach="attributes-aT" args={[buffers.t, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[buffers.seed, 3]} />
        <bufferAttribute attach="index" args={[buffers.index, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} args={[params]} />
    </lineSegments>
  );
}
