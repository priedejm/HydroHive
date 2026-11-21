/**
 * Shrinks a video in the browser before it is uploaded, so it loads fast on the site.
 *
 * Phone and drone footage is usually 4K at a very high bitrate (often 50-100MB a minute)
 * and iPhone videos may be HEVC, which some browsers can't play. This re-encodes to
 * a web-friendly MP4:
 *   - H.264 video (plays everywhere), longest side at most 1920px, at most 30fps
 *   - about 5 Mbit/s at 1080p (roughly 35-40MB a minute), less for smaller videos
 *   - AAC audio
 *   - "fast start" (the index is at the front, so playback can begin before the whole file arrives)
 *
 * It uses the browser's own video encoder (WebCodecs, via the mediabunny library, loaded only
 * when needed). If the browser can't do it, or anything goes wrong, the original file is
 * returned unchanged and uploaded as before.
 */

const MAX_SIDE = 1920;
const MAX_FPS = 30;
const BPS_1080P = 5_000_000;
const MIN_BPS = 1_500_000;

export function canOptimizeVideo(): boolean {
  return typeof window !== "undefined" && "VideoEncoder" in window && "VideoDecoder" in window;
}

const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

export async function optimizeVideo(file: File, onProgress?: (fraction: number) => void): Promise<File> {
  if (!canOptimizeVideo()) return file;
  try {
    const mb = await import("mediabunny");
    const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS });
    const track = await input.getPrimaryVideoTrack();
    if (!track) return file;

    const [w, h, codec] = await Promise.all([track.getDisplayWidth(), track.getDisplayHeight(), track.getCodec()]);
    const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
    const width = even(w * scale);
    const height = even(h * scale);
    const bitrate = Math.max(MIN_BPS, Math.round((BPS_1080P * width * height) / (1920 * 1080)));
    const quality = new mb.Quality({ bitrate });

    let fps: number | undefined;
    try {
      const stats = await track.computePacketStats(120);
      if (stats.averagePacketRate > MAX_FPS + 1) fps = MAX_FPS;
    } catch {
      /* frame rate unknown - keep the original */
    }

    if (!(await mb.canEncodeVideo("avc", { width, height, quality }))) return file;

    const output = new mb.Output({
      format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
      target: new mb.BufferTarget(),
    });
    const conversion = await mb.Conversion.init({
      input,
      output,
      tracks: "primary",
      video: { codec: "avc", width, height, fit: "fill", quality, forceTranscode: true, ...(fps ? { frameRate: fps } : {}) },
      // Phone/drone audio is already AAC and is copied as-is; anything else is re-encoded.
      audio: { codec: "aac", quality: new mb.Quality({ bitrate: 128_000 }) },
      showWarnings: false,
    });
    if (!conversion.isValid || conversion.discardedTracks.some((d) => d.track.type === "video")) return file;
    if (onProgress) conversion.onProgress = (p) => onProgress(Math.min(1, Math.max(0, p)));
    await conversion.execute();

    const buffer = output.target.buffer;
    if (!buffer || buffer.byteLength < 1024) return file;
    const name = `${file.name.replace(/\.[^.]+$/, "") || "video"}.mp4`;
    const out = new File([buffer], name, { type: "video/mp4", lastModified: Date.now() });

    // Keep the original only if it was already a web-ready H.264 MP4 and is smaller.
    const originalIsWebReady = codec === "avc" && /\.(mp4|m4v)$/i.test(file.name);
    if (originalIsWebReady && out.size >= file.size) return file;
    return out;
  } catch (e) {
    console.warn("[cms] video optimization skipped:", e);
    return file;
  }
}
