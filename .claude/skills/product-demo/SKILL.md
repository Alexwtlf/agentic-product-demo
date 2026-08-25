---
name: product-demo
description: >-
  Shoot, animate, title and optionally score product demo videos with Remotion
  — for a landing page, docs, onboarding, an app store listing or a social
  post. Use when editing anything under src/compositions/, when the user asks
  for a new demo clip, an intro or an animated title, asks for sound or a
  version for social, says a clip feels dead or looks like a screen recording,
  or reports tiling, flashing or flickering in a rendered video.
---

# Product demo videos

One pipeline, three layers: the **story** (what the clip shows), the
**motion** (how the interface behaves inside the frame), and the **title**
(the two seconds that open it). Reference implementation:
`src/compositions/Demo.tsx` + `src/motion.ts` + `src/title-card.tsx` +
`scripts/render.sh`.

New clips copy that pipeline. Do not invent a second one.

---

## 1. Settle the brief. Read what you can, ask what you can't.

**Do not start a composition until the four things below are settled.** But
*settled* is not the same as *asked* — and asking for what you could have
found yourself is the fastest way to make a person regret starting.

### Read before you ask

If you can reach the product — its repo, its running app, its live site —
**read it and propose the whole plan.** Take the running order from the
marketing site and the screens from the app; neither answers the other's
question, and question 2 below has the measurement showing why. Then put the
plan up and ask for one confirmation.

### Say that describing the flow beats letting you guess

**Tell them this in your first message, in one line.** Reading the product
gives you a *plausible* flow. It cannot give you the right one, because the
code does not record which path converts, which step people get stuck on,
which feature shipped last week and needs the attention, or which screen the
founder is quietly embarrassed by. Only they know that, and most people do not
volunteer it because they assume the agent has it covered.

> If you already know the flow you want — the steps, in order — say it and the
> clip will be much closer to what you have in mind. If not, I'll read your
> product and propose one.

**It is an offer, not a gate.** If they do not answer it, read and propose as
normal; do not ask again. The point is that they were told the option existed
before you spent their time on a plan built from inference.

The same applies to anything else they already know: a line of copy that has
to appear, a screen that must not, a feature that is being deprecated. Invite
it once, up front, then get on with it.

Ask outright only for what is not in the artifact:

- **what the clip is for** — a launch, a section nobody scrolls to, an
  onboarding step. Intent is not in the code.
- **which file the ending shows**, but *only* when the ending is media the
  product generated and the disk offers several with nothing to choose
  between them. An ending that is just the finished screen needs no asset and
  no question — see question 3.

Everything else — what is on screen, which flow, which features, how long —
you can draft, and drafting it is your job. Propose, mark what you inferred,
and be specific about what you would change on a "no". A person correcting a
concrete plan gives you better answers in one line than an interview extracts
in four.

**Never generate an asset to stand in for a payoff**, and never substitute a
lookalike. Proposing a real file that already exists is not inventing; making
a new one is. If the disk is empty, that is the moment to ask.

