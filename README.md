# landing-loops

A Remotion kit and an agent skill for the silent product-demo loops that sit
in landing-page sections — the ones that autoplay muted and are supposed to
show what your product actually does.

The hard part is not making a video. It is making one that does not look like
a screen recording. This repo is the motion vocabulary, the render pipeline
and the flicker detector that got mine there, plus the skill file that makes
an AI agent follow them instead of improvising.

```bash
npm install
npm run studio     # preview at localhost:3000
npm run render     # renders, stitches, and gates the result
```

---

## The bug that started it

A handful of frames out of several hundred came back as a 2×3 grid of the
same UI. Not all of them — five, at random, in a 666-frame clip. At 30fps
that is not visible as corruption. It is visible as a flicker.

I blamed the encoder. I changed the CRF, killed B-frames, forced the GOP,
re-encoded four times, and decided the media preview was lying to me.

It was Chromium. Remotion renders frames in parallel workers, and under GPU
compositing a worker occasionally hands back a screenshot whose page texture
is wrapped. The fix is one flag:

```
--concurrency=1
```

`--gl=swangle` does not fix it. Neither does anything downstream of the
renderer, because by the time ffmpeg sees the frame the damage is already
baked into the JPEG.

So the repo ships a detector. `scripts/check-frames.mjs` compares every
frame's left half to its right half and flags the ones matching far better
than their neighbours do, then checks full-frame luminance jumps including
the loop seam — the last frame cutting back to frame 0, which fires every
time the loop repeats and which nobody thinks to look at. The render script
fails on it.

```
480 frames, 1536x960

tiled frames: none

luminance jumps over 25: none

loop seam: frame 479 Y=20.0 -> frame 0 Y=20.0   jump 0.0
```

---

## What's in it

| | |
| --- | --- |
| `src/motion.ts` | The vocabulary. Curves, durations, stagger, and the helpers that stop states teleporting. |
| `src/title-card.tsx` | The cold open — words rising out of per-word masks. |
| `src/chrome.tsx` | The fake app window, the pointer, the click beats. |
| `src/compositions/Demo.tsx` | A worked example using every helper. Copy this, change the flow. |
| `scripts/render.sh` | Sequence render → 1536×960 mp4 + poster → gate. |
| `scripts/check-frames.mjs` | The detector above. |
| `.claude/skills/landing-loop/` | The skill: the playbook an agent reads before touching any of it. |

Cursor users: copy `.claude/skills/landing-loop/` to `.cursor/skills/`.
Everything else is the same file.

---

## The eight motion rules

These are the difference between a clip that reads as software and one that
reads as a screenshot slideshow. Long form in
`.claude/skills/landing-loop/references/motion.md`.

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

`.claude/skills/landing-loop/SKILL.md` is written to be read by Claude Code,
Cursor, or anything else that loads skill files. It is not documentation with
a YAML header on top — it is a set of refusals. The first section stops the
agent inventing a story before you have told it one, because the failure mode
of "make me a demo video" is a beautiful montage of output that never shows
the product.

If you only take one thing from this repo, take that section.

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

The motion rules in §3 of the skill are a translation of
[Emil Kowalski](https://emilkowal.ski)'s writing and animation skills into
the constraints of a rendered file. Two things do not carry over: Remotion
has no CSS transitions, and `prefers-reduced-motion` is meaningless in an
mp4. Everything else about curves, properties, durations and stagger applies
unchanged, and his material is the best thing to read alongside this.

Built with [Remotion](https://www.remotion.dev).
