"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fanDotFragment, fanDotVertex, fanLineFragment, fanLineVertex } from "./fanShader";
import { mulberry32 } from "./random";
import type { FanConfig, FlowState } from "./timeline";

const POINTS = 80;

export interface FanDrive {
  load: number;
  grow: number;
  wall: number;
  alpha: number;
}

interface FanProps {
  config: FanConfig;
  flowRef: RefObject<FlowState>;
  /** Picks this fan's animated values out of the shared flow state */
  drive: (f: FlowState) => FanDrive;
}

function buildBuffers({ strands, seed: seedValue }: FanConfig) {
  const rand = mulberry32(seedValue);
  const count = strands * POINTS;
  const t = new Float32Array(count);
  const seed = new Float32Array(count * 3);
  const index = new Uint32Array(strands * (POINTS - 1) * 2);
  // Dots: one per strand end + the node
  const dotSeed = new Float32Array((strands + 1) * 3);
  const dotKind = new Float32Array(strands + 1);

  let k = 0;
  for (let s = 0; s < strands; s++) {
    const sx = rand();
    const sy = rand();
    const sz = rand();
    dotSeed.set([sx, sy, sz], s * 3);
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
  dotKind[strands] = 1;

  // Real positions come from the vertex shaders; these only size the draw calls.
  return {
    position: new Float32Array(count * 3),
    t,
    seed,
    index,
    dotPosition: new Float32Array((strands + 1) * 3),
    dotSeed,
    dotKind,
  };
}

function sharedUniforms(config: FanConfig) {
  return {
    uStart: { value: new THREE.Vector3(...config.start) },
    uNode: { value: new THREE.Vector3(...config.node) },
    uEndX: { value: config.wallX },
    uFree: { value: config.free },
    uSpread: { value: config.spread },
    uDepth: { value: config.depth },
    uBend: { value: config.bend },
    uTrunk: { value: config.trunk },
    uLoad: { value: 1 },
    uGrow: { value: 1 },
    uWall: { value: 0 },
    uAlpha: { value: 1 },
    uTime: { value: 0 },
    uLilac: { value: new THREE.Color("#d9ccff") },
  };
}

/** One fan of fibres in the chain, with its wall of glowing end dots. */
export default function Fan({ config, flowRef, drive }: FanProps) {
  const lineMaterial = useRef<THREE.ShaderMaterial>(null);
  const dotMaterial = useRef<THREE.ShaderMaterial>(null);
  const buffers = useMemo(() => buildBuffers(config), [config]);

  const lineParams = useMemo(
    () => ({
      vertexShader: fanLineVertex,
      fragmentShader: fanLineFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        ...sharedUniforms(config),
        uBlue: { value: new THREE.Color("#3d6bff") },
        uViolet: { value: new THREE.Color("#8f6bff") },
      },
    }),
    [config]
  );

  const dotParams = useMemo(
    () => ({
      vertexShader: fanDotVertex,
      fragmentShader: fanDotFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...sharedUniforms(config), uPixelRatio: { value: 1 } },
    }),
    [config]
  );

  useFrame((state) => {
    const f = flowRef.current;
    const d = drive(f);
    for (const m of [lineMaterial.current, dotMaterial.current]) {
      if (!m) continue;
      const u = m.uniforms;
      u.uLoad.value = d.load;
      u.uGrow.value = d.grow;
      u.uWall.value = d.wall;
      u.uAlpha.value = d.alpha;
      u.uTime.value = f.time;
    }
    if (dotMaterial.current) dotMaterial.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <group>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
          <bufferAttribute attach="attributes-aT" args={[buffers.t, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[buffers.seed, 3]} />
          <bufferAttribute attach="index" args={[buffers.index, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={lineMaterial} args={[lineParams]} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.dotPosition, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[buffers.dotSeed, 3]} />
          <bufferAttribute attach="attributes-aKind" args={[buffers.dotKind, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={dotMaterial} args={[dotParams]} />
      </points>
    </group>
  );
}
