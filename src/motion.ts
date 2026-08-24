/* The motion vocabulary. This file is the whole point of the kit.
 *
 * Why it exists: the first demos I cut moved only by cross-fading whole
 * phases. Every element inside a phase — chips, rows, buttons — snapped
 * between states in a single frame. That reads as a screen recording,
 * because a screen recording is exactly what it is: states teleport,
 * nothing travels.
 *
 * The anti-flash rules in the skill ban a CSS camera on the app chrome and
 * any zoom on type. They do not ban motion — they ban moving the *frame*.
 * Moving individual elements on `transform` + `opacity` is the one path
 * that is both alive and safe: those two properties skip layout and paint
 * and composite on the GPU, so they cannot shimmer type, and
 * check-frames.mjs cannot flag them (it looks for tiled frames and
 * luminance jumps, neither of which a GPU composite produces).
 *
 * Take curves from your own product's CSS so the film moves like the thing
 * it is advertising. Do not invent one here.
 */

import type { CSSProperties } from "react";

/** Mirrors FPS in Root.tsx. Kept local so this stays a leaf module — Root
 *  imports the compositions, so importing Root back here would cycle. */
const FPS = 30;

/* ------------------------------------------------------------- the math --
 *
 * This file imports nothing. That is deliberate: the vocabulary below is the
 * part of this kit worth stealing, and a dependency on the renderer would
 * stop you stealing it. Everything here is pure functions of a frame number,
 * so the same file works under Remotion, under Framer Motion, in a canvas
 * loop, in React Native, or in whatever you render with next.
 *
 * Remotion ships equivalents of the three primitives below. They are inlined
 * rather than imported for exactly that reason — not because theirs are
 * worse. */

/** Cubic-bezier easing, the CSS `cubic-bezier(x1, y1, x2, y2)` curve.
 *
 *  x(t) and y(t) are both cubic beziers with endpoints pinned at 0 and 1, so
 *  getting y for a given x means solving x(t) = input for t first. Newton's
 *  method converges in a handful of steps for the well-behaved curves an
 *  easing is; the bisection fallback covers the ones with a near-zero
 *  derivative in the middle, where Newton stalls. */
export function bezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (t: number) => number {
  const curve = (a: number, b: number, t: number) => {
    const c = 3 * a;
    const bb = 3 * (b - a) - c;
    const aa = 1 - c - bb;
    return ((aa * t + bb) * t + c) * t;
  };
  const slope = (a: number, b: number, t: number) => {
    const c = 3 * a;
    const bb = 3 * (b - a) - c;
    const aa = 1 - c - bb;
    return (3 * aa * t + 2 * bb) * t + c;
  };

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = curve(x1, x2, t) - x;
      if (Math.abs(err) < 1e-6) return curve(y1, y2, t);
      const d = slope(x1, x2, t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }

    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (curve(x1, x2, t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return curve(y1, y2, t);
  };
}

/** Map x from [inA, inB] onto [outA, outB] through `easing`, clamped at both
 *  ends. Clamping is not optional here: an unclamped ramp keeps travelling
 *  after its window closes, and the element it drives drifts off screen
 *  three seconds later where nobody connects it to the cause. */
function span(
  x: number,
  inA: number,
  inB: number,
  outA: number,
  outB: number,
  easing: (t: number) => number,
): number {
  if (inB === inA) return outB;
  const t = Math.min(1, Math.max(0, (x - inA) / (inB - inA)));
  return outA + (outB - outA) * easing(t);
}

type SpringConfig = { damping: number; stiffness: number; mass: number };

/** Position of a damped harmonic oscillator released at 0 and pulled to 1.
 *
 *  Underdamped (zeta < 1) overshoots and rings; critically damped and above
 *  arrives without crossing. The analytical solution is used rather than a
 *  step integrator so the value at a frame does not depend on how many
 *  frames were computed before it — a renderer may ask for frame 200 without
 *  ever having asked for frame 199. */
function oscillator(t: number, { damping, stiffness, mass }: SpringConfig) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    );
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

/** How long the oscillator above takes to settle within `eps` of 1, from the
 *  decay envelope rather than by sampling. Used to fit a whole spring —
 *  overshoot included — inside a chosen number of frames. */
