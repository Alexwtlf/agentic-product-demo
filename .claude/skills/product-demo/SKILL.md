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

*"Say it, don't ask it" is about the shape of the exchange, not about hiding
the choice.* Offering it as a pre-selected option with the consequence spelled
out is saying it — see "Put it up as one block" below. What is banned is the
open question with no default, which makes them do your work.

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

### Put it up as one block, not as an interview

Everything above is *what* has to be settled. This is *how* to put it, and the
form matters as much as the content: three prose questions in a row read as an
interrogation, and people answer interrogations badly.

**If the harness has a structured question tool — Claude Code's
`AskUserQuestion` — use it.** One block, three questions, each option carrying
a one-line consequence, and **your own inference marked `(Recommended)` and
listed first**. Everywhere else in this section says *state your assumption and
let them correct it with a word*; a pre-selected recommendation is that, done
properly. It is not an interview — it is your plan, pre-filled, one click from
being corrected.

Without such a tool, ask the same three in **one message**, marking which
answer you would take if they say nothing.

**The three, and nothing else:**

| header | question | options |
| --- | --- | --- |
| `Scope` | A demo of the whole product, or a scene about one feature? | **Whole product** — 3–5 features as movements on a through-line; they leave knowing what it *is*. · **One feature** — one flow start to finish; they leave knowing how to do one thing. |
| `Where` | Where does it live? Sets the loop seam, the sound and the length ceiling. | **In a page section** — autoplays, so muted and seamless; 8:5 tile, 14–25s for a feature, 35–60s for a tour. · **Standalone** — plays once, sound is real, up to 90s, may end on a card. |
| `Flow` | Do you already know the steps you want walked? | **No, read my product and propose** — running order from the site, screens from the app. · **Yes, I'll describe them** — fragments are fine: "dashboard, they filter it, end on the published report". |

Mark the recommendation on `Where` from the answer you expect on `Scope` — a
tour is nearly always standalone, a feature clip nearly always a page loop.
Both crossings are real, which is exactly why it is offered rather than
assumed silently.

`Flow` is the §1 invitation in a form people actually answer. Recommend "read
my product" — that is the honest default — but the option to describe it has
to be visible, because the code cannot tell you which path converts or which
screen the founder is embarrassed by.

**Never put length or pace in that block.** Both get answered "short" and
"fast" on reflex, and a demo that rushes the steps it exists to show is the
result. Derive the number, show the arithmetic, name the alternatives — the
section below is how.

**A fourth question only when the ending is media the product generates and
the disk offers several files with nothing to choose between them.** Options
are the real filenames. Never a generated stand-in.

