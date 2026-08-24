import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  DUR,
  EASE,
  countTo,
  caretOn,
  enter,
  enterAt,
  mix,
  mixToken,
  pop,
  press,
  ramp,
  typed,
} from "../motion";
import { AppFrame, BODY_Y, Cursor, Orb, abs, downAt, trackPos } from "../chrome";
import { TYPE } from "../fonts";

/**
 * The worked example. Every helper in motion.ts is used at least once here,
 * so this file doubles as the reference: to shoot a new clip, copy this
 * structure and change the flow, not the pipeline.
 *
 * The flow it walks is deliberately generic — type a query, get results,
 * filter them, publish. Replace it with the real steps of your own product,
 * in the real order, with copy taken from the live UI. That is the one
 * defect that cannot be fixed in the edit: a demo that walks a flow the
 * product does not have proves nothing, however good it looks.
 *
 * Read the beat sheet below before changing a number. Every click, entrance
 * and colour change is anchored to an absolute frame, and they are tuned
 * against each other — the pointer arrives before it clicks, the panel
 * answers after the click, the counter finishes before the eye leaves it.
 */

export const DEMO_LEN = 414;

/* ------------------------------------------------------------ beat sheet -- */

const APP_IN = 0;
const FIELD_CLICK = 20;
const TYPE_AT = 26;
const RUN_CLICK = 88;
const ROWS_AT = 96;
const COUNT_AT = 100;
const CHIP_CLICK = 184;
const REFILTER_AT = 190;
const PUBLISH_CLICK = 274;
const TOAST_AT = 282;
const OUT_AT = 380;

const PROMPT = "Revenue by channel, last quarter";

const CLICKS = [FIELD_CLICK, RUN_CLICK, CHIP_CLICK, PUBLISH_CLICK];

/* The pointer path. Keys are absolute frames; trackPos eases between them,
 * so the cursor is always already at a target before the click beat lands
 * on it. Give it ~16 frames to travel any real distance. */
const POINTER = [
  { at: 0, x: 860, y: 700 },
  { at: FIELD_CLICK - 14, x: 420, y: 192 },
  { at: RUN_CLICK - 16, x: 1448, y: 192 },
  { at: CHIP_CLICK - 20, x: 1214, y: 372 },
  { at: PUBLISH_CLICK - 22, x: 1306, y: 918 },
  { at: DEMO_LEN, x: 1306, y: 918 },
];

/* ------------------------------------------------------------- geometry -- */

const W = 1600;
const FIELD = { x: 48, y: BODY_Y + 50, w: 1504, h: 72 };
const RESULTS = { x: 48, y: 262, w: 980, h: 596 };
const SIDE = { x: 1060, y: 262, w: 492, h: 596 };
const PUBLISH = { x: 1060, y: 884, w: 492, h: 68 };

const ROWS = [
  { label: "Organic search", bar: 0.92, n: "1,204" },
  { label: "Paid social", bar: 0.71, n: "642" },
  { label: "Email", bar: 0.55, n: "389" },
  { label: "Referral", bar: 0.34, n: "171" },
  { label: "Direct", bar: 0.19, n: "75" },
];

const CHIPS = ["All channels", "Paid only", "Organic"];
const LIT_CHIP = 1;

/* ---------------------------------------------------------------- clip --- */

