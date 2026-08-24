# Render, gate and debugging

## If it flickers

Do **not** start with the encoder, B-frames, GOP, or "the preview is lying."
That diagnosis is wrong, and it is wrong in a way that costs a day.

1. Run `check-frames.mjs` on the shipped mp4.
2. **If it flags tiles:** extract that frame from the JPEG sequence
   (`out/<id>-frames/element-NNN.jpeg`). If the JPEG is already a grid, the
   encoder is innocent. Re-render that exact frame with `remotion still`
   (always clean) and compare. Then check the render command still has
   `--concurrency=1`.
3. **If it flags a luminance jump:** name the two phases either side and put
   a dissolve or a shared dark ground between them. Never fade a phase out
   onto empty white.
4. Only after both are clean, look at encode.

A grid seen **only** in an editor's media widget, while `check-frames.mjs`
passes and a `remotion still` of the same frame matches the mp4 (~33 dB), can
be the previewer. Prove it with the detector first.

## If the render will not start

`Timed out after 25000 ms while trying to connect to the browser!` with an
empty Chrome log is almost never a Remotion problem.

- **Using `CHROME_PATH`?** Quit Chrome and try again. A second instance of an
  already-running browser hands off to the existing process and exits without
  ever opening a debugging port. Nothing is logged, because nothing crashed.
- **Not using `CHROME_PATH`?** Don't start. Run
  `npx remotion browser ensure` and let Remotion manage its own Headless
  Shell — it is isolated from your desktop browser and cannot hit the above.

## What check-frames.mjs detects

- **Tiled frames** — compares each frame's left half to its right half and
  flags frames matching far better than their neighbours do, only on frames
  with real contrast.
- **Luminance jumps** over 25 Y units, including the loop seam: the last
  frame cutting back to frame 0, which happens every time the clip repeats.

A clean result reads `tiled frames: none`, `luminance jumps over 25: none`,
`loop seam: … jump 0.0`.

## Encoder settings and why

1536×960 is 8:5 and 16-aligned. 1600×1000 is not (1000 % 16 = 8), which costs
a partial macroblock row on every frame for nothing. Shoot at 1600, deliver
at 1536.

`-bf 0` is kept only so frame-stepping in a scrubber lands on what the
composition drew. It is **not** a fix for a tiling artifact.

`-movflags +faststart` puts the moov atom first so the clip starts playing
before it has finished downloading. On a landing page that is the difference
between a loop and a grey box.

## Using real footage

`<OffthreadVideo>` is the correct component and you should reach for it
first. If it crashes on your machine, Remotion's compositor binary is the
usual cause — it is built against recent macOS and SIGABRTs on older
versions. The workaround is to extract the source to a still sequence and
hold the stills:

```sh
ffmpeg -i source.mp4 \
  -vf "select='between(n,60,189)',scale=540:-1" -vsync 0 -q:v 3 \
  public/stills/%03d.jpg
```

One still per timeline frame, extracted 1:1 — never hold 24fps footage as
every-other-frame in a 30fps comp, which stutters. Taking frames 1:1 runs the
clip 1.25× fast, invisible on handheld or slow footage. Width just above what
the panel needs at delivery scale; there is no point shipping a 720p sequence
for a 506px panel.

Derived stills are build output. Add the directory to `.gitignore`.

## Backups

`out/` is gitignored, and re-rendering overwrites the only copy of a clip.
Back up the mp4 and poster before a re-render you are not sure about.
