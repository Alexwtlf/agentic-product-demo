#!/usr/bin/env node
/**
 * Point the kit at your product's stylesheet and take its real tokens.
 *
 *   node scripts/adopt-theme.mjs                     # find the stylesheet
 *   node scripts/adopt-theme.mjs path/to/globals.css # or name it
 *   node scripts/adopt-theme.mjs --mode=light        # take the light palette
 *   node scripts/adopt-theme.mjs --curves            # also adopt the easings
 *   node scripts/adopt-theme.mjs --dry-run           # report, write nothing
 *
 * WHY THIS EXISTS. src/theme.css ships a placeholder palette and the README
 * asks you to swap it by hand. Almost nobody does, and the ones who do stop at
 * the accent — so the demo comes out in a stranger's greys with one of your
 * colours in it, which reads as less like your product than plain greyscale
 * would. The values are already written down in your stylesheet. This copies
 * them.
 *
 * WHAT IT CANNOT DO. It copies values; it does not link them. Change a token
 * in your app afterwards and this file does not follow — rerun it. That is a
 * real limitation and not a bug: Remotion cannot import a Next/Tailwind
 * stylesheet (it pulls plugins and font files that live on the app's own
 * serving path), so a copy is the only thing on offer. The header written into
 * theme.css records the source and the date so a stale palette is visible
 * rather than silent.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";

/* ------------------------------------------------------------------ args -- */

const args = process.argv.slice(2);
const flag = (name) => args.some((a) => a === `--${name}`);
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const DRY = flag("dry-run");
const CURVES = flag("curves");
const MODE = opt("mode", "auto");
const paths = args.filter((a) => !a.startsWith("--"));

/* Where a product's tokens usually live. Ordered: the more specific a path is
   to a framework, the more likely it is the real one rather than a reset. */
const CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
  "src/app.css",
  "src/index.css",
  "src/styles/index.css",
];

function findStylesheet() {
  if (paths.length) {
    const p = resolve(paths[0]);
    if (!existsSync(p)) fail(`no such file: ${paths[0]}`);
    return p;
  }
  /* The kit is normally a folder inside the product, or a sibling of it, so
     look at this repo first and then one level up. */
  for (const base of [".", ".."]) {
    for (const c of CANDIDATES) {
      const p = resolve(base, c);
      if (existsSync(p) && readFileSync(p, "utf8").includes("--")) return p;
    }
  }
  fail(
    "could not find a stylesheet. Pass one:\n" +
      "  node scripts/adopt-theme.mjs ../src/app/globals.css",
  );
}

function fail(msg) {
  console.error(`\nadopt-theme: ${msg}\n`);
  process.exit(1);
}

/* ----------------------------------------------------------------- parse -- */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Flat list of { selector, body } with braces matched, so an @media block is
 *  returned whole instead of being cut at its first inner `}`. */
function blocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const selector = css.slice(i, brace).trim().split(/[\n;]/).pop().trim();
    let depth = 1;
    let j = brace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}") depth -= 1;
      j += 1;
    }
    out.push({ selector, body: css.slice(brace + 1, j - 1) });
    i = j;
  }
  return out;
}

