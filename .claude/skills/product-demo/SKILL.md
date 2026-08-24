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
**read it and propose the whole plan.** The nav or the sidebar is the product
as its own users see it, and it beats any description someone types into a
chat. Then put the plan up and ask for one confirmation.

Ask outright only for what is not in the artifact:

- **what the clip is for** — a launch, a section nobody scrolls to, an
  onboarding step. Intent is not in the code.
- **which of several plausible payoffs is the real one**, when the assets on
  disk offer more than one and nothing distinguishes them.

Everything else — what is on screen, which flow, which features, how long —
you can draft, and drafting it is your job. Propose, mark what you inferred,
and be specific about what you would change on a "no". A person correcting a
concrete plan gives you better answers in one line than an interview extracts
in four.

**Never generate an asset to stand in for the payoff**, and never substitute a
lookalike. Proposing a real file that already exists is not inventing; making
a new one is. If the disk is empty, that is the moment to ask.

If they answer in fragments ("dashboard, they filter it, end on the published
report"), that is enough — translate it into keyframes yourself. Never hand
them a form to fill in, and never ask them to mark up the composition.

### What has to be settled, however you get there

#### Question zero: one feature, or the whole product?

Settle this first. Every answer below changes shape with it, and it is the one
thing the request almost never says.

**A feature demo** walks one flow start to finish: pick a face → lock the
sheet → render. One story, 14–25s. The viewer leaves knowing how to do one
thing.

**A product tour** strings several features together as movements with a
through-line: read the URL → build the binder → cast the characters → cut the
formats. Three to five movements, 35–60s. The viewer leaves knowing what the
product *is*.

They are not the same clip at different lengths. A tour cut as a feature demo
shows one capability and hides the rest. A feature demo cut as a tour skims
four things and teaches none — which is the montage-of-output failure wearing
a different hat.

If they do not know, ask what the clip has to accomplish: "someone who has
never heard of us should get it" is a tour; "people sign up and don't find
this" is a feature demo.


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

  A feature demo lands at 14–25s and a product tour at 35–60s. *If the total
  falls outside the band for the kind you were told,* say so and check —
  usually it means a step was missed or a movement is really two. Past ~60s
  it stops being a loop for a page section and becomes a launch film, which
  is a different brief and worth confirming before you shoot it. Clips
  sharing a row should share a rhythm, so match a sibling if there is one.
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

One of two clips, at 8:5 (shot 1600×1000, delivered 1536×960, 30fps) — see
question zero in §1:

- a **feature demo**, walking one real flow start to finish, 14–25s;
- a **product tour**, three to five features as movements on a through-line,
  35–60s.

Either way the viewer watches the thing get made. Not a teaser, and not a
montage of output.

**Length follows the content, not a template.** A demo cut to a fixed length
either rushes its steps or pads them, and both read immediately. See §1 for
the arithmetic.

It has to work with the sound off: it will autoplay muted in a page, and
autoplay with audio is blocked outright. Sound, if there is any, is a second
pass — §7.

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
