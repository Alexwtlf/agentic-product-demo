#!/bin/bash
# The sound layer.  bash scripts/add-sfx.sh <composition-id>
#
# Lays UI sound onto an ALREADY RENDERED mp4. Remotion never runs, no frame is
# redrawn: the video stream is copied byte for byte (-c:v copy), so neither
# tiled frames nor luminance jumps can come back and check-frames.mjs does not
# need re-running. One pass, about a second.
#
#   in   out/<id>.mp4          (silent, from render.sh)
#   out  out/<id>-sound.mp4    (next to it — the silent original stays)
#
# Beats live in scripts/beats/<id>.txt, not in this file. See that file for
# the format; you should never have to edit this script to score a new clip.
#
# THE PALETTE. Nine sounds. Each means exactly one thing, and it is chosen by
# the LEVEL OF MOTION (the DUR scale in src/motion.ts), never by which element
# it is attached to. Choose by element and the vocabulary grows without bound
# and the clip stops sounding like one thing:
#
#   key     a character was typed
#   click   the user pressed something          DUR.press
#   tick    a state flipped                     DUR.chip
#   pop     an element arrived                  DUR.panel
#   swipe   an element travelled                DUR.sheet
#   whoosh  THE SCREEN CHANGED — nothing else   phase change
#   impact  weight, a landing                   DUR.hero
#   riser   waiting, before an event
#   fold    everything collapses away
#
# The defect to avoid, because it has already been made once: putting `whoosh`
# on everything. A whoosh means the screen changed. Score an element arrival
# and a belt rotation with it too and the whole clip sounds identical.
set -e
cd "$(dirname "$0")/.."

ID="${1:-demo}"
IN="out/$ID.mp4"
OUT="out/$ID${OUT_SUFFIX:--sound}.mp4"
BEATS_FILE="scripts/beats/$ID.txt"

FFMPEG="node_modules/ffmpeg-static/ffmpeg"
[ -x "$FFMPEG" ] || FFMPEG="ffmpeg"
SFX="out/sfx"
FPS=30

# Frames in the beat file are BODY frames — the same numbers as the beat-sheet
# constants at the top of your composition. The body is wrapped in
# <Sequence from={TITLE_LEN}> in src/Root.tsx, so this script adds the offset.
# Beats on the title card itself are written `t6` and are used as-is.
#
# The original version of this script made you add 66 by hand and called it
# "the only trap here". It is not a trap you should have to remember.
TITLE_OFFSET="${TITLE_OFFSET:-66}"

[ -f "$IN" ] || { echo "no $IN — render it first: sh scripts/render.sh $ID"; exit 1; }
[ -f "$BEATS_FILE" ] || { echo "no $BEATS_FILE — copy scripts/beats/demo.txt and score your clip"; exit 1; }

# Never silently clobber a finished render. out/ is gitignored, so an
# overwritten file is simply gone. FORCE=1 if you mean it.
if [ -f "$OUT" ] && [ "${FORCE:-0}" != "1" ]; then
  echo "$OUT already exists."
  echo "  overwrite:   FORCE=1 bash scripts/add-sfx.sh $ID"
  echo "  write next:  OUT_SUFFIX=-sound-v2 bash scripts/add-sfx.sh $ID"
  exit 1
fi

mkdir -p "$SFX"

# ---------------------------------------------------------------- the sounds
# Synthesised rather than shipped: no binaries in the repo, no licence to
# track, and they regenerate on a clean checkout. They are PLACEHOLDERS and
# they sound like it. Drop real wavs into out/sfx/ with the same names and
# every timing below still holds — Kenney's UI Audio pack is CC0 and needs no
# attribution.
gen() {
  [ -f "$SFX/$1.wav" ] && return
  "$FFMPEG" -y -loglevel error -f lavfi -i "$2" -af "$3" -ar 48000 -ac 1 "$SFX/$1.wav"
}

# Key: dry, lower than a tick, almost all noise. Mechanism, not interface.
gen key \
  "aevalsrc='(0.3*sin(2*PI*1100*t)+0.7*(random(0)-0.5)*2)*exp(-t*270)':d=0.04:s=48000" \
  "bandpass=f=1800:width_type=h:w=2600,volume=1.0"
gen click \
  "aevalsrc='(0.55*sin(2*PI*2100*t)+0.45*(random(0)-0.5)*2)*exp(-t*75)':d=0.10:s=48000" \
  "highpass=f=700,lowpass=f=9000,volume=1.0"
gen tick \
  "aevalsrc='(0.5*sin(2*PI*3200*t)+0.5*(random(0)-0.5)*2)*exp(-t*200)':d=0.05:s=48000" \
  "highpass=f=1500,volume=1.0"
# Pop: a short pitch drop, 700 -> 450 Hz. Tonal rather than noisy, which is
# why it cannot be mistaken for a whoosh even sitting right next to one.
gen pop \
  "aevalsrc='sin(2*PI*(700*t-500*t*t))*exp(-t*24)':d=0.26:s=48000" \
  "lowpass=f=2400,volume=1.0"
