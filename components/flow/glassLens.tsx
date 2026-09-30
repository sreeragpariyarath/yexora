"use client";

// Liquid glass, rendered the way Apple does it: on the GPU, in the same frame as the
// content behind it. The copy panels sit over our own WebGL canvas, so instead of a
// CSS/SVG backdrop filter (Chromium-only for refraction, and slow over a moving scene)
// this is one post-processing pass that, inside each panel's rounded rectangle:
//   • refracts the scene along a curved bezel (strongest at the rim, none in the middle)
//   • splits colour slightly at the rim (chromatic fringe)
//   • softens the middle so thin fibres don't fight the text (and don't look tilted)
//   • adds a milky tint, a rim hairline and a pointer-reactive specular glint
// Pixels outside every panel return untouched, so the cost is tiny. It works wherever
// the scene works (plain WebGL2); without WebGL the CSS `.liquid-glass` fallback shows.

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectGroup, createEffectComponent } from "@react-three/postprocessing";
import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import * as THREE from "three";
import { useMediaQuery } from "./useReducedMotion";

const MAX_PANELS = 4;

const fragmentShader = /* glsl */ `
  uniform vec4 uRect[${MAX_PANELS}];     // x, y, w, h in CSS px (top-left origin)
  uniform float uRadius[${MAX_PANELS}];
  uniform float uStrength[${MAX_PANELS}];
  uniform int uCount;
  uniform vec2 uViewport;                // canvas size in CSS px
  uniform vec2 uLight;                   // specular light direction (screen space, y up)
  uniform float uRefract;                // max rim displacement, px
  uniform float uFrost;                  // blur radius in the middle, px

  float sdRoundRect(vec2 p, vec2 halfSize, float r) {
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  vec3 scene(vec2 uv) {
    return texture2D(inputBuffer, clamp(uv, vec2(0.001), vec2(0.999))).rgb;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
    // Work in CSS pixels, y down, matching getBoundingClientRect
    vec2 px = vec2(uv.x, 1.0 - uv.y) * uViewport;
    vec2 pxToUv = 1.0 / uViewport;

    for (int i = 0; i < ${MAX_PANELS}; i++) {
      if (i >= uCount) break;
      float s = uStrength[i];
      vec4 rect = uRect[i];
      vec2 halfSize = rect.zw * 0.5;
      vec2 p = px - (rect.xy + halfSize);
      // Cheap reject: outside this panel's box
      if (s < 0.001 || abs(p.x) > halfSize.x + 1.0 || abs(p.y) > halfSize.y + 1.0) continue;

      float r = min(uRadius[i], min(halfSize.x, halfSize.y));
      float d = sdRoundRect(p, halfSize, r);
      float a = smoothstep(0.75, -0.75, d) * s;
      if (a <= 0.0) continue;

      float depth = max(-d, 0.0);
      float bezel = min(36.0, min(halfSize.x, halfSize.y) * 0.35);
      float t = clamp(1.0 - depth / bezel, 0.0, 1.0);        // 1 at the rim → 0 inside

      // Outward surface normal from the SDF gradient
      vec2 e = vec2(1.0, 0.0);
      vec2 n = vec2(
        sdRoundRect(p + e.xy, halfSize, r) - sdRoundRect(p - e.xy, halfSize, r),
        sdRoundRect(p + e.yx, halfSize, r) - sdRoundRect(p - e.yx, halfSize, r)
      );
      n = n / max(length(n), 1e-4);

      // Circular bezel profile: flat in the middle, bending hard towards the edge. Sampling
      // outward pulls what's beyond the rim into it, like looking through a thick glass edge.
      float bend = 1.0 - sqrt(max(1.0 - t * t, 0.0));
      vec2 offPx = n * uRefract * bend * s;
      vec2 offUv = vec2(offPx.x, -offPx.y) * pxToUv;

      // Frost: crisp at the rim, soft in the middle (16-tap golden-angle disc)
      float frost = mix(1.0, uFrost, smoothstep(0.0, 2.0 * bezel, depth));
      vec3 col = vec3(0.0);
      for (int k = 0; k < 16; k++) {
        float fk = float(k) + 0.5;
        float rr = sqrt(fk / 16.0) * frost;
        float th = fk * 2.39996;
        col += scene(uv + offUv + vec2(cos(th), sin(th)) * rr * pxToUv);
      }
      col /= 16.0;

      // Chromatic fringe on the bezel
      if (t > 0.0) {
        col.r = mix(col.r, scene(uv + offUv * 0.93).r, t * 0.85);
        col.b = mix(col.b, scene(uv + offUv * 1.07).b, t * 0.85);
      }

      // Glass body: a little more saturated, a slight milky lift, faint blue so empty areas
      // still read as glass. Values are small because this runs in linear colour (a 1%
      // linear lift already shows as a clear sheen once encoded for the screen).
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, 1.25);
      col = mix(col, vec3(1.0), 0.01) * 1.05 + vec3(0.0015, 0.0035, 0.008);

      // Light: a hairline at the rim and a glint on the bezel facing the light
      float rim = smoothstep(2.0, 0.0, depth);
      float glint = pow(max(dot(n * vec2(1.0, -1.0), uLight), 0.0), 10.0) * t * t;
      col += vec3(rim * 0.14 + glint * 0.16);

      outputColor = vec4(mix(outputColor.rgb, col, a), inputColor.a);
    }
  }
`;

