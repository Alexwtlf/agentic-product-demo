# Title cards

## Words, not letters — the arithmetic

The request is almost always "letters one by one". For a title of any real
length that is the wrong call.

"AI Film Director" is 15 glyphs. Per-letter at a 2-frame stagger takes 30
frames before the last glyph starts moving, and each glyph's own 15-frame
rise overlaps its neighbours into a ripple. Inside a 66-frame budget there is
no room left for the title to sit still and be read. What the eye gets is a
typewriter — a mechanism, not a title.

Per-word: three words, 3-frame stagger, 15-frame rise. Landed at frame 24,
leaving over a second of stillness. The title reads as one designed object
that assembles.

The second reason, which typographers give first: wrapping each glyph in its
own box **destroys kerning**. "AI" loses its pair spacing and every diagonal
pair opens up. At 92px that is visible.

**Per-letter is permitted only** for a single short word at large size — a
wordmark of four or five glyphs — where kerning can be set by hand.

## Mask, never fade

The word travels out from behind a hard edge: a line box with
`overflow: hidden`, the word inside starting at `translateY(110%)`.

Do **not** also animate the word's opacity. Masking and fading at once cancel
out — the fade makes the word visible above the edge it is supposed to be
emerging from, and what reads is a slide transition again. The mask alone is
the effect. Give every line its own mask box, never one mask around several
lines.

## Borrow the gesture from the product

If the site already animates its headings, port that curve and duration
rather than inventing a second one. A landing page whose hero type arrives
one way and whose demo video arrives another way reads as two designers.

In this kit that curve is `EASE.word` / `DUR.word` — a 0.5s
`cubic-bezier(0.22, 1, 0.36, 1)`. Replace it with yours.

## Sizes at 1600×1000

| Element | Size | Weight | Tracking |
| --- | --- | --- | --- |
| Title | 92px | 700 | -2.5px |
| Kicker | 22px | 500 | 0 |
| Mask line height | 1.06 | | |

Negative tracking is what makes a title look set rather than typed. Most
grotesques at 92px with default tracking read loose and webby.

## Colour

White on `var(--ground)`. A full-strength `--foreground` is too harsh on that
field. One accent only — a short rule under the title, or a mark, not both,
and never a gradient across the letterforms. The kicker sits at reduced
opacity rather than a second grey token.