export function Demo() {
  const frame = useCurrentFrame();

  /* The app arrives and leaves on opacity only. Never a transform on this
   * container — it holds the whole UI, and a scale on it resamples every
   * glyph inside (hard rule 2). Opacity is safe: it composites. */
  const appIn = ramp(frame, APP_IN, DUR.sheet, EASE.out);
  const appOut = 1 - ramp(frame, OUT_AT, 20, EASE.out);
  const app = Math.min(appIn, appOut);

  const pointer = trackPos(frame, POINTER);
  const down = downAt(frame, CLICKS);

  const focus = ramp(frame, FIELD_CLICK, DUR.chip);
  const text = typed(frame, TYPE_AT, PROMPT);
  const typing = text.length > 0 && text.length < PROMPT.length;

  /* Two counters in sequence. The first counts up from nothing when the
   * results land; the second travels from that value to the filtered one
   * when the chip is clicked. A number that jumps between the two is the
   * loudest teleport on screen, because the eye is already reading it. */
  const publishIn = enter(frame, ROWS_AT + 10, { dur: DUR.panel, y: 10 });

  const total = countTo(frame, COUNT_AT, 2481);
  const refilter = ramp(frame, REFILTER_AT, DUR.sheet);
  const shown = frame < REFILTER_AT ? total : Math.round(mix(refilter, 2481, 312));

  return (
    <AbsoluteFill style={{ background: "var(--ground)" }}>
      <AbsoluteFill
        style={{
          background: "var(--background)",
          fontFamily: TYPE,
          color: "var(--foreground)",
          opacity: app,
        }}
      >
        <AppFrame
          w={W}
          title="Acme Studio"
          heading="New report"
          sub="Ask for anything"
        />

        {/* ---------------------------------------------- the prompt field */}
        <div
          style={{
            ...abs(FIELD),
            borderRadius: "var(--radius)",
            background: "var(--card)",
            /* The single most common defect this kit exists to prevent:
             * `focused ? "var(--brand)" : "var(--border)"`. That is a
             * one-frame teleport. Anchor a ramp at the frame the state
             * changes and blend the two tokens through it. */
            border: `1px solid ${mixToken(focus, "var(--border)", "var(--brand)")}`,
            boxShadow: `0 0 0 ${(focus * 3).toFixed(1)}px var(--brand-soft)`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 2,
          }}
        >
          <span style={{ fontSize: 24, opacity: text ? 1 : 0.45 }}>
            {text || "Ask for anything"}
          </span>
          {/* A caret only while something is actually being typed. Static
           * copy in a field the flow claims is being filled reads as a
           * screenshot, and the viewer clocks it immediately. */}
          <span
            style={{
              width: 2,
              height: 28,
              marginLeft: 3,
              background: "var(--brand)",
              opacity: focus > 0.5 && (typing || caretOn(frame)) ? 1 : 0,
            }}
          />

          <div
            style={{
              marginLeft: "auto",
              padding: "12px 28px",
              borderRadius: 10,
              fontSize: 19,
              fontWeight: 600,
              color: "white",
              background: "var(--brand)",
              /* A press that answers back, and lands on exactly 1 so no
               * frame outside the beat is left transformed. */
              transform: `scale(${press(frame, RUN_CLICK).toFixed(4)})`,
            }}
          >
            Run
          </div>
        </div>

        {/* ----------------------------------------------- the empty state */}
        {/* Without this the clip spends three seconds on a near-black frame
          * with one text field in it, which reads as a broken render rather
          * than as an app waiting for input. It also gives the results
          * something to dissolve *over*: the outgoing state is still on
          * screen underneath while the incoming one fades up, which is what
          * hard rule 5 is asking for. Fading this out first and the panels
          * in afterwards would put a hole between them. */}
        <div
          style={{
            ...abs({ x: RESULTS.x, y: RESULTS.y, w: SIDE.x + SIDE.w - RESULTS.x, h: RESULTS.h }),
            borderRadius: "var(--radius)",
            border: "1px dashed var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: ramp(frame, APP_IN + 4, DUR.sheet) * (1 - ramp(frame, ROWS_AT, DUR.chip)),
          }}
        >
          <Orb size={34} />
          <div style={{ fontSize: 20, color: "var(--muted-foreground)" }}>
            Results will appear here
          </div>
        </div>

        {/* --------------------------------------------------- the results */}
        <div
          style={{
            ...abs(RESULTS),
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            padding: 28,
            ...enter(frame, ROWS_AT, { dur: DUR.sheet, y: 14, scale: 0.985 }),
          }}
        >
          <div style={{ fontSize: 15, color: "var(--muted-foreground)" }}>
            CHANNEL BREAKDOWN
          </div>

          {ROWS.map((row, i) => {
            /* Nothing enters as a group. Two frames between siblings is the
             * minimum that reads as a list assembling rather than as a
             * block being pasted in. */
            const at = ROWS_AT + 8;
            const grow = ramp(frame, at + i * 2 + 4, DUR.hero, EASE.out);
            return (
              <div
                key={row.label}
                style={{
                  marginTop: 34,
                  ...enterAt(frame, at, i, { y: 10 }),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 19,
                    marginBottom: 9,
                  }}
                >
                  <span>{row.label}</span>
                  <span style={{ color: "var(--muted-foreground)" }}>{row.n}</span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 99,
                    background: "var(--muted)",
                    overflow: "hidden",
                  }}
                >
                  {/* scaleX, not width. Width relayouts every frame; a
                   * transform composites and cannot shimmer the row. */}
                  <div
                    style={{
                      height: "100%",
                      width: `${row.bar * 100}%`,
                      borderRadius: 99,
                      background: "var(--brand)",
                      transformOrigin: "left center",
                      transform: `scaleX(${grow.toFixed(4)})`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* The list needs a bottom. A panel whose content stops halfway
            * down reads as a render that failed, not as a design. It also
            * arrives last, after the rows it is summing — a total that
            * appears before its own operands is a small lie the eye
            * catches without being able to name. */}
          <div
            style={{
              marginTop: 30,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 19,
              ...enter(frame, ROWS_AT + 20, { y: 8 }),
            }}
          >
            <span style={{ color: "var(--muted-foreground)" }}>Total</span>
            <span style={{ fontWeight: 600 }}>2,481</span>
          </div>
        </div>

        {/* ------------------------------------------- the side panel */}
        <div
          style={{
            ...abs(SIDE),
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            padding: 28,
            ...enter(frame, ROWS_AT + 4, { dur: DUR.sheet, y: 14, scale: 0.985 }),
          }}
        >
          <div style={{ fontSize: 15, color: "var(--muted-foreground)" }}>
            ROWS MATCHED
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              marginTop: 6,
              /* Weight and size stay stepped. Tweening fontSize reflows the
               * line every frame; this number changes its value, not its
               * type. (hard rule 7) */
            }}
          >
            {shown.toLocaleString("en-US")}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 30, flexWrap: "wrap" }}>
            {CHIPS.map((chip, i) => {
              const lit = i === LIT_CHIP ? ramp(frame, CHIP_CLICK, DUR.chip) : 0;
              return (
                <div
                  key={chip}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 99,
                    fontSize: 17,
                    border: `1px solid ${mixToken(lit, "var(--border)", "var(--brand)")}`,
                    background: mixToken(lit, "transparent", "var(--brand-soft)"),
                    color: mixToken(lit, "var(--muted-foreground)", "var(--brand-strong)"),
                    transform: `scale(${(i === LIT_CHIP ? press(frame, CHIP_CLICK, 0.06) : 1).toFixed(4)})`,
                  }}
                >
                  {chip}
                </div>
              );
            })}
          </div>

          {[
            ["Top channel", "Organic search"],
            ["Period", "Q3 2026"],
          ].map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 17,
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid var(--border)",
                ...enterAt(frame, ROWS_AT + 16, i, { y: 8 }),
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}

          {/* The hero beat of the last phase. One per phase — if everything
           * is animated, nothing reads as animated. A spring, because this
           * lands in a slot rather than travelling. */}
          <div
            style={{
              marginTop: 34,
              padding: 22,
              borderRadius: 12,
              background: "var(--brand-soft)",
              border: "1px solid var(--brand)",
              display: "flex",
              gap: 14,
              alignItems: "center",
              opacity: ramp(frame, TOAST_AT, DUR.chip),
              transform: `translateY(${mix(pop(frame, TOAST_AT), 16, 0).toFixed(2)}px)`,
            }}
          >
            <Orb size={22} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Report published</div>
              <div style={{ fontSize: 15, color: "var(--muted-foreground)" }}>
                Shared with 4 people
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ publish button */}
        <div
          style={{
            ...abs(PUBLISH),
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 600,
            color: "white",
            background: "var(--brand)",
            ...publishIn,
            /* Two transforms on one element: compose them into one string,
             * never spread one over the other. The spread would silently
             * drop whichever came first, and the entrance would vanish for
             * the eight frames the press is active. */
            transform: `${publishIn.transform} scale(${press(frame, PUBLISH_CLICK).toFixed(4)})`,
          }}
        >
          Publish report
        </div>

        <Cursor x={pointer.x} y={pointer.y} down={down} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
