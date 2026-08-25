#!/bin/sh
# Render one composition to a delivered mp4 + poster, then gate it.
#
#   sh scripts/render.sh <composition-id> [poster-frame]
#
# Every line below that looks arbitrary is load-bearing. Read the comments
# before changing one.
set -e
cd "$(dirname "$0")/.."

ID="${1:-demo}"
# A poster is the first painted pixel of the <video> on a page, and it sits
# there until autoplay kicks in. Pick a frame where the clip is at its
# fullest, not one from a phase that is still assembling.
POSTER_FRAME="${2:-300}"

# Delivery size. Default is the 8:5 page tile that matches the 1600x1000
# canvas. A 16:9 composition ships at 1536:864 — both dimensions stay
# 16-aligned, so no partial macroblock row. Set it alongside the canvas in
# Root.tsx, never on its own.
DELIVER="${DELIVER:-1536:960}"

OUT="out"
FRAMES="$OUT/$ID-frames"

# Prefer the pinned binary. ffmpeg-static is a direct dependency precisely so
# that a render does not depend on whatever ffmpeg a contributor has on PATH.
FFMPEG="node_modules/ffmpeg-static/ffmpeg"
[ -x "$FFMPEG" ] || FFMPEG="ffmpeg"

mkdir -p "$OUT"
rm -rf "$FRAMES"

# --sequence, not a direct mp4. Rendering to stills means a bad frame can be
# opened, looked at and re-rendered on its own, instead of being argued about
# through an encoder.
#
# --concurrency=1 is the important flag. Parallel Chromium workers
# occasionally return a frame whose page texture is wrapped — the frame comes
# out as a 2x3 grid of the same UI. It hits a handful of frames out of
# hundreds, at random, so it reads as flicker and looks like an encoder bug.
# It is not. --gl=swangle does NOT fix it. Serial rendering does.
npx remotion render "$ID" "$FRAMES" --sequence \
  --image-format jpeg --jpeg-quality 90 --concurrency=1

# 1536x960 is the same 8:5 as the 1600x1000 canvas and is 16-aligned, so no
# partial macroblock row. -bf 0 is here only so frame-stepping in a scrubber
# lands on what the composition drew; it is not a fix for tiling.
# Remotion pads the sequence to fit the frame count: three digits under a
# thousand frames, four above. Hardcoding %03d works until the first clip
# that runs past 33 seconds, then ffmpeg reports "could find no file" and
# the render you just waited eight minutes for is gone. Read the width off
# the first file instead.
FIRST=$(ls "$FRAMES" | head -1)
NUM=${FIRST#element-}
NUM=${NUM%.jpeg}
PAD=${#NUM}

"$FFMPEG" -y -framerate 30 -start_number 0 \
  -i "$FRAMES/element-%0${PAD}d.jpeg" \
  -vf "scale=${DELIVER}:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -crf 21 \
  -bf 0 -g 60 \
  -movflags +faststart -an \
  "$OUT/$ID.mp4"

# The poster is a real frame of the clip, not a separate render — so the
# first painted pixel of the <video> is exactly what frame N looks like.
PADDED=$(printf "%0${PAD}d" "$POSTER_FRAME")
cp "$FRAMES/element-$PADDED.jpeg" "$OUT/$ID-poster.jpg"

rm -rf "$FRAMES"
ls -lh "$OUT"

# The gate. Non-zero exit fails the render on purpose: a clip that flickers
# is not a clip you ship and fix later, because you will not see it again
# until someone else does.
node scripts/check-frames.mjs "$OUT/$ID.mp4"

# The gate passed, so the picture is finished — which is the moment the skill
# says to ask about sound, and the moment it is easiest to skip because the
# render just succeeded and there is a file to go and show. A line in a
# document does not survive that; a line in the output the agent has to read
# anyway does.
echo
echo "Picture is done. Sound is a separate pass over this file:"
echo "  bash scripts/add-sfx.sh $ID          # writes $OUT/$ID-sound.mp4"
echo "Ask before scoring it — see section 7 of the skill for which question."
