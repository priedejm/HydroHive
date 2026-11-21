/**
 * Shrinks a photo in the browser before it is uploaded.
 *
 * Phone photos are 12-48 megapixels and 5-10MB each. A page with a dozen of them is
 * tens of megabytes, and iPhone Safari often leaves such images blank (it limits how
 * much image memory a page may use). Nothing on the site is shown larger than about
 * 1000px wide, so 2000px on the longest side is plenty, even on retina screens.
 *
 * - JPEG output (quality 0.82), except PNGs with transparency (logos), which stay PNG.
 * - GIFs are left alone (they may be animated).
 * - Phone rotation (EXIF) is applied, so photos never end up sideways.
 * - If the browser can't do it, or the result isn't smaller, the original is used.
 */

const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.82;

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
}

/**
 * `sameType`: keep the original format (used when shrinking a photo that is already
 * on the site, so its address - and extension - stays the same).
 */
export async function optimizeImage(file: File, { sameType = false }: { sameType?: boolean } = {}): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    // Already small enough in both pixels and bytes: keep it as is.
    if (scale === 1 && file.size < 700 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const keepPng = file.type === "image/png" && (sameType || hasTransparency(ctx, w, h));
    const type = sameType ? file.type : keepPng ? "image/png" : "image/jpeg";
    if (type === "image/jpeg") {
      // JPEG has no transparency: paint a white background underneath.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
    }
    const blob = await toBlob(canvas, type, type === "image/png" ? undefined : JPEG_QUALITY);
    canvas.width = canvas.height = 0; // free the memory right away (matters on iPhones)
    // (A browser that can't write this format returns a PNG instead - then keep the original.)
    if (!blob || blob.type !== type || blob.size >= file.size) return file;
    if (sameType) return new File([blob], file.name, { type, lastModified: Date.now() });
    const name = `${file.name.replace(/\.[^.]+$/, "") || "photo"}.${keepPng ? "png" : "jpg"}`;
    return new File([blob], name, { type, lastModified: Date.now() });
  } catch (e) {
    console.warn("[cms] photo optimization skipped:", e);
    return file;
  }
}