function settleTime(config: SpringConfig, eps = 1e-3): number {
  const { damping, stiffness, mass } = config;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const decay = zeta < 1 ? zeta * w0 : w0;
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : w0;
  const amp = zeta < 1 ? Math.sqrt(1 + ((zeta * w0) / wd) ** 2) : 2;
  return Math.max(1e-3, -Math.log(eps / amp) / decay);
}

/* ---------------------------------------------------------------- curves -- */

/** Four curves, and you need four. Names match the CSS custom properties
 *  they were lifted from, so a value can be traced back to the stylesheet. */
export const EASE = {
  /** ease-out-expo. The default. Everything entering or leaving. */
  out: bezier(0.16, 1, 0.3, 1),
  /** ease-out-back. Overshoots. Only for a thing landing in its slot, and
   *  only once per clip — an overshoot everywhere reads as a toy. */
  outBack: bezier(0.34, 1.56, 0.64, 1),
  /** Symmetric. Only for something already on screen that travels. */
  inOut: bezier(0.45, 0, 0.55, 1),
  /** Symmetric cubic, for a thing crossing the frame under its own power —
   *  a cursor between two targets. Flatter in the middle than `inOut`. */
  inOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
  /** The typographic curve. Titles only. */
  word: bezier(0.22, 1, 0.36, 1),
} as const;

/* Never ease-in. It starts slow, which delays the exact moment the eye is
 * waiting on. There is no entrance it improves. */

/* -------------------------------------------------------------- durations -- */

/** Frames at 30fps. A product demo is the *explanatory* tier, where the
 *  sub-300ms ceiling for operable UI does not apply — the viewer is
 *  watching, not clicking. These still stay tight enough to read as an
 *  interface rather than as a slide deck. */
export const DUR = {
  /** 133ms — a press answering back. */
  press: 4,
  /** 200ms — a chip changing state. */
  chip: 6,
  /** 300ms — a row, a card, a panel arriving. */
  panel: 9,
  /** 433ms — a sheet or a full column. */
  sheet: 13,
  /** 600ms — the hero beat of a phase. Spend it once. */
  hero: 18,
  /** 500ms — one word rising out of its mask. */
  word: 15,
} as const;

/** Frames between siblings in a list. ~67ms — the low end of the usual
 *  30–80ms, because at 30fps anything longer makes a six-item list take
 *  half a second to finish arriving. Never let a whole group enter on one
 *  frame; that single frame is what makes a UI look pasted in. */
export const STAGGER = 2;

/* --------------------------------------------------------------- helpers -- */

/** 0 → 1 across [at, at + dur], clamped both ends. The primitive
 *  everything else is built from. */
export function ramp(
  frame: number,
  at: number,
  dur: number = DUR.panel,
  easing: (t: number) => number = EASE.out,
): number {
  return span(frame, at, at + dur, 0, 1, easing);
}

/** Linear blend, for driving a numeric style off a ramp. */
export function mix(t: number, from: number, to: number): number {
  return from + (to - from) * t;
}

/** Blend two design tokens. Chromium interpolates in oklab, so a token
 *  pair crosses without the grey sag an sRGB mix leaves at the midpoint.
 *  Pass the `var(--token)` strings, never a hex.
 *
 *  This function is the fix for the single most common defect in a demo:
 *  `on ? "var(--brand)" : "var(--border)"` in a style object. That is a
 *  one-frame teleport. Anchor a ramp at the frame the state changes and
 *  pass it through here instead. */
export function mixToken(t: number, from: string, to: string): string {
  const pct = Math.round(Math.min(1, Math.max(0, t)) * 100);
  return `color-mix(in oklab, ${to} ${pct}%, ${from})`;
}

type EnterOpts = {
  /** Frames the entrance takes. Default DUR.panel. */
  dur?: number;
  /** Pixels travelled. Positive rises from below, negative drops from above. */
  y?: number;
  /** Horizontal travel, for something arriving from a rail. */
  x?: number;
  /** Starting scale. Never 0 — nothing in the world appears from nothing. */
  scale?: number;
  easing?: (t: number) => number;
};

