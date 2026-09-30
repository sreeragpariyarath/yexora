// A parametric fan of fibres: a tight trunk from uStart to uNode, then a flaring
// spread out to the wall at uEndX. Free (no-wall) strands run past the wall by a
// random amount and fade out; as uWall → 1 every strand lands exactly on the wall
// and arrives flat, where the dots shader draws a glowing point at its end.

const fanChunk = /* glsl */ `
  uniform vec3 uStart;
  uniform vec3 uNode;
  uniform float uEndX;
  uniform float uFree;
  uniform float uSpread;
  uniform float uDepth;
  uniform float uBend;
  uniform float uTrunk;
  uniform float uLoad;
  uniform float uGrow;
  uniform float uWall;
  uniform float uTime;

  #define TAU 6.2831853

  vec3 fanPoint(float t, vec3 s) {
    if (t < uTrunk) {
      // Tiny jitter keeps the trunk a bundle rather than one line
      vec3 j = vec3(0.0, sin(s.x * TAU), cos(s.x * TAU)) * 0.025 * s.y;
      return mix(uStart, uNode, t / uTrunk) + j;
    }
    float u = (t - uTrunk) / (1.0 - uTrunk);
    float th = s.x * TAU;
    float r = sqrt(s.y);

    float endFree = uEndX + uFree * (0.35 + s.z * 0.95);
    float endX = mix(endFree, uEndX, uWall);
    // Hero intro: the fan grows out from its node
    float len = (endX - uNode.x) * mix(0.06, 1.0, uLoad);

    // Free strands flare like a horn; on the wall they arrive flat
    float prof = mix(pow(u, 1.9), smoothstep(0.0, 1.0, u), uWall);
    float open = smoothstep(uTrunk, 1.0, uGrow);
    float S = uSpread * mix(0.04, 1.0, uLoad * uLoad) * mix(0.3, 1.0, open);

    vec3 p;
    p.x = uNode.x + len * u;
    p.y = uNode.y + sin(th) * r * S * prof + uBend * u * u * mix(0.3, 1.0, open);
    p.z = uNode.z + cos(th) * r * S * prof * uDepth;

    float w = sin(u * 6.0 + uTime * 0.6 + s.x * 30.0) * 0.06 * u * (1.0 - 0.7 * uWall);
    p.y += w;
    p.z += w * 0.6;
    return p;
  }
`;

export const fanLineVertex = /* glsl */ `
  ${fanChunk}
  uniform float uAlpha;
  attribute float aT;
  attribute vec3 aSeed;
  varying float vU;
  varying vec3 vSeed;
  varying float vAlpha;

  void main() {
    vec3 p = fanPoint(aT, aSeed);
    float u = max(aT - uTrunk, 0.0) / (1.0 - uTrunk);

    float a = uAlpha;
    // Scroll grow (draws along the whole strand, trunk first) and load grow (spread only)
    // (thresholds run slightly past 1 so fully grown strands keep their very ends)
    a *= 1.0 - smoothstep(uGrow * 1.05 - 0.04, uGrow * 1.05, aT);
    a *= 1.0 - smoothstep(uLoad * 1.06 - 0.05, uLoad * 1.06, u);
    // Free ends fade out; ends on the wall stay lit
    a *= mix(1.0 - smoothstep(0.5, 1.0, u), 1.0, uWall);
    // Hundreds of strands overlap in the trunk, so keep it about one strand's worth of
    // light far from the node (it reads as a single fibre continuing from the fan
    // before), brightening into the node. While growing, a small glowing tip leads it.
    float tip = (1.0 - smoothstep(0.0, 0.06, uGrow * 1.05 - aT)) * step(uGrow, 0.995);
    float trunkA = mix(0.004, 0.05, smoothstep(0.55, 1.0, aT / uTrunk)) + tip * 0.035;
    a *= aT < uTrunk ? trunkA : mix(0.2, 1.0, smoothstep(0.0, 0.12, u));

    vU = u;
    vSeed = aSeed;
    vAlpha = a;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const fanLineFragment = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uViolet;
  uniform vec3 uLilac;
  varying float vU;
  varying vec3 vSeed;
  varying float vAlpha;

  void main() {
    vec3 col = mix(uViolet, uBlue, smoothstep(0.6, 1.0, vSeed.y));
    col = mix(uLilac, col, smoothstep(0.0, 0.35, vU));
    gl_FragColor = vec4(col, vAlpha * (0.4 + 0.6 * vSeed.z) * 0.6);
  }
`;

// One point per strand end (the wall), plus one at the node (aKind = 1)
export const fanDotVertex = /* glsl */ `
  ${fanChunk}
  uniform float uAlpha;
  uniform float uPixelRatio;
  attribute vec3 aSeed;
  attribute float aKind;
  varying float vAlpha;

  void main() {
    vec3 p = aKind > 0.5 ? uNode : fanPoint(1.0, aSeed);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float big = step(0.93, aSeed.z);
    float flicker = 0.75 + 0.25 * sin(uTime * 2.0 + aSeed.x * 40.0);
    float size = aKind > 0.5 ? 34.0 : mix(2.5 + aSeed.y * 4.0, 16.0, big);
    float vis = aKind > 0.5 ? smoothstep(uTrunk, uTrunk + 0.1, uGrow) * uLoad : uWall;

    gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);
    vAlpha = uAlpha * vis * (aKind > 0.5 ? 0.9 : mix(0.9, 0.35, big) * flicker);
    gl_Position = projectionMatrix * mv;
  }
`;

export const fanDotFragment = /* glsl */ `
  uniform vec3 uLilac;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uLilac, a * a * vAlpha);
  }
`;
