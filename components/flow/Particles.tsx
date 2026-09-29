"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./random";
import type { FlowState } from "./timeline";

const COUNT = 500;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  attribute vec3 aRand;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.x += cos(uTime * 0.15 + aRand.x * 20.0) * 0.5;
    p.y += sin(uTime * 0.2 + aRand.y * 20.0) * 0.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // A few large, faint "bokeh" blobs among many small specks
    float big = step(0.96, aRand.z);
    gl_PointSize = mix(3.0 + aRand.z * 5.0, 90.0, big) * uPixelRatio * (10.0 / -mv.z);
    vAlpha = uOpacity * mix(0.35 + 0.65 * aRand.y, 0.12, big);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
  }
`;

function buildBuffers() {
  const rand = mulberry32(21);
  const position = new Float32Array(COUNT * 3);
  const random = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    position.set([(rand() - 0.5) * 26, (rand() - 0.5) * 15, -7 + rand() * 10], i * 3);
    random.set([rand(), rand(), rand()], i * 3);
  }
  return { position, random };
}

export default function Particles({ flowRef }: { flowRef: RefObject<FlowState> }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const buffers = useMemo(() => buildBuffers(), []);
  const params = useMemo(
    () => ({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color("#a58bff") },
      },
    }),
    []
  );

  useFrame((state) => {
    const f = flowRef.current;
    // Specks travel with the camera so every section has some
    if (points.current) points.current.position.x = f.camX;
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value = f.time;
    u.uPixelRatio.value = state.viewport.dpr;
    // Fade in after the hero fan has loaded, as in the reference
    u.uOpacity.value = f.specks * Math.max(0, (f.load - 0.6) / 0.4);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[buffers.random, 3]} />
      </bufferGeometry>
      <shaderMaterial ref={material} args={[params]} />
    </points>
  );
}