/** Custom properties declared directly in a block, ignoring nested ones. */
function declarations(body) {
  const flat = body.replace(/\{[\s\S]*?\}/g, "");
  const out = {};
  for (const m of flat.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/** Merge declarations, refusing the one shape that silently destroys a
 *  palette. Tailwind 4 re-exports a theme with `@theme inline { --x: var(--x) }`
 *  so utilities can reach it; that block usually sits BELOW the real
 *  definitions, and a plain Object.assign lets the self-reference overwrite the
 *  colour with a pointer at itself. Measured on a real Tailwind 4 stylesheet:
 *  every easing came back as `var(--ease-out-expo)` and the curve adoption
 *  found nothing at all. A concrete value always beats a pointer. */
function assign(target, incoming) {
  for (const [k, v] of Object.entries(incoming)) {
    const selfRef = new RegExp(`^var\\(\\s*${k}\\s*[,)]`).test(v.trim());
    if (selfRef && target[k]) continue;
    target[k] = v;
  }
  return target;
}

const isRoot = (sel) =>
  /(^|,)\s*(:root|html|@theme[\w\s]*)\s*(,|$)/.test(sel) ||
  sel.startsWith("@theme");
const isDark = (sel) =>
  /\.dark\b/.test(sel) ||
  /\[data-theme=["']?dark/.test(sel) ||
  /prefers-color-scheme:\s*dark/.test(sel);

function collect(css) {
  const light = {};
  const dark = {};
  for (const b of blocks(stripComments(css))) {
    if (b.selector.startsWith("@")) {
      const inner = blocks(b.body);
      const target = isDark(b.selector) ? dark : light;
      if (b.selector.startsWith("@theme")) {
        assign(target, declarations(b.body));
      }
      for (const ib of inner) {
        if (isRoot(ib.selector) || isDark(ib.selector)) {
          assign(
            isDark(b.selector) || isDark(ib.selector) ? dark : light,
            declarations(ib.body),
          );
        }
      }
      continue;
    }
    if (isDark(b.selector)) assign(dark, declarations(b.body));
    else if (isRoot(b.selector)) assign(light, declarations(b.body));
  }
  return { light, dark };
}

/** Tailwind 4 aliases half a theme through `var(--x)`. Resolve within the map
 *  so the kit gets a colour and not a pointer at one that does not exist in
 *  its own stylesheet. */
function resolveVars(map, fallback = {}) {
  const out = { ...map };
  for (let pass = 0; pass < 4; pass += 1) {
    let changed = false;
    for (const [k, v] of Object.entries(out)) {
      const m = /^var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)$/.exec(v.trim());
      if (!m) continue;
      const target = out[m[1]] ?? fallback[m[1]] ?? m[2];
      if (target && target !== v) {
        out[k] = target.trim();
        changed = true;
      }
    }
    if (!changed) break;
  }
  return out;
}

/* --------------------------------------------------------------- mapping -- */

/** Kit token ← the product names that mean the same thing, best first. The
 *  `--color-` forms are Tailwind 4's `@theme` namespace. */
const ALIASES = {
  "--background": ["--background", "--color-background", "--bg", "--page"],
  "--foreground": ["--foreground", "--color-foreground", "--text", "--fg"],
  "--card": ["--card", "--color-card", "--surface", "--panel", "--popover"],
  "--muted": ["--muted", "--color-muted", "--subtle", "--secondary"],
  "--muted-foreground": [
    "--muted-foreground",
    "--color-muted-foreground",
    "--text-muted",
    "--secondary-foreground",
  ],
  "--border": ["--border", "--color-border", "--line", "--outline"],
  "--brand": [
    "--primary",
    "--brand",
    "--accent",
    "--color-primary",
    "--color-brand",
    "--color-accent",
  ],
  "--brand-soft": ["--primary-soft", "--brand-soft", "--accent-soft"],
  "--brand-strong": ["--primary-strong", "--brand-strong", "--accent-strong"],
  "--ground": ["--poster", "--ground", "--backdrop", "--stage"],
  "--radius": ["--radius", "--radius-lg", "--rounded"],
};

function pick(map, kitName) {
  for (const alias of ALIASES[kitName]) {
    if (map[alias]) return { value: map[alias], from: alias };
  }
  return null;
}

/* ------------------------------------------------------- colour notation -- */

/** shadcn and most Tailwind 3 setups store colours as bare channel triplets —
 *  `--background: 0 0% 100%` — and wrap them at every use site with
 *  `hsl(var(--background))`. Copied straight across, those land in this kit as
 *  `color: var(--background)`, which is not a colour at all: the token is
 *  invalid, the declaration is dropped, and the frame renders with the
 *  browser's default instead. It fails silently and it is the single most
 *  likely input this script gets.
 *
 *  So: learn the wrapper the source itself uses, and re-apply it here. */
function detectWrapper(css) {
  for (const fn of ["hsl", "hsla", "rgb", "rgba", "oklch", "lab"]) {
    if (new RegExp(`${fn}\\(\\s*var\\(`).test(css)) return fn;
  }
  return null;
}

const BARE_TRIPLET =
  /^-?[\d.]+(deg|turn|rad)?\s+-?[\d.]+%?\s+-?[\d.]+%?(\s*\/\s*[\d.]+%?)?$/;

const isBareChannels = (v) => BARE_TRIPLET.test(v.trim());

/* ---------------------------------------------------------------- output -- */

const PLACEHOLDER = {
  "--background": "oklch(0.145 0.02 265)",
  "--foreground": "oklch(0.985 0.003 248)",
  "--card": "oklch(0.205 0.025 265)",
  "--muted": "oklch(0.28 0.028 260)",
  "--muted-foreground": "oklch(0.72 0.03 257)",
  "--border": "oklch(0.3 0.03 260)",
  "--brand": "oklch(0.68 0.19 265)",
  "--brand-soft": "oklch(0.32 0.08 265)",
  "--brand-strong": "oklch(0.82 0.14 265)",
  "--ground": "oklch(0.115 0.025 268)",
  "--radius": "14px",
};

const KIT_TOKENS = Object.keys(PLACEHOLDER);

const src = findStylesheet();
const raw = readFileSync(src, "utf8");
const { light: rawLight, dark: rawDark } = collect(raw);

if (!Object.keys(rawLight).length && !Object.keys(rawDark).length) {
  fail(`no custom properties found in ${relative(process.cwd(), src)}`);
}

const light = resolveVars(rawLight);
const dark = resolveVars(rawDark, light);

/* Which palette the kit's :root gets. The stage a demo runs on is dark — the
   title card, the loop seam and the ground all sit there — so a product with a
   dark mode should hand over its dark values. Products without one fall back
   to what they have, and --ground is derived rather than guessed. */
const hasDark = Object.keys(dark).length > 0;
const mode = MODE === "auto" ? (hasDark ? "dark" : "light") : MODE;
if (!["dark", "light"].includes(mode)) fail(`--mode must be dark or light`);
const primary = mode === "dark" ? { ...light, ...dark } : light;

const wrapper = detectWrapper(raw);
let wrapped = 0;

const resolved = {};
const report = [];
for (const kit of KIT_TOKENS) {
  const hit = pick(primary, kit);
  if (hit) {
    let value = hit.value;
    /* --radius is a length, never a colour — wrapping it would produce
       `hsl(1rem)`. Everything else in KIT_TOKENS is a colour. */
    if (kit !== "--radius" && isBareChannels(value)) {
      if (wrapper) {
        value = `${wrapper}(${value})`;
        wrapped += 1;
      } else {
        console.error(
          `adopt-theme: ${hit.from} looks like bare channels (${value}) but the` +
            ` stylesheet never wraps a var() in a colour function, so there is` +
            ` no way to tell hsl from rgb. Copied as-is — check it.`,
        );
      }
    }
    resolved[kit] = value;
    report.push([kit, hit.from, "taken"]);
  } else {
    resolved[kit] = null;
    report.push([kit, "—", "missing"]);
  }
}

/* Derived rather than invented. A product almost never ships soft/strong
   variants of its accent, and a placeholder purple next to a real brand colour
   is worse than a mix of the real one. */
if (!resolved["--brand-soft"] && resolved["--brand"]) {
  resolved["--brand-soft"] =
    `color-mix(in oklab, ${resolved["--brand"]} 30%, ${resolved["--background"] ?? PLACEHOLDER["--background"]})`;
  report.find((r) => r[0] === "--brand-soft")[2] = "derived from --brand";
}
if (!resolved["--brand-strong"] && resolved["--brand"]) {
  resolved["--brand-strong"] =
    `color-mix(in oklab, ${resolved["--brand"]} 70%, white)`;
  report.find((r) => r[0] === "--brand-strong")[2] = "derived from --brand";
}
if (!resolved["--ground"]) {
  const base = resolved["--background"] ?? PLACEHOLDER["--background"];
  resolved["--ground"] = `color-mix(in oklab, ${base} 82%, black)`;
  report.find((r) => r[0] === "--ground")[2] = "derived from --background";
}
for (const kit of KIT_TOKENS) {
  if (!resolved[kit]) {
    resolved[kit] = PLACEHOLDER[kit];
    report.find((r) => r[0] === kit)[2] = "PLACEHOLDER — no match";
  }
}

/* ---------------------------------------------------------------- curves -- */

const easings = [];
for (const [k, v] of Object.entries(primary)) {
  const m = /cubic-bezier\(([^)]+)\)/.exec(v);
  if (m && /ease|curve|transition/.test(k)) {
    const nums = m[1].split(",").map((n) => parseFloat(n.trim()));
    if (nums.length === 4 && nums.every(Number.isFinite)) {
      easings.push({ name: k, nums });
    }
  }
}

/** Which kit curve a product easing should replace. Names are the only signal
 *  available and they are conventional enough to use — but a wrong guess is
 *  visible in every frame, so nothing is rewritten without --curves. */
function slotFor(name) {
  if (/back|overshoot|spring/.test(name)) return "outBack";
  if (/in-?out|inout/.test(name)) return "inOut";
  if (/word|title|type/.test(name)) return "word";
  if (/out/.test(name)) return "out";
  return null;
}

/* ----------------------------------------------------------------- write -- */

const stamp = new Date().toISOString().slice(0, 10);
const rel = relative(resolve("."), src);

const css = `/* Adopted from ${rel} on ${stamp} by scripts/adopt-theme.mjs.
 * Palette: ${mode}.
 *
 * COPIED, NOT LINKED. Remotion cannot import an app stylesheet — it pulls
 * Tailwind plugins and font files that live on the app's own serving path — so
 * these are snapshots. Change a token in the app and this file does not
 * follow. Rerun the script.
 *
 * Hand-edits survive nothing: the next run overwrites this file. Put a
 * deliberate override in a composition, or add an alias to ALIASES in the
 * script so the mapping is right for everyone. */

:root {
${KIT_TOKENS.map((t) => `  ${t}: ${resolved[t]};`).join("\n")}
}

html,
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}
`;

const target = resolve("src/theme.css");
if (!DRY) writeFileSync(target, css);

/* ---------------------------------------------------------------- report -- */

const pad = (s, n) => String(s).padEnd(n);
console.log(`\nsource   ${rel}`);
console.log(`palette  ${mode}${hasDark ? "" : "  (no dark block found)"}`);
console.log(`tokens   ${Object.keys(primary).length} read`);
if (wrapped) {
  console.log(
    `notation ${wrapped} bare channel value(s) wrapped in ${wrapper}() —` +
      ` the source stores colours the shadcn way`,
  );
}
console.log("");
for (const [kit, from, how] of report) {
  const mark = how === "taken" ? "✓" : how.startsWith("PLACEHOLDER") ? "!" : "~";
  console.log(`  ${mark} ${pad(kit, 20)} ${pad(from, 24)} ${how}`);
}

const missing = report.filter((r) => r[2].startsWith("PLACEHOLDER"));
if (missing.length) {
  console.log(
    `\n${missing.length} token(s) fell back to the placeholder palette.`,
  );
  console.log(
    "Add your product's name for them to ALIASES in scripts/adopt-theme.mjs,",
  );
  console.log("or set them by hand knowing the next run overwrites the file.");
}

if (easings.length) {
  console.log(`\neasings found in ${rel}:`);
  for (const e of easings) {
    const slot = slotFor(e.name);
    console.log(
      `  ${pad(e.name, 24)} bezier(${e.nums.join(", ")})` +
        (slot ? `   → EASE.${slot}` : "   → no obvious slot, skipped"),
    );
  }
  if (!CURVES) {
    console.log(
      "\nRerun with --curves to write these into src/motion.ts, or copy them by hand.",
    );
  } else {
    const mpath = resolve("src/motion.ts");
    let m = readFileSync(mpath, "utf8");
    let n = 0;
    for (const e of easings) {
      const slot = slotFor(e.name);
      if (!slot) continue;
      const re = new RegExp(`(\\b${slot}:\\s*bezier\\()[^)]*(\\))`);
      if (re.test(m)) {
        m = m.replace(re, `$1${e.nums.join(", ")}$2`);
        n += 1;
      }
    }
    if (!DRY && n) writeFileSync(mpath, m);
    console.log(`\n${n} curve(s) written into src/motion.ts.`);
  }
}

const face =
  primary["--font-sans"] ??
  primary["--font-family-sans"] ??
  primary["--default-font-family"];
if (face && !face.trim().startsWith("var(")) {
  const first = face.split(",")[0].replace(/["']/g, "").trim();
  console.log(`\ntypeface  ${first}`);
  console.log(
    `  src/fonts.ts loads Geist. If ${first} is in @remotion/google-fonts,`,
  );
  console.log(
    `  swap the import — a fontFamily string alone loads nothing and every`,
  );
  console.log(`  frame silently renders in a system fallback.`);
}

console.log(
  DRY
    ? "\n--dry-run: nothing written.\n"
    : `\nwrote src/theme.css — run 'npm run preview' and look at it.\n`,
);