If they answer in fragments ("dashboard, they filter it, end on the published
report"), that is enough — translate it into keyframes yourself. Never hand
them a form to fill in, and never ask them to mark up the composition.

### What has to be settled, however you get there

#### Question zero: the whole product, or one feature?

Ask it in plain words, not as a taxonomy:

> A demo of the whole product, or a scene about one feature?

**A product demo** strings three to five features into movements on a
through-line. The viewer leaves knowing what the product *is*.

**A feature clip** walks one flow start to finish. The viewer leaves knowing
how to do one thing.

They are not the same clip at different lengths. A product demo cut as a
feature clip shows one capability and hides the rest; a feature clip stretched
into a tour skims four things and teaches none.

#### Then infer where it lives — and say so, don't ask

The answer above predicts the destination almost every time. Take the default,
state it in one line with the plan, and let them correct it with a word:

| they said | assume | which means |
| --- | --- | --- |
| whole product | a **standalone** launch video | plays once after a click. No loop seam to protect, sound is available, up to 90s, may end on a card or a logo |
| one feature | a clip **in a page section** | autoplays, so muted and looping. Seamless (hard rule 5), short enough to survive the fifth repeat, title from the section's heading, rhythm matched to its siblings |

Both crossings are real and both happen — a 42s tour living in a page row, a
feature walkthrough posted as a standalone short. That is why you say which
one you assumed. **What you must not do is assume silently**: a launch film
built as a page loop comes out short, silent and ending exactly where it
started, and nobody names the cause — they just say it feels slight.

**1. What is being made on screen?** One sentence. Not the product feature —
the thing the viewer watches get built. "A revenue report", "a UGC ad for a
supplement brand", "a deploy going out".
*If this is vague the clip becomes a montage of output, which proves the
product can generate something but never shows what the visitor would
actually do.*

**2. What does it walk, in order?**

*Feature demo:* the real steps of the one flow. Paste URL → binder. Pick face
→ lock sheet. Query → filter → publish.

*Product tour:* which features become movements, in what order, and what
carries the viewer between them — a piece of state that survives the cut, a
line of copy, one character who reappears. A tour with no through-line is a
slideshow of screenshots.

Either way the copy comes **from the live product, not invented**.
*Getting this wrong is the only defect that cannot be fixed in the edit.*

> **Read both the site and the app. They answer different questions.**
>
> The **marketing site** tells you *which* features matter and *in what
> order* — the running order of its sections is the company's own ranking of
> what it sells, and its headline is the promise the clip has to keep.
>
> The **app** tells you what those features actually look like: the real
> screens, the real steps, the real copy on the buttons.
>
> Neither alone is enough, and the failure modes are opposite. Build a tour
> from the site and you get a montage of claims with no screens under them.
> Build it from the nav and you tour whatever happens to be in the sidebar —
> Settings, Library, Analytics — while the three things the front page leads
> with go unmentioned. This has been measured: a tour drafted from a sidebar
> alone opened on the product's *third* priority, skipped two of its four
> headline features, and included a screen the front page does not mention.
>
> So: take the running order from the site, take the screens from the app,
> and say which came from where when you propose it.

**3. How does it end?** Usually you already know, and should not ask.

**The default: it ends on the finished thing.** The flow completes and the
last state stays on screen long enough to be read — the report published, the
sheet locked, the short exported. That is drawn by the composition like every
other frame; there is no separate asset and nothing to request. Hold it
2–3 seconds. A clip that cuts the instant the last button is pressed feels
like it was interrupted, and the viewer never sees the thing they were
promised.

Then: a page clip folds back to the dark ground it opened on (hard rule 5); a
standalone one may end on a card, a logo, a CTA.

**The exception, and the only time to ask: when the payoff is media the
product generates** — a rendered video, a generated image, a character. Then
it has to be a **real file that already exists**. Never generate a stand-in
and never substitute a lookalike, because a fabricated payoff misrepresents
the one thing a viewer is actually judging: output quality.

*That case is also where these clips lie. A clip arguing "same face in every
scene" that ends on a different person destroys its own claim in the last
four seconds, and no edit repairs it. If the payoff is generated media, check
that the thing in the ending is the thing from the flow before you shoot.*

### The three with defaults — state your choice, don't ask

Decide these yourself and say what you picked in one line. Only ask if the
user has already shown they care.

- **Title text.** Defaults to the headline of the section the clip sits in,
  with a kicker drawn from its body copy. 2.2s.
- **Length.** Derive it from the flow, never default to it. Budget one step
  at the pace below, add 66 for the title and ~30 for the outro, and set
  `<CLIP>_LEN` to the total.

  | pace | simple step | movement with its own beats |
  | --- | --- | --- |
  | punchy | 70 | 170 |
  | **standard** (default) | **100** | **240** |
  | cinematic | 140 | 330 |

  A *simple step* is one action and its answer — a click, a panel arriving.
  A *movement* has internal beats: a list assembling row by row, a belt
  rotating through seven formats.

  **Show the arithmetic, don't just announce a number.** A number with no
  derivation reads as arbitrary and the user has nothing to push against:

  > Four steps and a reveal, standard pace: 66 + 4×100 + 240 + 30 = 736
  > frames, 24.5s. Say "punchy" for ~18s or "cinematic" for ~32s.

  That line is the whole interaction. **Do not ask which pace they want** —
  pace is taste with no right answer, and offered as a question it gets
  answered "fast", which is how a demo ends up rushing the steps it exists
  to show. State the default, name the alternatives, move on.

  In a page section: a feature demo lands at 14–25s, a product tour at
  35–60s, and clips sharing a row should share a rhythm — match a sibling if
  there is one. Standalone: the ceiling lifts to 90s, because nobody is
  watching it for the fifth time.

  *If the total falls outside the band for the kind you were told,* say so and
  check — usually it means a step was missed or a movement is really two.
- **Where the delight budget goes.** One hero beat per phase. Name which
  element the phase is about and spend it there.

### Then show the shot list, and wait

Before you write a line of a composition, put the beat sheet back in the chat.
Not code — the plan. One line per phase: the frame it starts on, what happens,
and which single element carries that phase.

> ```
> t0    title     "Acme Studio" · "Ask a question, publish the answer"
> 0     query     types "Revenue by channel, last quarter", hits Run
> 96    results   five channel rows stagger in, counter lands on 2,481
> 184   filter    "Paid only" lights, the count re-counts to 312
> 274   publish   press, confirmation springs into the slot
> 380   out       folds back to the dark ground
> ```
> Four steps and a reveal, standard pace: 66 + 4×100 + 240 + 30 = 736 frames,
> 24.5s. Ends on the published report card. Say "punchy" for ~18s.

Then stop and let them read it. This is the only cheap moment left: a wrong
flow costs one message here and a rebuilt composition later, and §1 question 2
is the defect that cannot be fixed in the edit. A correction at this point is
someone moving a line in a list.

Keep it to the phases. Do not list every entrance and colour ramp — a shot
list nobody finishes reading is not a checkpoint, and the point is that they
answer.

### A reshoot skips all of this

Fixing flicker, changing a zoom, recutting an outro on a clip whose plot is
already locked — go straight to work. A new clip or a new story does not
skip it.

---

## 2. What the viewer sees

Two axes, both settled in question zero (§1), and they multiply:

|  | **feature** — one flow | **product** — 3–5 movements |
| --- | --- | --- |
| **in a page section** | 14–25s, loops, muted | 35–60s, loops, muted |
| **standalone** | up to 60s, plays once | up to 90s, plays once |

Shot at 1600×1000, delivered 1536×960 (8:5) by default — a wide tile for a
page. A standalone clip is usually better at 16:9; change the two numbers in
`Root.tsx` and the scale filter in `render.sh` together.

Whichever cell you are in, the viewer watches the thing get made. Not a
teaser, and not a montage of output.

**Length follows the content, not a template.** A clip cut to a fixed length
either rushes its steps or pads them, and both read immediately.

A page clip **has to work with the sound off** — it autoplays, and autoplay
with audio is blocked outright. A standalone clip plays because someone
pressed play, so sound is a real option there; either way it is a second pass
over the finished file (§7), never a dependency of the picture.

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
9. **Lay out to the bottom of the canvas.** Panels sized by habit rather than
   by the frame leave a quarter of the picture empty, and dead space at the
   bottom of a shot reads as a mistake rather than as restraint. Work out
   where content has to end — canvas height minus a margin — and size the
   panels to reach it. At 1600×900 with a 108px header that is about 852.

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
5. **Dark ground, dark loop** — *for a page-section clip.* Start and end on
   the same dark field, or the seam strobes on every repeat. The title card
   makes this free. **A standalone clip is exempt from the seam** and may end
   on a card or a logo; the dissolve rule still holds either way — phases
   cross **over** the frozen outgoing phase, because fading one out onto white
   is a brighter flash than the cut.
6. **Restart a push at the source's own cut.** Find cuts with
   `ffmpeg -vf "select='gt(scene,0.25)'"`.

   ---

   **Rule 5 has a trap, and knowing the rule does not avoid it.** Written as
   above it sounds like advice about easing. It is not: it is about what is
   underneath.

   The construction you will reach for is to fade the outgoing phase out
   while fading the incoming one in. At the midpoint both sit near 50%, the
   ground shows through both, and the seam reads as a dip. Instead, leave the
   outgoing at full opacity and bring the incoming in **over** it.

   Then the part that is easy to miss even after doing that: **the incoming
   phase must actually be opaque.** A phase that draws panels on a
   transparent root is a sheet with holes in it — the old phase shows through
   the gaps, and the frame the old one unmounts on drops all of its panels at
   once. That is a full-frame luminance jump, `check-frames.mjs` fails the
   render, and no amount of easing hides it. Give every phase root its own
   `background`.

   And keep the last phase mounted through whatever follows it. If the film
   holds on a finished state after the flow ends, the phase that drew that
   state has to still be alive, or the hold is an empty screen.

   *All three of these were shipped, in that order, by an agent that had read
   rule 5 first.*
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

## 7. Sound — ask, once the picture is done

**When the render passes, ask whether they want a sound version.** Once, in
one line, and only then — sound is a separate pass over the finished mp4, so
asking earlier just holds up the work.

Ask it as *where the clip is going*, not as "do you want sound":

> The silent clip is done. Autoplaying in a page it has to stay muted —
> browsers block autoplay with audio. Want me to score a second file for
> social / docs, where sound plays on tap?

That framing matters. "Do you want sound?" invites yes, and a yes produces a
file that will not autoplay on the page it was made for. The two outputs are
not alternatives: **the muted mp4 is the deliverable, the scored one is an
extra**, and the silent original is never overwritten.

If they say yes:

```bash
bash scripts/add-sfx.sh <composition-id>     # out/<id>-sound.mp4
```

Beats live in `scripts/beats/<id>.txt` — copy `demo.txt` and score against
the beat-sheet constants at the top of the composition. Frames are written in
**body** coordinates, the same numbers as the constants; the script adds the
title-card offset.

The pass copies the video stream byte for byte (`-c:v copy`), so no frame is
redrawn and the gate does not need re-running.

### The palette

Nine sounds, and each one is chosen by the **level of motion** — the `DUR`
scale in `src/motion.ts` — never by which element it is attached to. Choose by
element and the vocabulary grows without bound and the clip stops sounding
like one thing.

| sound | means | level |
|---|---|---|
| `key` | a character was typed | — |
| `click` | the user pressed something | `DUR.press` |
| `tick` | a state flipped | `DUR.chip` |
| `pop` | an element arrived | `DUR.panel` |
| `swipe` | an element travelled | `DUR.sheet` |
| `whoosh` | **the screen changed, and only that** | phase change |
| `impact` | weight, a landing | `DUR.hero` |
| `riser` | waiting, before an event | — |
| `fold` | everything collapses away | — |

**A single event is always `pitch 1.00`.** Spread of ±6% belongs only inside a
burst of identical repeats sitting close together — eight documents, seven
belt rotations, a typing run. The machine-gun effect comes from density, not
from which sound you picked.

**Score events, not motion.** A counter counting and a bar growing are motion.
Putting a sound on them means a sound on every frame for a second and a half,
after which nothing reads as an event. One hero beat per phase applies to
sound too.

**The defect already made once: `whoosh` on everything.** A whoosh means the
screen changed. Score an element arrival and a list rotation with it as well
and the entire clip sounds identical.

The shipped sounds are synthesised by ffmpeg on first run — placeholders, and
they sound like it. Drop real wavs into `out/sfx/` under the same names and
every timing still holds; Kenney's UI Audio pack is CC0 and needs no
attribution.

---

## 8. Reviewing

Remotion has no CSS transitions and `prefers-reduced-motion` is meaningless
in a rendered file. Everything else the web animation literature says about
curves, properties, durations and stagger applies here unchanged — §3 is a
translation of it, and Emil Kowalski's `animate` / `review-animations`
skills are the best source to read alongside this one.
