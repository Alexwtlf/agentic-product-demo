# product-demo-kit

A Remotion kit and an agent skill for silent product demo videos — the muted,
looping clips that show what your software actually does. Put them in a
landing section, in docs, in onboarding, in an app store listing, in a README,
or in a post.

![A product demo rendered with this pipeline](docs/preview.gif)

*Made with this pipeline, for [Athana](https://athana.ai). The example
composition in this repo is a generic one — see [What's in it](#whats-in-it).*

The hard part is not making a video. It is making one that does not look like
a screen recording. This repo is the motion vocabulary, the render pipeline
and the frame gate that got mine there, plus the skill file that makes an AI
agent follow them instead of improvising.

```bash
npm install
npm run studio     # preview at localhost:3000
npm run render     # renders, stitches, and gates the result
```

Node 20+. First render downloads a headless Chromium (~100 MB); if that fails
see [Troubleshooting](#troubleshooting).

---

## What's in it

| | |
| --- | --- |
| `src/motion.ts` | The vocabulary. Curves, durations, stagger, and the helpers that stop states teleporting. Imports nothing. |
| `src/title-card.tsx` | The cold open — words rising out of per-word masks. |
| `src/chrome.tsx` | The fake app window, the pointer, the click beats. |
| `src/compositions/Demo.tsx` | A worked example using every helper. Copy this, change the flow. |
| `scripts/render.sh` | Sequence render → 1536×960 mp4 + poster → gate. |
| `scripts/check-frames.mjs` | The frame gate. See below. |
| `.claude/skills/product-demo/` | The skill: the playbook an agent reads before touching any of it. |

Cursor users: copy `.claude/skills/product-demo/` to `.cursor/skills/`.
Everything else is the same file.

---

## The eight motion rules

These are the difference between a clip that reads as software and one that
reads as a screenshot slideshow. Long form in
`.claude/skills/product-demo/references/motion.md`.

1. **A boolean in a style is a bug.** `on ? "var(--brand)" : "var(--border)"`
   snaps in one frame. Anchor a ramp at the frame the state changes and blend
   the tokens through it.
2. **Never `scale(0)`.** Entrances start at 0.9–0.97 and travel ≤16px. A 40px
   entrance reads as a slide deck.
3. **Counters count.** A number that jumps is the loudest teleport on screen,
   because the eye is already reading it.
4. **Typed text types.** Static copy in a field the flow says is being filled
   reads as a screenshot, and viewers clock it instantly.
5. **Nothing enters as a group.** Two-frame stagger, minimum.
6. **Springs for landing, ramps for travel.** Damping 14 or above, or it
   looks like a toy.
7. **Weight and layout stay stepped.** Tweening `fontSize` reflows the row
   every frame.
8. **One hero beat per phase.** If everything is animated, nothing reads as
   animated.

And the one that is not about motion: **never put a lasting `transform` on
the container that holds the whole UI.** A scale on the app frame resamples
every glyph inside it. Move what is *in* the frame, never the frame.

---

## Making it yours

1. `src/theme.css` — swap the placeholder tokens for your product's. Nothing
   downstream hardcodes a colour.
2. `src/fonts.ts` — swap the face. Note that a `fontFamily` string alone
   loads nothing; if you skip `loadFont()` every frame silently renders in a
   system fallback.
3. `src/motion.ts` — replace the curves with the ones from your own
   stylesheet, so the film moves the way the product does.
4. `src/compositions/Demo.tsx` — replace the flow. Use the real steps of your
   product in the real order, with copy taken from the live UI. A demo that
   walks a flow the product doesn't have proves nothing.

---

## Working with an agent

`.claude/skills/product-demo/SKILL.md` is written to be read by Claude Code,
Cursor, or anything else that loads skill files. It is not documentation with
a YAML header on top — it is a set of refusals. The first section stops the
agent inventing a story before you have told it one, because the failure mode
of "make me a demo video" is a beautiful montage of output that never shows
the product.

If you only take one thing from this repo, take that section.

---

## The frame gate

Renders come back with individual frames corrupted: the page texture wrapped
or mirrored inside an otherwise correct frame. It hits a handful of frames out
of hundreds, at random. At 30fps that does not read as corruption — it reads
as a flicker — and it survives every encoder setting you try, because the
damage is baked into the JPEG before ffmpeg ever sees it.

Remotion's docs recommend [`--concurrency=1`](https://www.remotion.dev/docs/flickering)
for flickering, and `scripts/render.sh` always passes it. But a flag you have
to remember is not a guarantee, and the same clip has a second failure nobody
inspects: the loop seam, where the last frame cuts back to frame 0 every time
the video repeats.

So the render is gated. `scripts/check-frames.mjs` compares every frame's left
half to its right half and flags the ones matching far better than their
neighbours do, then checks full-frame luminance jumps, seam included. The
render script fails on its failure.

```
480 frames, 1536x960

tiled frames: none

luminance jumps over 25: none

loop seam: frame 479 Y=20.0 -> frame 0 Y=20.0   jump 0.0
```

**Known limitation:** frames that are nearly one flat colour have matching
halves by definition, so the detector only judges frames with real contrast
(`FLAT = 120` in the script). On a light, low-contrast UI it will miss
corruption a dark one would catch. Lower the threshold if your product is
pale, and do not raise it to make a failure go away.

---

## How much of this is Remotion

Less than you'd expect, and on purpose.

`src/motion.ts` — the vocabulary, and the part actually worth taking —
**imports nothing at all.** The cubic-bezier solver, the clamped span and the
damped oscillator behind `pop()` are written out in the file. It is pure
functions of a frame number, so it works unchanged under Framer Motion, in a
canvas loop, in React Native, or in a renderer you write yourself.

Remotion appears in three files, as five symbols:

```
src/index.ts        registerRoot
src/Root.tsx        Composition, Sequence, AbsoluteFill, useCurrentFrame
src/title-card.tsx  AbsoluteFill
src/fonts.ts        loadFont, from @remotion/google-fonts
```

What it does for that: bundles the React/TS app, drives a deterministic frame
clock, runs headless Chromium, screenshots each frame, and gives you a Studio
with a scrubbable timeline. The last one is not decoration — most of the work
on a clip is "jump to frame 214, look, adjust," and without a scrubber every
iteration costs a full render.

You *can* replace it. A static server, `puppeteer-core`, a `window.setFrame(n)`
hook and a screenshot loop is about 110 lines. What that version does not give
you is the bundler — so compositions stop being typed React components and go
back to being one hand-written HTML file — plus font-readiness gating, a way
for a component to say "wait, I'm not ready yet", and the preview.

---

## Troubleshooting

**`Timed out after 25000 ms while trying to connect to the browser!`**, with
an empty Chrome log. Almost never a Remotion problem.

- Remotion's bundled Chromium will not launch on older systems — on macOS it
  wants 15 (Sequoia). Point it at an installed Chrome instead:

  ```bash
  export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ```

  `remotion.config.ts` picks that up automatically.

- **If you use `CHROME_PATH`, quit Chrome first.** Launching a second instance
  of an already-running browser hands off to the existing process and exits
  without opening a debugging port. Nothing is logged, because nothing crashed.

**The clip flickers.** Run `scripts/check-frames.mjs` on the mp4 before
touching the encoder — that diagnosis is wrong twice as often as it is right.
Full debugging order in
`.claude/skills/product-demo/references/render.md`.

---

## Licensing — read this before you build on it

**This kit is MIT.** See `LICENSE`.

**Remotion is not.** Remotion is source-available under its own licence:
free for individuals, non-profits, and for-profit companies **up to 3
employees**; larger companies need a paid Company License from
[remotion.pro](https://www.remotion.pro/license). That applies to you as soon
as you `npm install`, regardless of what this repo's licence says. Check
where you land before you ship something commercial on it.

ffmpeg binaries come from `ffmpeg-static` and carry their own terms.

---

## Credits

The motion rules above are a translation of
[Emil Kowalski](https://emilkowal.ski)'s writing and animation skills into the
constraints of a rendered file. Two things do not carry over: Remotion has no
CSS transitions, and `prefers-reduced-motion` is meaningless in an mp4.
Everything else about curves, properties, durations and stagger applies
unchanged, and his material is the best thing to read alongside this.

Built with [Remotion](https://www.remotion.dev).
