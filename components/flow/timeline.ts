// Everything in the 3D scene is a function of the "chapter" value c:
// c = i when section i's top reaches the top of the viewport (see ScrollFlow),
// fractional in between. Tracks are keyframes in c, eased with smoothstep
// between keys, so the scene is continuous everywhere — no stage switching.

type Key = [c: number, value: number];

const smooth = (x: number) => x * x * (3 - 2 * x);

export function track(keys: Key[]) {
  return (c: number) => {
    if (c <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [c1, v1] = keys[i];
      if (c <= c1) {
        const [c0, v0] = keys[i - 1];
        return v0 + (v1 - v0) * smooth((c - c0) / (c1 - c0));
      }
    }
    return keys[keys.length - 1][1];
  };
}

/** Maps scroll position to c using the measured document tops of the sections. */
export function chapterAt(y: number, tops: number[], maxScroll: number) {
  const n = tops.length;
  if (n === 0 || y <= tops[0]) return 0;
  for (let i = 1; i < n; i++) {
    if (y < tops[i]) return i - 1 + (y - tops[i - 1]) / (tops[i] - tops[i - 1]);
  }
  const end = Math.max(maxScroll, tops[n - 1] + 1);
  return n - 1 + Math.min((y - tops[n - 1]) / (end - tops[n - 1]), 1);
}

// ---------------------------------------------------------------------------
// World layout: the chain runs along +x and the camera pans right with scroll.
// Fan A (hero) → wall A → escaping thread → Fan B → wall B → escaping thread →
// tail fibres (beam → hourglass → scatter, fading out before the Works videos).

export interface FanConfig {
  strands: number;
  seed: number;
  start: [number, number, number];
  node: [number, number, number];
  /** x of the wall the strand ends land on */
  wallX: number;
  /** How far past the wall free (no-wall) strands reach, randomised per strand */
  free: number;
  spread: number;
  depth: number;
  /** Vertical drift of the spread (negative bends it down) */
  bend: number;
  /** Fraction of each strand that is the tight trunk before the node */
  trunk: number;
}

export const WALL_A = -5;
export const WALL_B = 11;
/** The tail fibre group (fiberShader.ts shapes) is centred here */
export const TAIL_X = 27;

export const FAN_A: FanConfig = {
  strands: 520,
  seed: 7,
  start: [-44, 0, 0],
  node: [-14.5, 0, 0],
  wallX: WALL_A,
  free: 7,
  spread: 14,
  depth: 0.5,
  bend: 0,
  trunk: 0.3,
};

export const FAN_B: FanConfig = {
  strands: 380,
  seed: 11,
  // The thread starts back at fan A's node and runs along its centre strand, so it
  // reads as one of fan A's fibres continuing through wall A
  start: FAN_A.node,
  node: [3, 0, 0],
  wallX: WALL_B,
  free: 4,
  spread: 7.5,
  depth: 0.5,
  // Blooms evenly up and down (no bend)
  bend: 0,
  // Trunk share ≈ its length share (17.5 of ~26.5 units) so points stay evenly spaced
  trunk: 0.66,
};

// Tail shape ids in fiberShader.ts
export const SHAPE = { escape: 0, beam: 1, hourglass: 2, scatter: 3 } as const;

const T = {
  camX: track([
    [0, -4],
    // About: frame wall A on the left and fan B's node (3) on the right, so the middle is dark for the card
    [1, 0.4],
    [1.55, 0.4],
    [2.05, 6.5],
    [2.5, 10],
    [3, TAIL_X],
  ]),
  camZ: track([
    [0, 12],
    [1, 11.5],
    [2, 11.5],
    [3, 11],
    [3.4, 12],
    [4.2, 12.5],
    // Works: ease back while the hourglass scatters behind the videos
    [5.12, 14],
  ]),

  fanAWall: track([
    [0.15, 0],
    [0.9, 1],
  ]),
  fanAAlpha: track([
    [2.2, 1],
    [2.6, 0],
  ]),

  fanBGrow: track([
    [0.95, 0],
    [1.6, 1],
  ]),
  fanBWall: track([
    [1.7, 0],
    [2.2, 1],
  ]),
  fanBAlpha: track([
    [3.0, 1],
    [3.4, 0],
  ]),

  tailGrow: track([
    [2.0, 0],
    [2.6, 1],
  ]),
  // Continuous shape position: integer = a shape, fraction = morph to the next one
  tailShape: track([
    [2.6, SHAPE.escape],
    [3.05, SHAPE.beam],
    [4.0, SHAPE.beam],
    [4.35, SHAPE.hourglass],
    [4.85, SHAPE.hourglass],
    [5.1, SHAPE.scatter],
  ]),
  // Beam swings from its diagonal up to near-vertical, then back flat for the hourglass
  tailRotZ: track([
    [3.35, 0],
    [3.9, 1.05],
    [4.05, 1.05],
    [4.4, 0],
  ]),

  specks: track([
    [0, 1],
    [2, 1],
    [2.6, 0.5],
    [4, 0.35],
    [5.12, 0.6],
  ]),
};

/** Mutable per-frame state shared by the scene components (never triggers React renders). */
export function createFlowState() {
  return {
    c: 0,
    time: 0,
    /** Hero intro (time-driven, 0–1) */
    load: 0,
    camX: 0,
    camZ: 12,
    fanAWall: 0,
    fanAAlpha: 1,
    fanBGrow: 0,
    fanBWall: 0,
    fanBAlpha: 1,
    tailGrow: 0,
    tailFrom: 0,
    tailTo: 0,
    tailMix: 0,
    tailRotZ: 0,
    specks: 1,
  };
}

export type FlowState = ReturnType<typeof createFlowState>;

export function evaluate(f: FlowState, c: number) {
  f.c = c;
  f.camX = T.camX(c);
  f.camZ = T.camZ(c);
  f.fanAWall = T.fanAWall(c);
  f.fanAAlpha = T.fanAAlpha(c);
  f.fanBGrow = T.fanBGrow(c);
  f.fanBWall = T.fanBWall(c);
  f.fanBAlpha = T.fanBAlpha(c);
  f.tailGrow = T.tailGrow(c);
  const s = T.tailShape(c);
  f.tailFrom = Math.floor(s);
  f.tailTo = Math.min(f.tailFrom + 1, SHAPE.scatter);
  f.tailMix = s - f.tailFrom;
  f.tailRotZ = T.tailRotZ(c);
  f.specks = T.specks(c);
}