/** An element arriving: it travels and fades at once. Returns `transform`
 *  and `opacity` only, so it composites on the GPU and cannot shimmer the
 *  type inside it.
 *
 *  The default 12px rise is deliberately small. At 1600x1000 delivered to a
 *  1536-wide tile, a 40px entrance reads as a slide deck; 12px reads as an
 *  interface settling. Entrances start at scale 0.9–0.97 and travel <=16px,
 *  or they stop looking like software. */
export function enter(
  frame: number,
  at: number,
  opts: EnterOpts = {},
): CSSProperties {
  const {
    dur = DUR.panel,
    y = 12,
    x = 0,
    scale = 1,
    easing = EASE.out,
  } = opts;
  const t = ramp(frame, at, dur, easing);
  const parts = [
    `translate(${mix(t, x, 0).toFixed(2)}px, ${mix(t, y, 0).toFixed(2)}px)`,
  ];
  if (scale !== 1) parts.push(`scale(${mix(t, scale, 1).toFixed(4)})`);
  return { opacity: t, transform: parts.join(" ") };
}

/** The same, staggered by index. `enterAt(frame, 40, i)` walks a list in. */
export function enterAt(
  frame: number,
  at: number,
  index: number,
  opts: EnterOpts = {},
): CSSProperties {
  return enter(frame, at + index * STAGGER, opts);
}

/** Exit the way it entered — same axis, same distance, reversed. It also
 *  keeps a leaving element from drifting somewhere the incoming phase has
 *  to cover. */
export function leave(
  frame: number,
  at: number,
  opts: EnterOpts = {},
): CSSProperties {
  const { dur = DUR.chip, y = 12, x = 0, easing = EASE.out } = opts;
  const t = ramp(frame, at, dur, easing);
  return {
    opacity: 1 - t,
    transform: `translate(${mix(t, 0, x).toFixed(2)}px, ${mix(t, 0, y).toFixed(2)}px)`,
  };
}

/** A spring anchored at a frame, 0 → 1. Reach for this over `ramp` when the
 *  thing should feel physical: a value landing, a card snapping into a
 *  slot. Springs for landing, ramps for travel.
 *
 *  Bounce stays low — damping 14 settles without the wobble that makes a
 *  product demo look like a toy. Do not go below 14 here. */
export function pop(
  frame: number,
  at: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
  durationInFrames: number = DUR.sheet,
): number {
  const cfg = { damping: 14, stiffness: 120, mass: 0.8, ...config };
  const elapsed = frame - at;
  if (elapsed <= 0) return 0;
  if (elapsed >= durationInFrames) return 1;
  /* Time is scaled so the spring finishes settling exactly at
   * durationInFrames instead of whenever its own physics happen to run out.
   * Without this, `stiffness` doubles as a duration control and every tweak
   * to the feel silently retimes the beat it lands on. */
  const t = (elapsed / durationInFrames) * settleTime(cfg);
  return oscillator(t, cfg);
}

/** A press that answers back: down fast, released on the same curve, and
 *  landing on exactly 1. The bell shape matters — the scale must return to
 *  1 so no frame outside the press is left transformed, which is what the
 *  no-camera-on-chrome rule is protecting. */
export function press(frame: number, at: number, depth = 0.04): number {
  const len = DUR.press * 2;
  if (frame < at || frame >= at + len) return 1;
  const t = (frame - at) / (len - 1);
  return 1 - depth * Math.sin(Math.PI * t);
}

/** A number counting up to its final value. A counter that snaps is the
 *  loudest teleport on screen — louder than a panel appearing, because the
 *  eye is already reading it. */
export function countTo(
  frame: number,
  at: number,
  to: number,
  dur: number = DUR.sheet,
): number {
  return Math.round(mix(ramp(frame, at, dur, EASE.out), 0, to));
}

/** A caret that blinks on a half-second, for anything being typed. */
export function caretOn(frame: number): boolean {
  return Math.floor(frame / (FPS / 2)) % 2 === 0;
}

/** Reveal typed text one character at a time. `cps` is characters per
 *  second — 28 is a fast human, quick enough not to stall a 20s cut.
 *  Static copy in a field the flow claims is being filled reads as a
 *  screenshot, and the viewer clocks it immediately. */
export function typed(
  frame: number,
  at: number,
  text: string,
  cps = 28,
): string {
  if (frame <= at) return "";
  return text.slice(0, Math.floor(((frame - at) / FPS) * cps));
}
