import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from "remotion";
import "./theme.css";
import { Demo, DEMO_LEN } from "./compositions/Demo";
import { TITLE_LEN, TitleCard } from "./title-card";

export const FPS = 30;

/* 1600x1000 is 8:5 — a landing-page tile shape, wider than 16:9 is tall.
 * It is delivered at 1536x960 by scripts/render.sh, which is the same
 * aspect and 16-aligned; 1000 % 16 = 8, which costs a partial macroblock
 * row on every frame for nothing. Shoot at 1600, deliver at 1536. */
export const WIDTH = 1600;
export const HEIGHT = 1000;

/**
 * Title card, then the flow.
 *
 * The body is wrapped in a Sequence rather than retimed. Every click beat
 * and pointer keyframe inside a composition is an absolute frame number,
 * and shifting sixty of them by hand is how a cursor ends up clicking six
 * frames after the button it was aiming at. Inside the Sequence the body
 * still sees its own frame 0 where it always did. (hard rule / titles 7)
 *
 * Both layers sit on the same dark ground, so the handover is a dissolve
 * between two states of one field rather than a cut between two lit frames,
 * and the last frame matches frame 0 — which is what keeps the loop seam
 * from strobing every time the tile repeats.
 */
function Clip({
  body,
  name,
  kicker,
}: {
  body: React.ReactNode;
  name: string;
  kicker: string;
}) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "var(--ground)" }}>
      {frame < TITLE_LEN && (
        <TitleCard name={name} kicker={kicker} frame={frame} />
      )}
      <Sequence from={TITLE_LEN}>{body}</Sequence>
    </AbsoluteFill>
  );
}

export function RemotionRoot() {
  return (
    <Composition
      id="demo"
      component={() => (
        <Clip
          body={<Demo />}
          name="Acme Studio"
          kicker="Ask a question, publish the answer"
        />
      )}
      durationInFrames={DEMO_LEN + TITLE_LEN}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
}
