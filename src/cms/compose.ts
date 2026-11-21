import type { MediaItem, ServerSlot, SlotDef } from "./types";

/** True for an mp4/mov/webm URL (gallery items can be photos or videos). */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm)([?#]|$)/i.test(url);
}

const EMPTY: ServerSlot = { uploads: [], order: [], hidden: [] };

/**
 * Build the ordered list of items for a "list" slot:
 * bundled images (minus hidden ones) + uploads, sorted by the saved order.
 * Items missing from the saved order are appended (bundled first, then uploads oldest-first).
 */
export function composeList(def: Extract<SlotDef, { type: "list" }>, server?: ServerSlot): MediaItem[] {
  const s = server ?? EMPTY;
  const hidden = new Set(s.hidden ?? []);
  const statics: MediaItem[] = def.fallback
    .filter((f) => !hidden.has(`static_${f.key}`))
    .map((f) => ({ id: `static_${f.key}`, url: f.url, source: "static", name: f.key }));
  const uploads: MediaItem[] = (s.uploads ?? []).map((u) => ({
    id: u.id,
    url: u.url,
    source: "uploaded",
    name: u.name,
    size: u.size,
  }));
  const all = [...statics, ...uploads];
  const order = s.order ?? [];
  if (!order.length) return all;
  const rank = new Map(order.map((id, i) => [id, i]));
  const inOrder = all.filter((m) => rank.has(m.id)).sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
  const rest = all.filter((m) => !rank.has(m.id));
  return [...inOrder, ...rest];
}

/** The newest upload for a single/video slot, if any. */
export function latestUpload(server?: ServerSlot) {
  const ups = server?.uploads ?? [];
  return ups.length ? ups[ups.length - 1] : undefined;
}

export function composeSingle(def: Extract<SlotDef, { type: "single" }>, server?: ServerSlot): MediaItem {
  const up = latestUpload(server);
  if (up) return { id: up.id, url: up.url, source: "uploaded", name: up.name, size: up.size };
  return { id: "static_default", url: def.fallback, source: "static", name: "Original" };
}

export function composeVideo(
  def: Extract<SlotDef, { type: "video" }>,
  server?: ServerSlot,
): { webm?: string; mp4?: string; uploaded: boolean } {
  const up = latestUpload(server);
  if (up) {
    const isWebm = /\.webm$/i.test(up.url);
    return isWebm ? { webm: up.url, uploaded: true } : { mp4: up.url, uploaded: true };
  }
  return { ...def.fallback, uploaded: false };
}