# Swipe: half the length of a whoosh and dry — a narrow band around 1.4 kHz.
# This is "travelled", not "changed".
gen swipe \
  "anoisesrc=color=white:duration=0.22:amplitude=0.7:sample_rate=48000" \
  "bandpass=f=1400:width_type=h:w=1300,afade=t=in:d=0.04,afade=t=out:st=0.07:d=0.15,volume=1.6"
# Whoosh: wide, airy, long. SCREEN CHANGE ONLY.
gen whoosh \
  "anoisesrc=color=pink:duration=0.5:amplitude=0.7:sample_rate=48000" \
  "highpass=f=420,lowpass=f=5200,afade=t=in:d=0.18,afade=t=out:st=0.20:d=0.30,volume=1.3"
gen whoosh_soft \
  "anoisesrc=color=pink:duration=0.45:amplitude=0.7:sample_rate=48000" \
  "highpass=f=300,lowpass=f=2400,afade=t=in:d=0.20,afade=t=out:st=0.18:d=0.27,volume=1.2"
gen fold \
  "anoisesrc=color=brown:duration=0.6:amplitude=0.8:sample_rate=48000" \
  "highpass=f=200,lowpass=f=1800,afade=t=in:d=0.45,afade=t=out:st=0.50:d=0.10,volume=1.4"
gen impact \
  "aevalsrc='sin(2*PI*(140*t-35*t*t))*exp(-t*13)':d=0.7:s=48000" \
  "lowpass=f=400,volume=1.0"
gen riser \
  "aevalsrc='(0.35*(random(0)-0.5)*2+0.5*sin(2*PI*(200*t+180*t*t)))*pow(t/0.85,2)':d=0.85:s=48000" \
  "highpass=f=180,lowpass=f=3200,volume=1.0"

# ------------------------------------------------------------- the beat file
# `type <first> <count> <step> <vol>` expands into a run of key hits. Pitch
# walks deterministically so no two adjacent keys are identical — a typing run
# on one pitch is a machine gun.
expand() {
  local at n step vol i p
  while read -r a b c d e; do
    case "$a" in
      ""|"#"*) continue ;;
      type)
        at=$b; n=$c; step=$d; vol=$e
        for ((i = 0; i < n; i++)); do
          p=$(awk -v i="$i" 'BEGIN{printf "%.2f", 0.93+((i*37)%14)/100}')
          echo "$((at + i * step)) key $vol $p type-$((i + 1))"
        done
        ;;
      *) echo "$a $b $c $d $e" ;;
    esac
  done < "$BEATS_FILE"
}

INPUTS=(); FILTER=""; LABELS=""; N=0; USED=""
while read -r FRAME NAME VOL PITCH NOTE; do
  [ -z "$FRAME" ] && continue
  # `t42` = a frame on the title card, used as-is. A bare number is a body
  # frame and gets the title offset added.
  case "$FRAME" in
    t*) ABS="${FRAME#t}" ;;
    *)  ABS=$((FRAME + TITLE_OFFSET)) ;;
  esac
  [ -f "$SFX/$NAME.wav" ] || { echo "unknown sound '$NAME' at frame $FRAME"; exit 1; }
  MS=$(awk -v f="$ABS" -v r="$FPS" 'BEGIN{printf "%d", f/r*1000}')
  N=$((N + 1))
  INPUTS+=(-i "$SFX/$NAME.wav")
  RATE=$(awk -v p="$PITCH" 'BEGIN{printf "%d", 48000*p}')
  # asetrate BEFORE adelay: a pitch shift changes the length of the sample, so
  # the delay has to be applied to the finished sound or the beat drifts.
  FILTER="${FILTER}[$N]asetrate=${RATE},aresample=48000,adelay=${MS}|${MS},volume=${VOL}[a${N}];"
  LABELS="${LABELS}[a${N}]"
  USED="${USED}${NAME}\n"
done <<< "$(expand)"

[ "$N" -gt 0 ] || { echo "$BEATS_FILE has no beats"; exit 1; }

# apad — the track is extended with silence so that -shortest trims it to the
# video rather than the other way round. Without it the clip is cut at the last
# sound, it comes out shorter than it was rendered, and the loop seam moves.
FILTER="${FILTER}${LABELS}amix=inputs=${N}:normalize=0:dropout_transition=0,alimiter=limit=0.9,apad[a]"

"$FFMPEG" -y -loglevel error -i "$IN" "${INPUTS[@]}" \
  -filter_complex "$FILTER" -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 128k -ar 48000 -ac 2 \
  -movflags +faststart -shortest "$OUT"

echo "== $ID: $N beats =="
printf "$USED" | sort | uniq -c | awk '{printf "  %-12s %s\n", $2, $1}'
"$FFMPEG" -hide_banner -i "$OUT" 2>&1 | grep -E "Duration|Stream #0:" | sed 's/^ */  /'