export class GlassLensEffect extends Effect {
  constructor() {
    super("GlassLensEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      // Samples the input at displaced coordinates, so it needs its own pass
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, THREE.Uniform>([
        ["uRect", new THREE.Uniform(Array.from({ length: MAX_PANELS }, () => new THREE.Vector4()))],
        ["uRadius", new THREE.Uniform(new Array<number>(MAX_PANELS).fill(0))],
        ["uStrength", new THREE.Uniform(new Array<number>(MAX_PANELS).fill(0))],
        ["uCount", new THREE.Uniform(0)],
        ["uViewport", new THREE.Uniform(new THREE.Vector2(1, 1))],
        ["uLight", new THREE.Uniform(new THREE.Vector2(-0.45, 0.9).normalize())],
        ["uRefract", new THREE.Uniform(52)],
        ["uFrost", new THREE.Uniform(11)],
      ]),
    });
  }
}

const GlassLens = createEffectComponent(GlassLensEffect);

function radiusOf(el: HTMLElement) {
  return parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
}

/**
 * Finds the `[data-glass]` panels (see CopyBlock), feeds their on-screen rectangles to
 * the lens every frame, and fades each lens with its panel (`data-glass-shown`).
 * Must be rendered inside <EffectComposer>, after <Bloom>, so it refracts the glow too.
 */
export default function LiquidGlass() {
  const lensRef = useRef<GlassLensEffect>(null);
  const panels = useRef<{ el: HTMLElement; radius: number }[]>([]);
  // Per-panel lens fade (0–1), by panel index; only touched in the frame loop
  const fades = useRef<number[]>([]);
  const pointer = useRef(new THREE.Vector2());
  const light = useRef(new THREE.Vector2(-0.45, 0.9).normalize());
  const reducedTransparency = useMediaQuery("(prefers-reduced-transparency: reduce)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    // The CSS drops its own backdrop blur while the GPU lens is doing the work
    if (reducedTransparency) return;
    const root = document.documentElement;
    root.classList.add("webgl-glass");
    return () => root.classList.remove("webgl-glass");
  }, [reducedTransparency]);

  useEffect(() => {
    const refresh = () => {
      panels.current = Array.from(document.querySelectorAll<HTMLElement>("[data-glass]"), (el) => ({
        el,
        radius: radiusOf(el),
      }));
    };
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useFrame((state, dt) => {
    const lens = lensRef.current;
    if (!lens) return;
    const u = lens.uniforms;
    const { width, height } = state.size;
    (u.get("uViewport")!.value as THREE.Vector2).set(width, height);

    const step = Math.min(dt, 0.1);
    const rects = u.get("uRect")!.value as THREE.Vector4[];
    const radii = u.get("uRadius")!.value as number[];
    const strengths = u.get("uStrength")!.value as number[];

    const fade = fades.current;
    let count = 0;
    panels.current.forEach((panel, i) => {
      const target = !reducedTransparency && panel.el.dataset.glassShown === "1" ? 1 : 0;
      fade[i] = THREE.MathUtils.damp(fade[i] ?? 0, target, 4, step);
      if (count >= MAX_PANELS || fade[i] < 0.002) return;
      const r = panel.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > height || r.right < 0 || r.left > width) return;
      rects[count].set(r.left, r.top, r.width, r.height);
      radii[count] = panel.radius;
      strengths[count] = fade[i];
      count++;
    });
    u.get("uCount")!.value = count;

    // Specular glint follows the pointer a little, like Apple's motion-reactive highlights
    const lx = reducedMotion ? -0.45 : -0.45 + pointer.current.x * 0.5;
    const ly = reducedMotion ? 0.9 : 0.9 + pointer.current.y * 0.3;
    light.current.x = THREE.MathUtils.damp(light.current.x, lx, 3, step);
    light.current.y = THREE.MathUtils.damp(light.current.y, ly, 3, step);
    (u.get("uLight")!.value as THREE.Vector2).copy(light.current).normalize();
  });

  return (
    <EffectGroup>
      <GlassLens ref={lensRef} />
    </EffectGroup>
  );
}
