import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  DUR,
  EASE,
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
 * First clip shot with this kit against Athana's live landing.
 *
 * Made on screen: a short film of a rainy night alley.
 * Flow, copy from the landing + cinema composer:
 *   type the hero prompt → Pick a skill → AI film → Create → three scenes land
 * Payoff: public/marketing/make/films-series.mp4 — the Films & series tile.
 */

export const ATHANA_LEN = 850;

/* ------------------------------------------------------------ beat sheet -- */

const APP_IN = 0;
const FIELD_CLICK = 16;
const TYPE_AT = 22;
const SKILL_CLICK = 150;
const SKILL_PICK = 188;
const CREATE_CLICK = 230;
const SCENES_AT = 248;
const FILM_AT = 500;
const OUT_AT = 820;

const PROMPT =
  "A rainy Tokyo alley at night, neon on wet asphalt, slow push-in, no dialogue.";

const SKILLS = [
  {
    label: "Product ads",
    blurb: "Brand commercial where the product is the hero. No character needed.",
  },
  {
    label: "AI film",
    blurb: "Multi-scene story with a cast, scripted and stitched into one cut.",
  },
  {
    label: "Viral shorts",
    blurb: "One hook, one take. Built for the feed.",
  },
  {
    label: "UGC ads",
    blurb: "Your creator holds the product and talks to camera.",
  },
];
const LIT_SKILL = 1;

const SCENES = [
  { n: 1, title: "Under the awning", beat: "Slow push-in. Rain. She waits. She does not speak." },
  { n: 2, title: "Get in", beat: "Window already down. He says \"Get in.\" She holds his eyes." },
  { n: 3, title: "Into the rain", beat: "She turns and walks away. He watches in the side mirror." },
];

const STILL_COUNT = 150;

const CLICKS = [FIELD_CLICK, SKILL_CLICK, SKILL_PICK, CREATE_CLICK];

const POINTER = [
  { at: 0, x: 820, y: 720 },
  { at: FIELD_CLICK - 14, x: 220, y: 210 },
  { at: SKILL_CLICK - 16, x: 268, y: 348 },
  { at: SKILL_PICK - 16, x: 240, y: 508 },
  { at: CREATE_CLICK - 18, x: 1410, y: 348 },
  { at: FILM_AT - 8, x: 1410, y: 348 },
  { at: ATHANA_LEN, x: 1410, y: 348 },
];

/* ------------------------------------------------------------- geometry -- */

const W = 1600;
const FIELD = { x: 48, y: BODY_Y + 36, w: 1504, h: 168 };
const TOOL_Y = FIELD.y + FIELD.h + 16;
const SKILL_PILL = { x: 48, y: TOOL_Y, w: 168, h: 36 };
const CREATE = { x: 1320, y: TOOL_Y, w: 232, h: 36 };
const MENU = { x: 48, y: TOOL_Y + 48, w: 440, h: 328 };
const EMPTY = { x: 48, y: TOOL_Y + 64, w: 1504, h: 520 };
const CARD_W = 480;
const CARD_H = 220;
const CARD_Y = TOOL_Y + 72;
const CARD_GAP = 28;
const FILM_W = 405;
const FILM_H = 720;
const FILM = {
  x: Math.round((W - FILM_W) / 2),
  y: 140,
  w: FILM_W,
  h: FILM_H,
};

function cardBox(i: number) {
  return {
    x: 48 + i * (CARD_W + CARD_GAP),
    y: CARD_Y,
    w: CARD_W,
    h: CARD_H,
  };
}

function stillSrc(index: number) {
  const n = Math.min(STILL_COUNT, Math.max(1, index));
  return staticFile(`payoff/${String(n).padStart(3, "0")}.jpg`);
}

/* ---------------------------------------------------------------- clip --- */

