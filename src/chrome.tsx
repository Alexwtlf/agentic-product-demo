import type { CSSProperties } from "react";
import { EASE, ramp } from "./motion";
import { TYPE } from "./fonts";

/**
 * The fake app window every composition is drawn inside, plus the pointer.
 *
 * Keep this shared. Three compositions each carrying their own copy of the
 * title bar and cursor is how they drift apart, and a fix stops being
 * inherited. Same reasoning as motion.ts.
 *
 * The no-camera-on-chrome rule (skill hard rule 2) binds hardest on this
 * file: the bar and the header must never sit inside a lasting transform.
 */

export type Box = { x: number; y: number; w: number; h: number };

export const BAR = 40;
export const HEAD = 68;
export const BODY_Y = BAR + HEAD;

/** Absolute-position a box. Compositions lay themselves out in explicit
 *  pixel coordinates rather than flexbox, because a demo is choreography:
 *  you need to know where a thing is in order to point at it on frame 214. */
export function abs(box: Box): CSSProperties {
  return {
    position: "absolute",
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    boxSizing: "border-box",
  };
}

/** Piecewise cursor path. Keys are absolute frames; between them the
 *  pointer travels on an in-out cubic so it never teleports between
 *  targets. A cursor that jumps is the fastest way to break the illusion —
 *  faster than any of the panels behind it. */
export function trackPos(
  frame: number,
  keys: { at: number; x: number; y: number }[],
) {
  let i = 0;
  while (i < keys.length - 1 && frame >= keys[i + 1].at) i += 1;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  if (a.at === b.at) return { x: a.x, y: a.y };
  const t = ramp(frame, a.at, b.at - a.at, EASE.inOutCubic);
  return {
    x: Math.round(a.x + (b.x - a.x) * t),
    y: Math.round(a.y + (b.y - a.y) * t),
  };
}

/** True for the 6 frames after each click beat. Pair it with press() from
 *  motion.ts so the button answers on the same frames the pointer dips. */
export function downAt(frame: number, beats: number[]) {
  return beats.some((b) => frame >= b && frame < b + 6);
}

const dot: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 99,
  background: "var(--border)",
  display: "block",
};

/** Title bar + header as one unit. Static for the whole clip: a constant
 *  surface is what makes the loop seam free — the frame the clip restarts
 *  on is the frame it ended on, so there is no full-frame luminance jump. */
export function AppFrame({
  w,
  title,
  heading,
  sub,
}: {
  w: number;
  title: string;
  heading: string;
  sub: string;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: BAR,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
          fontFamily: TYPE,
          fontSize: 15,
          color: "var(--muted-foreground)",
        }}
      >
        <i style={dot} />
        <i style={dot} />
        <i style={dot} />
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: BAR,
          width: w,
          height: HEAD,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
          fontFamily: TYPE,
          color: "var(--foreground)",
        }}
      >
        <Orb />
        <div>
          <div style={{ fontSize: 21, fontWeight: 600 }}>{heading}</div>
          <div style={{ fontSize: 15, color: "var(--muted-foreground)" }}>
            {sub}
          </div>
        </div>
      </div>
    </>
  );
}

/** Stand-in for a product mark. Replace with your own. */
export function Orb({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background:
          "radial-gradient(circle at 30% 30%, var(--brand-strong), var(--brand))",
        boxShadow: "0 0 0 3px var(--brand-soft)",
        flexShrink: 0,
      }}
    />
  );
}

export function Cursor({
  x,
  y,
  down,
}: {
  x: number;
  y: number;
  down: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 34,
        height: 34,
        /* The dip is on the pointer itself, not on anything behind it, and
         * it returns to exactly 1. */
        transform: `translate(-3px, -2px) scale(${down ? 0.82 : 1})`,
        transformOrigin: "3px 2px",
        zIndex: 50,
        pointerEvents: "none",
        filter: "drop-shadow(0 2px 6px oklch(0 0 0 / 0.45))",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 28 28">
        <path
          d="M4 3.5 L4 24 L11.2 17.4 L17.8 26.2 L21.2 24.2 L14.8 15.6 L24 15.6 Z"
          fill="white"
          stroke="oklch(0.15 0 0)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
