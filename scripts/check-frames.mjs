// The gate. Two defects that actually shipped, and were both misdiagnosed
// as encoder problems before they were understood:
//
//  1. Tiled frames. Chromium's GPU compositor occasionally hands Remotion a
//     screenshot where the whole page texture is wrapped, so the frame comes
//     out as a 2x3 grid of itself. It hits isolated frames — a handful out
//     of several hundred, at random — so it reads as a flash rather than as
//     obvious corruption, and it survives every encoder setting you try.
//     Detected by comparing each frame's left half to its right half and
//     flagging frames that match far better than their neighbours do.
//
//  2. Full-frame luminance jumps. A one-frame flip between a light panel
//     and a dark one is a strobe. The loop seam counts: the last frame
//     cutting back to frame 0 happens every time the tile repeats, and it
//     is the one nobody checks.
//
// Wire this into every render script and let it fail the build. Do not
// "fix" a failure by loosening the thresholds below.
//
// Usage: node scripts/check-frames.mjs out/demo.mp4

import { spawnSync } from "node:child_process";
import { readFileSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LOCAL = new URL("../node_modules/ffmpeg-static/ffmpeg", import.meta.url)
  .pathname;
const FFMPEG = existsSync(LOCAL) ? LOCAL : "ffmpeg";

const args = process.argv.slice(2);
/* A standalone clip is watched once, so the last frame never cuts back to the
 * first and the seam is not a defect — it is just where the film ended. Only a
 * clip that loops in a page has to close the circle. The skill splits these
 * two cases; without this flag the gate did not, and failed a launch video for
 * ending somewhere brighter than it started. */
const standalone = args.includes("--standalone");
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: node scripts/check-frames.mjs <video> [--standalone]");
  process.exit(2);
}

const TILE_SPIKE_DB = 3; // how much better than neighbours counts as tiled
const LUMA_JUMP = 25; // Y units, on a 0-255 scale

const dir = mkdtempSync(join(tmpdir(), "checkframes-"));
const tileLog = join(dir, "tile.log");

// ffmpeg reports stream info and filter results on stderr, so both streams
// have to be read back.
function run(args) {
  const r = spawnSync(FFMPEG, args, { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.error) throw r.error;
  return `${r.stdout ?? ""}${r.stderr ?? ""}`;
}

const size = run(["-hide_banner", "-i", file, "-f", "null", "-"]);
const dim = /,\s(\d{2,5})x(\d{2,5})[\s,]/.exec(size);
if (!dim) {
  console.error("could not read dimensions");
  process.exit(2);
}
const w = Number(dim[1]);
const h = Number(dim[2]);
const half = Math.floor(w / 2);

run([
  "-hide_banner",
  "-loglevel",
  "error",
  "-i",
  file,
  "-lavfi",
  `[0:v]split[x][y];[x]crop=${half}:${h}:0:0[l];[y]crop=${half}:${h}:${w - half}:0[r];` +
    `[l][r]psnr=stats_file=${tileLog}`,
  "-f",
  "null",
  "-",
]);

const halves = [];
for (const line of readFileSync(tileLog, "utf8").split("\n")) {
  const n = /(?:^|\s)n:(\d+)/.exec(line);
  const p = /psnr_avg:([0-9.]+|inf)/.exec(line);
  if (n && p) halves[Number(n[1]) - 1] = p[1] === "inf" ? 99 : Number(p[1]);
}

const luma = [];
const contrast = [];
const stats = run([
  "-hide_banner",
  "-loglevel",
  "info",
  "-i",
  file,
  "-vf",
  "signalstats,metadata=print",
  "-f",
  "null",
  "-",
]);
for (const m of stats.matchAll(/lavfi\.signalstats\.YAVG=([0-9.]+)/g))
  luma.push(Number(m[1]));
{
  const lo = [...stats.matchAll(/lavfi\.signalstats\.YMIN=([0-9.]+)/g)].map((m) =>
    Number(m[1]),
  );
  const hi = [...stats.matchAll(/lavfi\.signalstats\.YMAX=([0-9.]+)/g)].map((m) =>
    Number(m[1]),
  );
  for (let i = 0; i < hi.length; i++) contrast.push(hi[i] - (lo[i] ?? 0));
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// A frame that is nearly one flat colour has matching halves by definition,
// so the dissolves in and out of the dark ground would flag forever. Only
// frames with real detail can be judged this way. Measured: tiled frames sit
// at 206-219 of contrast, the dimmest dissolve frame worth keeping sits
// at 71.
const FLAT = 120;

const tiled = [];
for (let i = 0; i < halves.length; i++) {
  if ((contrast[i] ?? 255) < FLAT) continue;
  const lo = Math.max(0, i - 4);
  const hi = Math.min(halves.length, i + 5);
  const around = [];
  for (let j = lo; j < hi; j++)
    if (j !== i && halves[j] !== undefined) around.push(halves[j]);
  if (!around.length) continue;
  const spike = halves[i] - median(around);
  if (spike > TILE_SPIKE_DB) tiled.push({ frame: i, spike: spike.toFixed(1) });
}

const jumps = [];
for (let i = 1; i < luma.length; i++) {
  const d = Math.abs(luma[i] - luma[i - 1]);
  if (d > LUMA_JUMP) jumps.push({ from: i - 1, to: i, jump: d.toFixed(1) });
}
const seam = Math.abs(luma[0] - luma[luma.length - 1]);

console.log(`${luma.length} frames, ${w}x${h}`);
console.log(`\ntiled frames: ${tiled.length ? "" : "none"}`);
for (const t of tiled)
  console.log(`  frame ${t.frame} — halves match +${t.spike} dB vs neighbours`);
console.log(`\nluminance jumps over ${LUMA_JUMP}: ${jumps.length ? "" : "none"}`);
for (const j of jumps)
  console.log(`  frame ${j.from} -> ${j.to}   jump ${j.jump}`);
if (standalone) {
  console.log(
    `\nloop seam: not checked (--standalone) — last frame Y=${luma[luma.length - 1].toFixed(1)}, first Y=${luma[0].toFixed(1)}`,
  );
} else {
  console.log(
    `\nloop seam: frame ${luma.length - 1} Y=${luma[luma.length - 1].toFixed(1)} -> frame 0 ` +
      `Y=${luma[0].toFixed(1)}   jump ${seam.toFixed(1)}${
        seam > LUMA_JUMP ? "  <-- flashes on every loop" : ""
      }`,
  );
}

const bad = tiled.length || jumps.length || (!standalone && seam > LUMA_JUMP);
process.exit(bad ? 1 : 0);