Do not add a question for the title, the pace, the palette or the delight
budget. Those are yours to decide and to say in passing.

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
> 96    results   five channel rows stagger in, the counter lands on 1,940
> 184   filter    "Paid only" lights, three rows dim, the total recounts
> 274   publish   press, the confirmation springs into its slot
> 380   out       folds back to the dark ground
> ```
> Four steps and a hold: 66 for the title, four steps just under the standard
> 100, and 34 to fold out — 480 frames, 16s. Ends on the published report. Say
> "punchy" for ~12s.

That list is `src/compositions/Demo.tsx`, frame for frame. Open it next to this
and every number lines up.

Then stop and let them read it. This is the only cheap moment left: a wrong
flow costs one message here and a rebuilt composition later, and §1 question 2
is the defect that cannot be fixed in the edit. A correction at this point is
someone moving a line in a list.

Keep it to the phases. Do not list every entrance and colour ramp — a shot
list nobody finishes reading is not a checkpoint, and the point is that they
answer.

### Then read the screen you are about to rebuild

The shot list says *what happens*. This decides *what it looks like*, and it is
the step that determines whether someone who uses the product every day
recognises their own software. Skip it and you get this kit's template wearing
the product's name in the title bar: plausible, generic, and not theirs.

**Nothing that appears on screen may be invented.** Not a row, not a card, not
a label, not a count, not a colour. If you cannot find where something on
screen comes from, you have not finished reading — that is not a licence to
write a convincing version.

**First, adopt the palette. It is one command and it is not optional.**

```sh
npm run adopt                          # finds the stylesheet
npm run adopt ../src/app/globals.css   # or point at it
npm run adopt ../src/app/globals.css --curves
```

This rewrites `src/theme.css` from the product's own tokens and, with
`--curves`, copies its `cubic-bezier` easings into `src/motion.ts`. Run it
before you draw anything, and **read the report it prints** — a `!` line means
that token fell back to this kit's placeholder, and a placeholder purple next
to a real brand colour looks less like the product than plain grey would. If
something falls back, find the product's name for it and add it to `ALIASES`
in `scripts/adopt-theme.mjs` rather than hardcoding a hex in a composition.

Two failures to expect. A product whose theme lives in JS rather than CSS —
`tailwind.config.ts`, a `tokens.ts` — gives the script nothing; read the values
and write `src/theme.css` yourself, keeping the kit's token *names*. And a
stylesheet that defines only a light palette: the script says
`no dark block found`, and you then owe the user a sentence about which stage
the clip runs on, because a light app on the dark ground the title card and
the outro sit on is a luminance cliff at both ends.

**Do not skip it because the placeholder palette looks fine.** It does look
fine — it was designed to. That is exactly why demos ship in it.

Then four things to find, in this order.

**1. The screen's own source, and what it actually renders.** Start at the
route and follow the component tree to the end. A route is often a thin
wrapper — `/app/studio/marketing` can turn out to be another workspace opened
with a prop, and the thing you are drawing lives two files away.

**2. The data behind every list on screen.** Rows, cards, chips, steps, tabs
and empty states almost never live in the page. They sit in a constants or
meta module, and that module holds the real names, the real subtitles and the
real order. Take a string you can see and grep it back to where it is defined:

```sh
grep -rn "Brand guidelines" src/ | head
```

Then use the **whole** list, in its order. Drawing five of eight items is the
same defect as inventing five — the viewer counts.

**3. The theme this surface runs in.** Light or dark is a property of the
screen, not of the product: a marketing page and an app shell routinely
disagree, and one product can hold both. A product also usually has more than
one accent — taking `--primary` because it is first in the stylesheet is
exactly how a purple surface comes out green. Read the component and see which
token it reaches for.

**4. The arrangement, out of the markup itself.** Column count, group
headings, the anatomy of a single card — index, title, subtitle, state — and
the order they sit in. This is the part that makes it *their* screen rather
than a screen, and it is the part an agent skips, because reading a component
tree for layout is slower than inventing one that looks reasonable.

It is all there. A grid class carries the column count. Padding, gap and the
type scale carry the density, which is most of why a rebuild looks like a
different product even when every label is right. Nesting carries the grouping.
Read the classes on the elements you are drawing and resolve them — a
`grid-cols-2 gap-4 p-6` with `text-sm text-muted-foreground` under a
`text-lg font-semibold` is a card you can rebuild exactly, and guessing at it
is how eight documents in two columns became five rows in one.

> **The case, and it is this repo's own.** An agent shooting Athana's Marketing
> Studio pulled the button labels out of the code — `Render`,
> `Rendering scene…`, `Describe the shot you want first` — and stopped there.
> It then drew a five-row "Brand binder" it had made up, on a dark ground, in
> the product's green. The real binder is eight documents with their own
> subtitles, sitting in `src/lib/brand-knowledge-meta.ts`; the surface is light;
> and it is purple, because it belongs to Mira and Mira has her own token. All
> three facts were in the repo the agent was already reading. The clip rendered
> clean, passed the gate, and was worthless — the same product's in-house
> pipeline, given the same codebase, had reproduced all of it.

**Do not ask for a screenshot.** Everything a screenshot would tell you is in
the markup, and asking for one is how an agent gives itself permission to skip
step 4. The arrangement is the JSX; the density is the padding, the gap and the
type scale on those elements; the ground and the accent are the classes and the
tokens they resolve to. Read them. It is more work than glancing at a picture
and it is the work.

A screenshot is worth asking for in exactly one case: the screen only exists
once real data is in it and the shape of that data is not in the repo — a chart
of the user's own numbers, a feed of their own posts. Ask for that one screen,
name why, and read the rest.

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
10. **The pointer must land on what it presses, and stop there.** Two
    separate failures, and both have shipped.

    *The coordinate.* Take every target from a rendered frame, never from
    reading the CSS. Estimating a chip's centre off padding and font size put
    the cursor 94px away, on the counter above it — and nothing downstream
    noticed, because the press fires, the state changes and the frame is
    clean. §6 is how you catch it.

    *The hold.* `trackPos` eases from one key straight into the next, so a
    target with a single key starts leaving the frame it arrives on. The
    click beat lands ~20 frames later, by which time the pointer has drifted
    toward its next target — 21px onto the bottom edge of the chip, which
    reads as the cursor missing what it just pressed. **Give every target two
    keys**, the second at `CLICK + 8`, outlasting `press()`. A real pointer
    stops, presses, and only then goes. The drift scales with the distance to
    the next target, so the worst miss is always the beat before the longest
    move — and a target that happens to be followed by a key at the same
    coordinates hides the bug completely, which is why it went unnoticed.

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

## 6. Preview, render, gate

### Look at it before you render it

```bash
sh scripts/preview.sh <composition-id>
```

**Do this before every full render, and read the contact sheet it writes.**
It shoots a still on each beat and again 12 frames later, reading the beat
sheet straight out of the composition. Seconds, against minutes for a render
that hard rule 1 pins to `--concurrency=1`.

This is not the gate and does not overlap with it. `check-frames.mjs` measures
two numbers per frame — half-against-half similarity, and average luminance.
A panel over the header, a phase drawn empty, a counter cut off before it
lands, a pointer pressing the number above the button: none of those move
either quantity. **The gate passes and the clip is still wrong.** Every defect
in that list has shipped from this repo, each one found by rendering a frame
and looking at it.

What to look for, in order: the pointer on the thing it presses (rule 10),
every panel inside the frame and clear of the chrome, no phase drawn empty,
nothing cut off at a panel edge, and the bottom of the canvas doing work
(rule 9).

**Then hold a still next to a screenshot of the real screen.** Same list, same
length, same order? Same grouping and column count? Same ground, light or dark,
and the same accent? This is the check for §1's rebuild step, and it is the
only one that catches a clip which is beautifully animated and not the
product. If nobody can produce a screenshot, that is itself the answer: ask
for one before rendering, not after.

What it cannot see is **time**. A stack of stills says nothing about a rhythm
that drags, a beat that lands early, or a hold that outstays its welcome.
Those only exist in motion, so the finished mp4 still gets watched.

### Render and gate

```bash
sh scripts/render.sh <composition-id> [poster-frame]
```

It renders `--sequence --image-format jpeg --jpeg-quality 90
--concurrency=1`, stitches to 1536×960, writes the mp4 and poster, runs
`check-frames.mjs`, and **fails on its failure**.

`check-frames.mjs` is the regression test for hard rules 1 and 5. Do not
"fix" a fail by loosening the detector.

On a failure the frame sequence is **kept**, and the script prints the path.
That is the point of rendering through stills: open the flagged JPEG and see
whether the grid is already in it, which is what decides whether the encoder
is innocent. `references/render.md` has the order.

**Back up the previous mp4 and poster before re-rendering over them.**

---

## 7. Sound — ask, once the picture is done

**When the render passes, ask whether they want a sound version.** Once, in
one line, and only then — sound is a separate pass over the finished mp4, so
asking earlier just holds up the work.

**Which question you ask depends on where the clip lives** (question zero).

*A clip for a page section.* Ask it as where it is going, never as "do you
want sound":

> The silent clip is done. Autoplaying in a page it has to stay muted —
> browsers block autoplay with audio. Want me to score a second file for
> social / docs, where sound plays on tap?

That framing matters here. "Do you want sound?" invites yes, and a yes
produces a file that will not autoplay on the page it was made for. The two
outputs are not alternatives: the muted mp4 is the deliverable, the scored one
is an extra.

*A standalone clip.* The opposite. Nobody autoplays it, so there is no muting
constraint and the scored file is the one that ships — a launch video posted
silent looks unfinished. Ask plainly, and expect yes:

> Picture is done. Want me to score it? Roughly 30 beats — clicks, panels
> landing, one whoosh per screen change. It runs over the finished file, so
> the picture cannot change.

Either way the silent original is never overwritten.

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
