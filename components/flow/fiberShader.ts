// Every strand's position is computed on the GPU from (t along the strand, per-strand seed),
// so morphing between stage shapes is just a mix() of two shape functions.

export const fiberVertex = /* glsl */ `
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uGrow;
  uniform float uBurst;

  attribute float aT;
  attribute vec3 aSeed;

  varying float vT;
  varying vec3 vSeed;
  varying float vAlpha;

  #define PI 3.14159265

  // 0 — bundle enters from the left and fans out into a wide spray
  vec3 spray(float t, vec3 s) {
    float th = s.x * 2.0 * PI;
    float r = sqrt(s.y);
    float spread = pow(t, 2.1) * 7.5 + 0.04;
    float x = mix(-12.0, 1.2 + s.z * 1.8, t);
    return vec3(x, sin(th) * r * spread, cos(th) * r * spread * 0.55 - t * 1.5);
  }

  // 1 — wide fan on the left, pinched to a bright point, second fan bending down-right
  vec3 doubleFan(float t, vec3 s) {
    float th = s.x * 2.0 * PI;
    float r = sqrt(s.y);
    float u = t - 0.55;
    float left = pow(max(-u, 0.0) / 0.55, 1.5) * 7.5;
    float right = pow(max(u, 0.0) / 0.45, 1.7) * 3.4;
    float spread = left + right + 0.03;
    float x = mix(-13.0, 9.0, t);
    return vec3(x, sin(th) * r * spread - 0.4 - right * 0.7, cos(th) * r * spread * 0.55);
  }

  // 2 — everything collapses into one diagonal beam that flares at the far end
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

  // 3 — straight strands twisted between two rings: an hourglass with a narrow waist
  vec3 hourglass(float t, vec3 s) {
    float th = s.x * 2.0 * PI;
    float R = 5.2 + s.y * 1.4;
    float twist = 2.75;
    vec3 a = vec3(-11.0, R * cos(th) * 0.85, R * sin(th) * 0.6);
    vec3 b = vec3(11.0, R * cos(th + twist) * 0.85, R * sin(th + twist) * 0.6);
    return mix(a, b, t);
  }

  // 4 — hourglass blown apart (fibres fade out while the tubes take over)
  vec3 scatter(float t, vec3 s) {
    return hourglass(t, s) * vec3(1.6, 2.4, 2.4) + vec3(0.0, 0.0, 5.0);
  }

  // 5 — a small ring that grows into a half-sun of radial fibres
  vec3 burst(float t, vec3 s) {
    float th = s.x * 2.0 * PI;
    float r = mix(0.7, 3.6 + s.y * 2.4, t) * mix(0.12, 1.0, uBurst);
    return vec3(cos(th) * r, 1.6 + sin(th) * r, -2.0 + t * 1.4 + sin(t * PI) * s.z);
  }

  vec3 shapeOf(float id, float t, vec3 s) {
    if (id < 0.5) return spray(t, s);
    if (id < 1.5) return doubleFan(t, s);
    if (id < 2.5) return beam(t, s);
    if (id < 3.5) return hourglass(t, s);
    if (id < 4.5) return scatter(t, s);
    return burst(t, s);
  }

  float alphaOf(float id) {
    return (id > 3.5 && id < 4.5) ? 0.0 : 1.0;
  }

  void main() {
    // Stagger the morph per strand (and slightly along it) so the shape flows rather than snaps
    float delay = aSeed.z * 0.35 + aT * 0.15;
    float m = smoothstep(0.0, 1.0, clamp((uMix - delay) / 0.5, 0.0, 1.0));

    // Leaving an invisible shape: don't fly in from it, just fade in at the new shape
    vec3 to = shapeOf(uTo, aT, aSeed);
    vec3 from = alphaOf(uFrom) > 0.5 ? shapeOf(uFrom, aT, aSeed) : to;
    vec3 p = mix(from, to, m);

    float wobble = sin(aT * 7.0 + uTime * 0.7 + aSeed.x * 30.0) * 0.05
                 + sin(aT * 13.0 - uTime * 0.5 + aSeed.y * 20.0) * 0.025;
    p.y += wobble;
    p.z += wobble * 0.7;

    vAlpha = mix(alphaOf(uFrom), alphaOf(uTo), m);
    vAlpha *= 1.0 - smoothstep(uGrow - 0.08, uGrow, aT);
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
  uniform float uCool;
  uniform float uIntensity;

  varying float vT;
  varying vec3 vSeed;
  varying float vAlpha;

  void main() {
    float g = clamp(vT + (vSeed.y - 0.5) * 0.35, 0.0, 1.0);
    vec3 col = mix(uBlue, uViolet, smoothstep(0.15, 0.75, g));
    vec3 tip = mix(uPink, uCyan, step(0.5, vSeed.x));
    col = mix(col, tip, smoothstep(0.8, 1.0, vT) * 0.6);
    // Final burst stage runs cooler (blue → cyan)
    col = mix(col, mix(uBlue, uCyan, vT), uCool);

    float a = vAlpha * smoothstep(0.0, 0.04, vT) * (1.0 - 0.7 * smoothstep(0.85, 1.0, vT));
    a *= (0.45 + 0.55 * vSeed.z) * uIntensity;
    gl_FragColor = vec4(col, a);
  }
`;
