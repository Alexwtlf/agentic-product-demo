/* Load the face. For real.
 *
 * The mistake this file exists to prevent: a composition declares
 * `fontFamily: "Geist, Inter, sans-serif"` and stops there. Remotion has no
 * next/font, nothing ever fetches the face, and every frame renders in a
 * system fallback. The demo has never actually been set in the typeface you
 * think you picked, and you will not notice until you put it next to the
 * real product.
 *
 * loadFont() registers the FontFace and holds the render open until it is
 * ready, so no frame can be captured mid-swap.
 *
 * To use your own face: swap the import for any family in
 * @remotion/google-fonts, or see remotion.dev/docs/fonts for a local file.
 */

import { loadFont } from "@remotion/google-fonts/Geist";

export const { fontFamily: FACE } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/** What every composition should put on its root. The fallbacks only
 *  matter if the fetch fails; in a healthy render the face is loaded. */
export const TYPE = `${FACE}, Inter, ui-sans-serif, system-ui, sans-serif`;
