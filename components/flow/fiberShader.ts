// The "tail" of the chain: fibres that escape wall B as a thin thread, become a
// beam, pinch into an hourglass, then scatter and fade out before the Works videos.
// Every strand's position is computed on the GPU from (t along the strand,
// per-strand seed), so a morph is just a mix() of two shape functions.
// Coordinates are local to the tail group (centred at TAIL_X in timeline.ts).

export const fiberVertex = /* glsl */ `
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uGrow;
  uniform float uEscapeX;

  attribute float aT;
  attribute vec3 aSeed;

  varying float vT;
  varying vec3 vSeed;
  varying float vAlpha;

  #define PI 3.14159265
  #define TRUNK 0.22

  // 0 — a thread leaves wall B, reaches a node and opens into a narrow beam
  vec3 escape(float t, vec3 s) {
    vec3 a = vec3(uEscapeX, -0.3, 0.0);
    vec3 n = vec3(uEscapeX + 4.0, -0.3, 0.0);
    if (t < TRUNK) return mix(a, n, t / TRUNK);
    float u = (t - TRUNK) / (1.0 - TRUNK);
    float th = s.x * 2.0 * PI;
    float r = sqrt(s.y) * (0.08 + 2.0 * pow(u, 2.2));
    return vec3(mix(n.x, 14.0, u), n.y + sin(th) * r + u * 1.2, cos(th) * r * 0.5);
  }

  // 1 — one diagonal beam that flares at the far end
  vec3 beam(float t, vec3 s) {
    vec3 a = vec3(-13.0, -6.5, 1.0);
    vec3 b = vec3(13.0, 6.0, -3.0);
    vec3 dir = normalize(b - a);
    vec3 n1 = normalize(cross(dir, vec3(0.0, 0.0, 1.0)));
    vec3 n2 = cross(dir, n1);
    float th = s.x * 2.0 * PI;
    float r = sqrt(s.y) * (0.05 + 1.1 * pow(t, 5.0));
    return mix(a, b, t) + (n1 * sin(th) + n2 * cos(th)) * r;
  }

  // 2 — straight strands twisted between two rings: an hourglass with a narrow waist
  vec3 hourglass(float t, vec3 s) {
    float th = s.x * 2.0 * PI;
    float R = 5.2 + s.y * 1.4;
    float twist = 2.75;
    vec3 a = vec3(-11.0, R * cos(th) * 0.85, R * sin(th) * 0.6);
    vec3 b = vec3(11.0, R * cos(th + twist) * 0.85, R * sin(th + twist) * 0.6);
    return mix(a, b, t);
  }

  // 3 — hourglass blown apart while the fibres fade out
  vec3 scatter(float t, vec3 s) {
    return hourglass(t, s) * vec3(1.6, 2.4, 2.4) + vec3(0.0, 0.0, 5.0);
  }

  vec3 shapeOf(float id, float t, vec3 s) {
    if (id < 0.5) return escape(t, s);
    if (id < 1.5) return beam(t, s);
    if (id < 2.5) return hourglass(t, s);
    return scatter(t, s);
  }

  float alphaOf(float id, float t) {
    if (id > 2.5) return 0.0;
    // Hundreds of strands overlap in the escape trunk; keep it a thread, not a blowout
    if (id < 0.5 && t < TRUNK) return 0.06;
    return 1.0;
  }

  void main() {
    // Stagger the morph per strand (and slightly along it) so the shape flows rather than snaps
    float delay = aSeed.z * 0.35 + aT * 0.15;
    float m = smoothstep(0.0, 1.0, clamp((uMix - delay) / 0.5, 0.0, 1.0));

    // Leaving an invisible shape: don't fly in from it, just fade in at the new shape
    vec3 to = shapeOf(uTo, aT, aSeed);
    vec3 from = alphaOf(uFrom, 0.5) > 0.5 ? shapeOf(uFrom, aT, aSeed) : to;
    vec3 p = mix(from, to, m);

    float wobble = sin(aT * 7.0 + uTime * 0.7 + aSeed.x * 30.0) * 0.05
                 + sin(aT * 13.0 - uTime * 0.5 + aSeed.y * 20.0) * 0.025;
    p.y += wobble;
    p.z += wobble * 0.7;

    vAlpha = mix(alphaOf(uFrom, aT), alphaOf(uTo, aT), m);
    vAlpha *= 1.0 - smoothstep(uGrow * 1.08 - 0.08, uGrow * 1.08, aT);
    vT = aT;
    vSeed = aSeed;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const fiberFragment = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uViolet;
  uniform vec3 uPink;
  uniform vec3 uCyan;
  uniform float uIntensity;

  varying float vT;
  varying vec3 vSeed;
  varying float vAlpha;

  void main() {
    float g = clamp(vT + (vSeed.y - 0.5) * 0.35, 0.0, 1.0);
    vec3 col = mix(uBlue, uViolet, smoothstep(-0.25, 0.5, g));
    vec3 tip = mix(uPink, uCyan, step(0.5, vSeed.x));
    col = mix(col, tip, smoothstep(0.8, 1.0, vT) * 0.6);

    float a = vAlpha * smoothstep(0.0, 0.04, vT) * (1.0 - 0.7 * smoothstep(0.85, 1.0, vT));
    a *= (0.45 + 0.55 * vSeed.z) * uIntensity;
    gl_FragColor = vec4(col, a);
  }
`;
