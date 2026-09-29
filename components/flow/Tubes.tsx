"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { STAGES, type FlowState } from "./stages";

const TUBES = 4;
const SEGMENTS = 420;
const STAGE = STAGES.findIndex((s) => s.shape === 4);

// A drifting line with a looping wobble: x doubles back on itself where the
// z/y oscillation is fast enough, which is what draws the curls.
function tubeCurve(k: number) {
  const pts: THREE.Vector3[] = [];
  const phase = k * 1.7;
  for (let i = 0; i <= 60; i++) {
    const s = i / 60;
    const a = s * Math.PI * 2 * (1.3 + k * 0.15) + phase;
    pts.push(
      new THREE.Vector3(
        -13 + s * 26 + Math.sin(a) * 3.4,
        Math.sin(s * Math.PI * 2 * 0.9 + phase * 1.3) * 2.6 + (k - 1.5) * 0.9,
        Math.cos(a) * 3.2 - 1.5
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts);
}

export default function Tubes({ flowRef }: { flowRef: RefObject<FlowState> }) {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(() => Array.from({ length: TUBES }, (_, k) => tubeCurve(k)), []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const f = flowRef.current;
    const entering = f.to === STAGE && f.from !== STAGE;
    const leaving = f.from === STAGE && f.to !== STAGE;
    // Tubes draw themselves in on the way to this stage and fade out on the way to the next
    const draw = entering ? f.mix : f.from === STAGE ? 1 : 0;
    const opacity = leaving ? 1 - f.mix : draw > 0 ? 1 : 0;

    g.visible = draw > 0.001 && opacity > 0.001;
    if (!g.visible) return;
    g.rotation.x = -0.25 + f.p * 0.6;
    g.rotation.y += dt * 0.05;
    for (const child of g.children) {
      const mesh = child as THREE.Mesh<THREE.TubeGeometry, THREE.MeshPhysicalMaterial>;
      mesh.material.opacity = opacity;
      const total = mesh.geometry.index?.count ?? 0;
      mesh.geometry.setDrawRange(0, Math.floor((total * draw) / 6) * 6);
    }
  });

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#2f6bff" position={[-6, 2, -4]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={3} color="#ff5fd2" position={[6, -2, -4]} scale={[12, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 6, 2]} scale={4} />
      </Environment>
      <group ref={group} visible={false}>
        {curves.map((curve, k) => (
          <mesh key={k} frustumCulled={false}>
            <tubeGeometry args={[curve, SEGMENTS, k === 0 ? 0.16 : 0.1, 20]} />
            <meshPhysicalMaterial
              color="#c4b5ff"
              emissive="#4c2fd6"
              emissiveIntensity={0.35}
              roughness={0.18}
              metalness={0.25}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.6}
              transparent
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
