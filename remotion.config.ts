import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

/* Studio preview only. Every render goes through scripts/render.sh, which
 * forces --concurrency=1 on the command line and overrides this. See hard
 * rule 1 in the skill for why that is not negotiable. */
Config.setConcurrency(2);

/* Remotion downloads its own Chrome Headless Shell on first render, and on
 * almost every machine that is what you want — it is isolated, versioned
 * with the project, and unaffected by whatever your desktop browser is
 * doing. Leave this alone unless a render will not start at all.
 *
 * The escape hatch, for a machine where the download is blocked or the
 * shell will not launch:
 *
 *   export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
 *
 * If you use it, QUIT CHROME FIRST. Launching a second instance of a
 * browser that is already running hands off to the existing process and
 * exits without opening a debugging port, and the render dies on
 * "Timed out after 25000 ms while trying to connect to the browser" with
 * an empty Chrome log — which looks like anything except the real cause.
 */
if (process.env.CHROME_PATH) {
  Config.setChromeMode("chrome-for-testing");
  Config.setBrowserExecutable(process.env.CHROME_PATH);
}
