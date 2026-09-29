// Scroll stages for the 3D fibre flow. Each stage holds its shape for the first
// HOLD of its scroll slice, then morphs into the next one over the rest.

export type Vec3 = [number, number, number];

export type CopyAlign = "left" | "center" | "right";

export interface FlowCopy {
  eyebrow: string;
  title: string;
  body: string;
  align: CopyAlign;
}

export interface FlowStage {
  /** Fibre shape id in fiberShader.ts (0 spray, 1 double fan, 2 beam, 3 hourglass, 4 scatter, 5 burst) */
  shape: number;
  camera: { pos: Vec3; target: Vec3 };
  /** Strength of the floating particles (0–1) */
  specks: number;
  copy?: FlowCopy;
}

// TODO: real copy — everything below is placeholder text.
export const STAGES: FlowStage[] = [
  {
    shape: 0,
    specks: 1,
    camera: { pos: [0, 0, 12], target: [0, 0, 0] },
    copy: {
      eyebrow: "Vision in motion",
      title: "Next-Generation Digital Experiences",
      body: "Scalable products, platforms and brands — designed, engineered and launched without limits.",
      align: "right",
    },
  },
  {
    shape: 1,
    specks: 1,
    camera: { pos: [0.6, -0.2, 9], target: [0, -0.2, 0] },
    copy: {
      eyebrow: "About the studio",
      title: "One Studio. Endless Possibilities.",
      body: "Strategy, design and engineering under one roof — so you can focus on growth, not handovers.",
      align: "center",
    },
  },
  {
    shape: 2,
    specks: 0.5,
    camera: { pos: [0, 0, 11], target: [0, 0, 0] },
    copy: {
      eyebrow: "The problem",
      title: "Digital Is Complex. We Make It Simple.",
      body: "Fragmented tools, slow delivery and brittle integrations hold ambitious teams back.",
      align: "left",
    },
  },
  {
    shape: 3,
    specks: 0.35,
    camera: { pos: [0, 0.8, 12.5], target: [0, 0, 0] },
    copy: {
      eyebrow: "The solution",
      title: "The Future of Your Brand Starts Here",
      body: "",
      align: "center",
    },
  },
  {
    shape: 4,
    specks: 0.5,
    camera: { pos: [0, 0, 10], target: [0, 0, 0] },
  },
  {
    shape: 5,
    specks: 0.3,
    camera: { pos: [0, 0.4, 12], target: [0, 0.6, 0] },
  },
];

export const HOLD = 0.45;
/** Copy for a stage fades out once its slice passes this point (the morph gets the stage to itself). */
export const COPY_OUT = 0.72;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Maps overall progress (0–1) to the stage pair being shown and the eased morph between them. */
export function stageAt(p: number) {
  const count = STAGES.length;
  const f = clamp01(p) * count;
  const index = Math.min(Math.floor(f), count - 1);
  const local = f - index;
  const last = index === count - 1;
  return {
    index,
    local,
    from: index,
    to: last ? index : index + 1,
    mix: last ? 0 : smoothstep(HOLD, 1, local),
  };
}

/** Mutable per-frame state shared by the scene components (never triggers React renders). */
export interface FlowState {
  p: number;
  from: number;
  to: number;
  mix: number;
  /** How present each stage is right now (0–1) */
  weights: number[];
  /** Intro draw-in of the fibres (0–1) */
  grow: number;
  time: number;
}

export function createFlowState(): FlowState {
  return { p: 0, from: 0, to: 1, mix: 0, weights: STAGES.map((_, i) => (i === 0 ? 1 : 0)), grow: 0, time: 0 };
}
