---
name: landing-loop
description: >-
  Shoot, animate and title silent product-demo loops with Remotion. Use when
  editing anything under src/compositions/, when the user asks for a new
  landing demo, an intro or an animated title, says a clip feels dead or
  looks like a screen recording, or reports tiling, flashing or flickering
  in a rendered video.
---

# Product-demo loops

One pipeline, three layers: the **story** (what the clip shows), the
**motion** (how the interface behaves inside the frame), and the **title**
(the two seconds that open it). Reference implementation:
`src/compositions/Demo.tsx` + `src/motion.ts` + `src/title-card.tsx` +
`scripts/render.sh`.

New clips copy that pipeline. Do not invent a second one.

---

## 1. Ask first. Always.

**Do not invent the story and do not start a composition until these are
answered in the user's own words.** Ask in the chat and wait. If they answer
in fragments ("dashboard, they filter it, end on the published report"),
that is enough — translate it into keyframes yourself. Never hand them a
form to fill in, and never ask them to mark up the composition.

### The three that block

**1. What is being made on screen?** One sentence. Not the product feature —
the thing the viewer watches get built. "A revenue report", "a UGC ad for a
supplement brand", "a deploy going out".
*If this is vague the clip becomes a montage of output, which proves the
product can generate something but never shows what the visitor would
actually do.*

**2. Which flow does it walk, in order?** The real steps, with copy taken
from the live product, not invented. Paste URL → binder. Pick face → lock
sheet. Query → filter → publish.
*Getting this wrong is the only defect that cannot be fixed in the edit.*

**3. What are the last 4–5 seconds?** The real payoff the flow is building
toward. **If they have a file, they point at it. If they don't, ask which
existing asset to use.** Never generate a stand-in and never substitute a
lookalike.
*This is the question that gets skipped and the one that costs most. A clip
arguing "same face in every scene" that ends on a different person destroys
its own claim — check that the thing in the payoff is the thing from the
flow before you shoot.*

### The three with defaults — state your choice, don't ask

Decide these yourself and say what you picked in one line. Only ask if the
user has already shown they care.

- **Title text.** Defaults to the headline of the section the clip sits in,
  with a kicker drawn from its body copy. 2.2s.
- **Length.** 480 frames — 66 title + 414 flow. Clips in one row should
  share a rhythm; don't change it without a reason.
- **Where the delight budget goes.** One hero beat per phase. Name which
  element the phase is about and spend it there.

### A reshoot skips all of this

Fixing flicker, changing a zoom, recutting an outro on a clip whose plot is
already locked — go straight to work. A new clip or a new story does not
skip it.

---

## 2. What the viewer sees

A 14–22s silent loop at 8:5 (shot 1600×1000, delivered 1536×960, 30fps). It
has to show the **real product flow**, not a reel of output. Silent: it will
autoplay muted in a page, and it must work with no audio at all.

---

## 3. Motion — the interface must not teleport

A clip reads as a screen recording when states snap between frames. Full
vocabulary and rationale: `references/motion.md`. The rules:

1. **A boolean in a style is a bug.** `on ? "var(--brand)" : "var(--border)"`
   snaps. Anchor a ramp at the frame the state changes and pass it through
   `mixToken`.
2. **Never `scale(0)`.** Entrances start at `scale(0.9–0.97)` and travel
   ≤16px. At delivery scale a 40px entrance reads as a slide deck.
3. **Counters count.** A number that jumps is the loudest teleport there is,
   because the eye is already reading it.
4. **Typed text types.** Static copy in a field the flow says is being
   filled reads as a screenshot.
5. **Nothing enters as a group.** 2-frame stagger minimum.
6. **Springs for landing, ramps for travel.** `damping` 14 or above.
7. **Weight and layout stay stepped.** `fontWeight` and `fontSize` cannot
   tween without reflowing the row every frame.
8. **One hero beat per phase.** If everything is animated, nothing reads as
   animated.

Everything comes from `src/motion.ts`. If a curve or duration is missing,
add it there so every clip inherits it — never hand-roll one in a
composition.

---

## 4. Titles — the cold open

Full rationale: `references/titles.md`. The rules:

1. **Words, not letters.** A 15-glyph title per-letter is still arriving at
   frame 30 of a 66-frame card, and boxing each glyph destroys kerning.
   Per-letter only for a 4–5 glyph wordmark.
2. **Mask, never fade.** The word travels out from behind a hard edge —
   `overflow: hidden` on the line box, word at `translateY(110%)`. Do not
   also animate its opacity: fading makes the word visible above the edge it
   is supposed to emerge from, and the mask stops reading.
3. **Never scale type.** See hard rule 3 below; it binds hardest here.
4. **The title leaves before the app arrives**, cross-dissolved on the
   shared dark ground.
5. **Kicker follows, never accompanies.**
6. **Set the font explicitly** — `src/fonts.ts`. A `fontFamily` string alone
   loads nothing and every frame renders in a system fallback.
7. **Shift the body with `<Sequence from={TITLE_LEN}>`**, never by retiming
   clicks and pointer keys by hand.

---

## 5. Hard rules — each one shipped as a visible flash

These are not style. Each was misdiagnosed at least once before it was
understood. Debugging guide: `references/render.md`.

1. **`--concurrency=1` on every sequence render.** Parallel Chromium returns
   isolated frames whose page texture is wrapped — a 2×3 grid of the same
   UI. A handful out of several hundred, so it reads as flicker, and it is
   random. `--gl=swangle` does **not** fix it.
2. **No CSS camera on the chrome.** Do not wrap the title bar, header or
   nav in a lasting `transform: scale()`. *This bans moving the **frame**.
   It does not ban moving what is inside it — see §3.* A click punch is
   allowed: a short bell returning to exactly `1`.
3. **Scale footage, never type.** A slow push on a video panel is a camera
   move. The same push on a UI is shimmering text.
4. **One layer of any given shot.** Hard-cut and unmount rather than fading
   a video in over an editor already playing it.
5. **Dark ground, dark loop.** Start and end on the same dark field. The
   title card makes this free. Phases dissolve **over** the frozen outgoing
   phase — fading a phase out onto white is a brighter flash than the cut.
6. **Restart a push at the source's own cut.** Find cuts with
   `ffmpeg -vf "select='gt(scene,0.25)'"`.
7. **One still per timeline frame.** Never hold 24fps footage as
   every-other-frame in a 30fps comp. Extract 1:1.
8. **Bump the cache-buster on both `src` and `poster`** when you replace a
   clip on a page. A poster without a version sticks.

---

## 6. Render and gate

```bash
sh scripts/render.sh <composition-id> [poster-frame]
```

It renders `--sequence --image-format jpeg --jpeg-quality 90
--concurrency=1`, stitches to 1536×960, writes the mp4 and poster, runs
`check-frames.mjs`, and **fails on its failure**.

`check-frames.mjs` is the regression test for hard rules 1 and 5. Do not
"fix" a fail by loosening the detector.

**Back up the previous mp4 and poster before re-rendering over them.**

---

## 7. Reviewing

Remotion has no CSS transitions and `prefers-reduced-motion` is meaningless
in a rendered file. Everything else the web animation literature says about
curves, properties, durations and stagger applies here unchanged — §3 is a
translation of it, and Emil Kowalski's `animate` / `review-animations`
skills are the best source to read alongside this one.
