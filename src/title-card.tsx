import { AbsoluteFill } from "remotion";
import { DUR, EASE, mix, ramp } from "./motion";
import { TYPE } from "./fonts";

/**
 * The cold open. Full rationale: .claude/skills/product-demo/references/titles.md
 *
 * Words rise out of their own mask boxes, staggered, then the card holds
 * still long enough to be read and dissolves into the same dark ground the
 * app rises from.
 *
 * Per word, not per letter. The request is almost always "letters one by
 * one", and for a title of any length that is the wrong call: 15 glyphs at
 * a 2-frame stagger are still arriving at frame 30 of a 66-frame card, with
 * nothing left over for stillness. What the eye gets is a typewriter — a
 * mechanism, not a title. Boxing each glyph also destroys kerning, which at
 * 92px is visible on every diagonal pair. Per-letter is permitted only for
 * a four or five glyph wordmark where you can set the kerning by hand.
 */

export const TITLE_LEN = 66;

const WORD_IN = 6;
const WORD_STAGGER = 3;
const KICKER_IN = 22;
const RULE_IN = 26;
const OUT_AT = TITLE_LEN - 12;

export function TitleCard({
  name,
  kicker,
  frame,
}: {
  name: string;
  kicker: string;
  frame: number;
}) {
  const words = name.split(" ");

  /* The whole card leaves together, onto the same dark field the app
   * arrives on, so the handover is a dissolve between two states of one
   * ground rather than a cut between two lit frames. This is also what
   * makes the loop seam free — see hard rule 5. */
  const out = 1 - ramp(frame, OUT_AT, 12, EASE.out);

  return (
    <AbsoluteFill
      style={{
        background: "var(--ground)",
        fontFamily: TYPE,
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div style={{ display: "flex", gap: 22 }}>
          {words.map((word, i) => {
            const t = ramp(
              frame,
              WORD_IN + i * WORD_STAGGER,
              DUR.word,
              EASE.word,
            );
            return (
              /* One mask per word, never one mask around several lines. The
               * word travels out from behind a hard edge; a word that
               * merely fades up reads as a slide transition, not as
               * typography. */
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  lineHeight: 1.06,
                  paddingBottom: 6,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 92,
                    fontWeight: 700,
                    /* Negative tracking is what makes a title look set
                     * rather than typed. At 92px, default tracking reads
                     * loose and webby. */
                    letterSpacing: -2.5,
                    color: "white",
                    /* translateY only. Scaling a headline is the one thing
                     * hard rule 3 exists to forbid, and it bites hardest
                     * here where type is the whole frame. */
                    transform: `translateY(${mix(t, 110, 0).toFixed(2)}%)`,
                    /* No opacity here, on purpose. Masking and fading at
                     * the same time cancel out: the fade makes the word
                     * visible above the edge it is supposed to be emerging
                     * from, and what reads is a slide transition again. The
                     * mask alone is the effect. */
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>

        {/* One accent, and it is a rule rather than a second colour on the
            letterforms. scaleX so it grows without relayout. Never a
            gradient across the type. */}
        <div
          style={{
            width: 120,
            height: 3,
            borderRadius: 99,
            marginTop: 26,
            background: "var(--brand)",
            transformOrigin: "center",
            transform: `scaleX(${ramp(frame, RULE_IN, DUR.sheet, EASE.out).toFixed(3)})`,
          }}
        />

        {/* The kicker follows the name — two type elements arriving
            together have no hierarchy. Reduced opacity, not a second grey
            token. */}
        <div
          style={{
            marginTop: 22,
            fontSize: 22,
            fontWeight: 500,
            color: "white",
            opacity: ramp(frame, KICKER_IN, DUR.sheet, EASE.out) * 0.68,
            transform: `translateY(${mix(
              ramp(frame, KICKER_IN, DUR.sheet, EASE.out),
              10,
              0,
            ).toFixed(2)}px)`,
          }}
        >
          {kicker}
        </div>
      </div>
    </AbsoluteFill>
  );
}
