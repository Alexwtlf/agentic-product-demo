# Agentic Product Demo

A Remotion project that renders product demo videos, plus the skill that
governs how they are shot. Compositions are React; output is mp4.

## Read the skill first

**`.claude/skills/product-demo/SKILL.md` before writing or editing any
composition.** It is not documentation — it decides what gets asked, what gets
read instead of asked, and what may not be invented. Skipping it produces a
clip that looks fine and argues nothing.

Not on Claude Code? The file is plain markdown; read it directly.

## Commands

```bash
npm install
npm run adopt ../src/app/globals.css    # take the product's tokens — do this FIRST
npm run studio                          # preview at localhost:3000, scrub the timeline
sh scripts/preview.sh <id>              # stills on every beat + a contact sheet
sh scripts/render.sh <id> [poster-frame] # render → deliver → gate
bash scripts/add-sfx.sh <id>            # sound pass over the finished mp4
node scripts/check-frames.mjs <file>    # the gate on its own
```

`STANDALONE=1` on a clip that plays once — skips the loop-seam check, which
only means something for a clip that repeats in a page.
`DELIVER=1536:864` for 16:9; set it together with the canvas in `Root.tsx`,
never on its own.

## Things that will not be obvious from the code

- **`--concurrency=1` on every render.** Parallel Chromium returns occasional
  frames whose page texture is wrapped. It reads as flicker, it is random, and
  `--gl=swangle` does not fix it. `render.sh` already passes it; do not remove
  it to speed up a render.
- **A phase root needs its own `background`.** Without it the phase is a sheet
  with holes, the previous one shows through, and the frame it unmounts on
  drops every panel at once — a luminance jump the gate fails on.
- **Never put a lasting `transform` on the container holding the whole UI.**
  Scaling the app frame resamples every glyph in it. Move what is inside.
- **`src/motion.ts` imports nothing.** Keep it that way: it is the part of this
  repo worth taking, and a dependency on the renderer ends that.
- **The gate is not optional.** `render.sh` exits non-zero on its failure. Do
  not loosen the thresholds in `check-frames.mjs` to make a render pass. It
  keeps the frame sequence on a failure so the flagged JPEG can be opened.
- **Nothing on screen may be invented.** Not a row, a card, a label, a count
  or a colour. Lists live in a constants module, not in the page — grep a
  visible string back to its definition and use the whole list in its order.
  Light or dark is a property of the screen, not the product, and `--primary`
  is usually not the accent the surface you are drawing actually uses. Arrangement
  and density live in the markup and its classes — read them, do not ask for a
  screenshot.
  Skipping this produces this kit's template with the product's name on it,
  and it renders clean and passes the gate. SKILL.md §1, "read the screen you
  are about to rebuild".
- **Intake is one block of three questions, not an interview** — scope, where
  the clip lives, whether they already know the flow — each with your own
  inference pre-marked as the recommendation. Use `AskUserQuestion` if the
  harness has it. **Length is never one of them**: asked, it is answered
  "short", and the demo rushes the steps it exists to show.
- **The gate cannot see the picture.** It measures half-against-half
  similarity and average luminance, and nothing else. A pointer pressing the
  wrong element, a phase drawn empty, a panel over the header — all pass.
  Run `scripts/preview.sh` and read the contact sheet before a full render.
- **Pointer targets come from a rendered frame, never from the CSS**, and
  every target needs two keys — arrive, then hold to `CLICK + 8`. With one
  key `trackPos` starts easing toward the next target the frame it arrives,
  and the click fires 20 frames into that move. Both halves of this have
  shipped as a cursor visibly missing the button it pressed.

## Layout

`src/motion.ts` vocabulary · `src/title-card.tsx` cold open ·
`src/chrome.tsx` window, cursor, click beats · `src/compositions/` clips ·
`scripts/beats/<id>.txt` sound scores · `.claude/skills/product-demo/` the skill.

## Clips shot against a real product

Keep them local. A composition that needs a company's assets, and those assets,
are gitignored by name — registering one in a tracked `Root.tsx` breaks the
clone for everyone else. `src/compositions/Demo.tsx` is the example that ships.
