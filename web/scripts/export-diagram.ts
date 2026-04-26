/**
 * export-diagram.ts — Puppeteer + ffmpeg pipeline for portfolio diagrams.
 *
 * Usage:
 *   tsx scripts/export-diagram.ts <slug> [duration_s]
 *
 * Example:
 *   tsx scripts/export-diagram.ts copilot-rag 12
 *
 * Assumes Astro dev server is already running at http://localhost:4321.
 *
 * Pipeline:
 *   1. Navigate headless Chrome to /export/<slug>
 *   2. Capture JPEG frames via CDP Page.startScreencast (~30 fps)
 *   3. Encode H.264 MP4 (LinkedIn-friendly: yuv420p, 30fps, 1920×1080) via
 *      bundled ffmpeg-static binary
 *   4. Also produce a small GIF for inline blog embedding
 *
 * Output:
 *   exports/<slug>-<yyyyMMdd-HHmmss>.mp4
 *   exports/<slug>-<yyyyMMdd-HHmmss>.gif
 */
import { spawnSync } from "node:child_process";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";
import ffmpegStatic from "ffmpeg-static";

const SLUG = process.argv[2] ?? "copilot-rag";
const DURATION_S = Number(process.argv[3] ?? 12);
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const URL = `http://localhost:4321/export/${SLUG}`;

const FFMPEG = (ffmpegStatic as unknown as string | null) ?? "ffmpeg";
const FRAMES_DIR = path.resolve("./.export-frames", `${SLUG}-${Date.now()}`);
const OUTPUT_DIR = path.resolve("./exports");

function ts(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function main() {
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`▶ launching headless Chrome…`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      "--hide-scrollbars",
      "--disable-web-security",
      "--no-sandbox",
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT },
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

    console.log(`▶ navigating to ${URL}…`);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 30_000 });

    // Wait for diagram + initial pulse animations to render before capturing.
    await new Promise((r) => setTimeout(r, 500));

    // Begin screencast capture via CDP.
    const client = await page.target().createCDPSession();
    let frameCount = 0;
    const startTime = Date.now();

    client.on("Page.screencastFrame", async (event) => {
      const frameNum = frameCount++;
      const filepath = path.join(FRAMES_DIR, `frame-${String(frameNum).padStart(5, "0")}.jpg`);
      await writeFile(filepath, Buffer.from(event.data, "base64"));
      try {
        await client.send("Page.screencastFrameAck", { sessionId: event.sessionId });
      } catch {}
    });

    console.log(`▶ recording ${DURATION_S}s @ ${FPS} fps…`);
    await client.send("Page.startScreencast", {
      format: "jpeg",
      quality: 92,
      maxWidth: WIDTH,
      maxHeight: HEIGHT,
      everyNthFrame: 1,
    });

    await new Promise((r) => setTimeout(r, DURATION_S * 1000));
    await client.send("Page.stopScreencast");
    const elapsed = (Date.now() - startTime) / 1000;
    console.log(`✓ captured ${frameCount} frames over ${elapsed.toFixed(2)}s`);

    await browser.close();

    // Encode MP4
    const stamp = ts();
    const mp4Path = path.join(OUTPUT_DIR, `${SLUG}-${stamp}.mp4`);
    console.log(`▶ encoding MP4 → ${mp4Path}`);
    const mp4Args = [
      "-y",
      "-framerate", String(FPS),
      "-i", path.join(FRAMES_DIR, "frame-%05d.jpg"),
      "-vf", `scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-r", String(FPS),
      mp4Path,
    ];
    const mp4Res = spawnSync(FFMPEG, mp4Args, { stdio: "inherit" });
    if (mp4Res.status !== 0) throw new Error(`ffmpeg MP4 encode failed: ${mp4Res.status}`);

    // Encode GIF (smaller, blog-friendly)
    const gifPath = path.join(OUTPUT_DIR, `${SLUG}-${stamp}.gif`);
    console.log(`▶ encoding GIF → ${gifPath}`);
    const palettePath = path.join(FRAMES_DIR, "palette.png");
    const paletteRes = spawnSync(
      FFMPEG,
      [
        "-y",
        "-i", mp4Path,
        "-vf", `fps=15,scale=960:-1:flags=lanczos,palettegen`,
        palettePath,
      ],
      { stdio: "inherit" },
    );
    if (paletteRes.status !== 0) throw new Error("ffmpeg palette failed");
    const gifRes = spawnSync(
      FFMPEG,
      [
        "-y",
        "-i", mp4Path,
        "-i", palettePath,
        "-lavfi", `fps=15,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
        gifPath,
      ],
      { stdio: "inherit" },
    );
    if (gifRes.status !== 0) throw new Error("ffmpeg gif failed");

    // Cleanup frames dir
    await rm(FRAMES_DIR, { recursive: true, force: true });

    console.log(`\n✓ done`);
    console.log(`   ${mp4Path}`);
    console.log(`   ${gifPath}`);
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