export function Athana() {
  const frame = useCurrentFrame();
  /* Freeze the outgoing UI on the last frame before the film, so the
   * dissolve sits on top of a still phase rather than a moving one. */
  const ui = Math.min(frame, FILM_AT - 1);

  const appIn = ramp(ui, APP_IN, DUR.sheet, EASE.out);
  const toFilm = ramp(frame, FILM_AT, DUR.sheet);
  const app =
    Math.min(appIn, 1 - toFilm) * (1 - ramp(frame, OUT_AT, 20, EASE.out));

  const pointer = trackPos(ui, POINTER);
  const down = downAt(ui, CLICKS);

  const focus = ramp(ui, FIELD_CLICK, DUR.chip);
  const text = typed(ui, TYPE_AT, PROMPT);
  const typing = text.length > 0 && text.length < PROMPT.length;

  const menuIn = ramp(ui, SKILL_CLICK, DUR.panel);
  const menuOut = 1 - ramp(ui, CREATE_CLICK - 8, DUR.chip);
  const menu = menuIn * menuOut;

  const skillLit = ramp(ui, SKILL_PICK, DUR.chip);
  const createReady = ramp(ui, SKILL_PICK, DUR.chip);

  const scenesOn = ui >= SCENES_AT;
  const filmOn = frame >= FILM_AT;
  const stillIndex = 1 + Math.min(STILL_COUNT - 1, Math.max(0, frame - FILM_AT));
  const filmPush = ramp(frame, FILM_AT + 8, 140, EASE.out);

  return (
    <AbsoluteFill style={{ background: "var(--ground)" }}>
      {frame < FILM_AT + DUR.sheet && (
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
            title="Athana"
            heading="Create a video"
            sub="Describe anything"
          />

          <div
            style={{
              ...abs(FIELD),
              borderRadius: 16,
              background: "var(--card)",
              border: `1px solid ${mixToken(focus, "var(--border)", "var(--brand)")}`,
              boxShadow: `0 0 0 ${(focus * 3).toFixed(1)}px color-mix(in oklab, var(--brand) 28%, transparent)`,
              padding: "18px 22px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.35,
                minHeight: 60,
                opacity: text ? 1 : 0.45,
              }}
            >
              {text || "Describe the video you want"}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 22,
                  marginLeft: 3,
                  background: "var(--brand)",
                  verticalAlign: -3,
                  opacity: focus > 0.5 && (typing || caretOn(frame)) ? 1 : 0,
                }}
              />
            </div>
          </div>

          <div
            style={{
              ...abs(SKILL_PILL),
              borderRadius: 10,
              border: `1px solid ${mixToken(menuIn, "var(--border)", "var(--brand)")}`,
              background: mixToken(menuIn, "var(--card)", "var(--brand-soft)"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 500,
              transform: `scale(${press(frame, SKILL_CLICK).toFixed(4)})`,
            }}
          >
            Pick a skill
          </div>

          <div
            style={{
              ...abs(CREATE),
              borderRadius: 10,
              background: "var(--brand)",
              color: "var(--brand-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 600,
              opacity: mix(createReady, 0.55, 1),
              transform: `scale(${press(frame, CREATE_CLICK).toFixed(4)})`,
            }}
          >
            {text.trim() ? "Create for free" : "Create"}
          </div>

          <div
            style={{
              ...abs(EMPTY),
              borderRadius: "var(--radius)",
              border: "1px dashed var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity:
                ramp(frame, APP_IN + 6, DUR.sheet) *
                (1 - ramp(frame, SCENES_AT, DUR.chip)) *
                (1 - menu),
            }}
          >
            <Orb size={32} />
            <div style={{ fontSize: 20, color: "var(--muted-foreground)" }}>
              Mira will write the scenes here
            </div>
          </div>

          {menu > 0 && (
            <div
              style={{
                ...abs(MENU),
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--card)",
                padding: 10,
                opacity: menu,
                transform: `translateY(${mix(pop(frame, SKILL_CLICK), 12, 0).toFixed(2)}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                  padding: "6px 10px 10px",
                }}
              >
                What are you making?
              </div>
              {SKILLS.map((skill, i) => {
                const lit = i === LIT_SKILL ? skillLit : 0;
                return (
                  <div
                    key={skill.label}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1px solid ${mixToken(lit, "transparent", "var(--brand)")}`,
                      background: mixToken(lit, "transparent", "var(--brand-soft)"),
                      transform: `scale(${(i === LIT_SKILL ? press(frame, SKILL_PICK, 0.05) : 1).toFixed(4)})`,
                      ...enterAt(frame, SKILL_CLICK + 4, i, { y: 8 }),
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{skill.label}</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--muted-foreground)",
                        marginTop: 2,
                      }}
                    >
                      {skill.blurb}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {scenesOn &&
            SCENES.map((scene, i) => {
              const box = cardBox(i);
              return (
                <div
                  key={scene.n}
                  style={{
                    ...abs(box),
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    overflow: "hidden",
                    ...enterAt(frame, SCENES_AT, i, {
                      dur: DUR.sheet,
                      y: 12,
                      scale: 0.97,
                    }),
                  }}
                >
                  <div style={{ height: 118, overflow: "hidden", position: "relative" }}>
                    <Img
                      src={staticFile(`payoff/scene-${scene.n}.jpg`)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                    />
                  </div>
                  <div style={{ padding: "12px 16px 14px" }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted-foreground)",
                        letterSpacing: 0.4,
                      }}
                    >
                      SCENE {scene.n}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                      {scene.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "var(--muted-foreground)",
                        marginTop: 4,
                      }}
                    >
                      {scene.beat}
                    </div>
                  </div>
                </div>
              );
            })}

          <Cursor x={pointer.x} y={pointer.y} down={down} />
        </AbsoluteFill>
      )}

      {filmOn && (
        <AbsoluteFill
          style={{
            background: "var(--ground)",
            opacity: toFilm * (1 - ramp(frame, OUT_AT, 20, EASE.out)),
          }}
        >
          <div
            style={{
              ...abs(FILM),
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 80px oklch(0 0 0 / 0.45)",
              transform: `scale(${mix(filmPush, 0.96, 1).toFixed(4)})`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={stillSrc(stillIndex)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
