#!/bin/sh
# Look at the picture before spending a full render on it.
#
#   sh scripts/preview.sh <composition-id> [body-frame ...]
#
# Renders a still at each beat and writes a contact sheet next to them. Takes
# seconds; scripts/render.sh takes minutes, because hard rule 1 forces
# --concurrency=1 and there is no way around it.
#
# WHY THIS EXISTS, and why it is not the gate.
#
# check-frames.mjs measures two things per frame: how well the left half of a
# frame matches its right half, and the frame's average luminance. That is all
# it can see. A panel laid over the header, a phase that renders empty, a
# counter cut off before it lands, a cursor pressing a number instead of the
# button next to it — none of those move either quantity, so the gate passes
# and the clip ships wrong.
#
# Every one of those defects has actually shipped here. The cursor pressing
# the counter instead of the chip survived several green renders; it was found
# by rendering the click frame and looking at it. This script is that, made
# repeatable.
#
# So: preview answers "is the picture right", the gate answers "is the file
# intact". Neither substitutes for the other, and neither one catches timing —
# a rhythm that drags or a beat that lands early is only visible in motion, so
# the finished mp4 still gets watched.
set -e
cd "$(dirname "$0")/.."

ID="${1:-demo}"
shift 2>/dev/null || true

# Beats are written in BODY frames, the same numbers as the constants at the
# top of the composition. The body sits inside <Sequence from={TITLE_LEN}>, so
# the offset is added here — same convention as scripts/add-sfx.sh.
TITLE_OFFSET="${TITLE_OFFSET:-66}"

# How long after a beat the phase has finished answering it. A still taken on
# the beat itself shows the click landing; one taken 12 frames later shows what
# the click produced. Both are worth seeing, and they fail differently.
SETTLE="${SETTLE:-12}"

OUT="out/$ID-preview"

# id -> composition file, by the repo's own naming: demo -> Demo.tsx, and
# athana-marketing -> AthanaMarketing.tsx. Case and separators are stripped
# from both sides before comparing, because a composition id is kebab-case in
# Root.tsx while the file that backs it is PascalCase — matching on lowercase
# alone finds the single-word ones and silently misses every other.
norm() { echo "$1" | tr 'A-Z' 'a-z' | tr -cd 'a-z0-9'; }
COMP=""
WANT=$(norm "$ID")
for f in src/compositions/*.tsx; do
  [ "$(norm "$(basename "$f" .tsx)")" = "$WANT" ] && COMP="$f"
done

if [ "$#" -gt 0 ]; then
  BEATS="$*"
elif [ -n "$COMP" ]; then
  # The beat sheet is the unbroken run of `const NAME = <number>;` lines under
  # the "beat sheet" divider. It ends at the first line that is neither that
  # nor blank — in practice `const PROMPT = "..."`, a string. Reading it this
  # way means the preview follows the composition automatically: retime a beat
  # and the frame it is checked at moves with it.
  BEATS=$(awk '
    # Anchored to the divider comment, which starts a line with /*. Matching
    # "beat sheet" anywhere would fire on the docstring above it, which says
    # "read the beat sheet below" — and the block would end on the next line.
    /^\/\*.*beat sheet/ { inblock = 1; next }
    inblock && /^[[:space:]]*$/ { next }
    inblock && /^const [A-Z_0-9]+ = [0-9]+;/ { print $4 + 0; next }
    inblock { exit }
  ' "$COMP" | tr -d ';' | tr '\n' ' ')
fi

[ -n "$BEATS" ] || {
  echo "no beats found for '$ID'. Pass body frames explicitly:"
  echo "  sh scripts/preview.sh $ID 0 96 184 274"
  exit 1
}

# Each beat twice: on it, and once the phase has answered. Deduped and sorted,
# because beats that sit close together otherwise render the same frame twice.
FRAMES=$(for b in $BEATS; do
  echo $((b + TITLE_OFFSET))
  echo $((b + TITLE_OFFSET + SETTLE))
done | sort -n -u)

rm -rf "$OUT"
mkdir -p "$OUT"

echo "$ID: $(echo "$FRAMES" | wc -l | tr -d ' ') stills"
for f in $FRAMES; do
  PADDED=$(printf "%04d" "$f")
  npx remotion still "$ID" "$OUT/f$PADDED.png" --frame="$f" --log=error
  printf "  frame %s\n" "$PADDED"
done

# One contact sheet, so the whole clip can be taken in — or handed to an agent
# — as a single image instead of twenty files. The individual stills stay for
# anything that needs looking at closely.
FFMPEG="node_modules/ffmpeg-static/ffmpeg"
[ -x "$FFMPEG" ] || FFMPEG="ffmpeg"
COUNT=$(echo "$FRAMES" | wc -l | tr -d ' ')
COLS=4
ROWS=$(( (COUNT + COLS - 1) / COLS ))
"$FFMPEG" -y -loglevel error -pattern_type glob -i "$OUT/f*.png" \
  -vf "scale=480:-1,tile=${COLS}x${ROWS}:padding=6:margin=6:color=0x111118" \
  -frames:v 1 "$OUT/contact.jpg"

echo
echo "  $OUT/contact.jpg   (reading order: left to right, top to bottom)"
echo "  $OUT/f<frame>.png  (one per frame above)"
echo
echo "Look for: the pointer on the thing it presses, panels inside the frame,"
echo "no phase drawn empty, nothing cut off. Then render."
