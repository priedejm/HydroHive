import { useState } from "react";
import { toast } from "sonner";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../api";
import type { ServerSlot } from "../types";
import { optimizeImage } from "./optimizeImage";

/** Photos bigger than this get shrunk. */
const LARGE_BYTES = 900 * 1024;
const PHOTO_URL = /^\/uploads\/[a-z0-9-]+\/[A-Za-z0-9._%-]+\.(jpe?g|png|webp)$/i;
const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)}MB`;

/** Every uploaded photo the site uses: gallery/single slots + photos referenced from page text. */
function collectPhotoUrls(media: Record<string, ServerSlot>, content: unknown): string[] {
  const urls = new Set<string>();
  for (const s of Object.values(media)) for (const u of s.uploads ?? []) if (PHOTO_URL.test(u.url)) urls.add(u.url);
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      if (PHOTO_URL.test(v)) urls.add(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(content);
  return [...urls];
}

/**
 * One-click fix for photos uploaded before the admin shrank photos automatically:
 * the browser downloads each large photo, shrinks it (same format, max 2000px) and
 * saves it back under the same address.
 */
export function ShrinkPhotos({ media, content }: { media: Record<string, ServerSlot>; content: unknown }) {
  const [status, setStatus] = useState<string | null>(null);

  const run = async () => {
    const urls = collectPhotoUrls(media, content);
    let before = 0;
    let after = 0;
    let done = 0;
    let failed = 0;
    try {
      setStatus("Checking photos...");
      const large: string[] = [];
      for (const url of urls) {
        try {
          const head = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (head.ok && Number(head.headers.get("content-length") ?? 0) > LARGE_BYTES) large.push(url);
        } catch {
          /* skip unreachable */
        }
      }
      if (!large.length) {
        toast.success("All photos are already a good size.");
        return;
      }
      for (const [i, url] of large.entries()) {
        setStatus(`Shrinking photo ${i + 1} of ${large.length}...`);
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const ext = url.split(".").pop()!.toLowerCase();
          const name = decodeURIComponent(url.split("/").pop()!);
          const original = new File([await res.blob()], name, { type: MIME[ext] });
          const small = await optimizeImage(original, { sameType: true });
          if (small.size >= original.size * 0.9) continue; // not worth it
          await api.replaceMedia(url, small);
          before += original.size;
          after += small.size;
          done++;
        } catch (e) {
          failed++;
          console.warn("[cms] could not shrink", url, e);
        }
      }
      if (done) toast.success(`${done} photo${done > 1 ? "s" : ""} shrunk: ${mb(before)} → ${mb(after)}. They're live now.`, { duration: 15000 });
      else if (!failed) toast.success("All photos are already a good size.");
      if (failed) toast.error(`${failed} photo${failed > 1 ? "s" : ""} couldn't be shrunk. Try again in a moment.`, { duration: 15000 });
    } finally {
      setStatus(null);
    }
  };

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-serif text-lg text-navy">Make photos load faster</h3>
        <p className="mt-1 max-w-xl text-sm text-navy/60">
          New uploads are shrunk automatically. This shrinks large photos that were uploaded earlier (full-size phone
          photos load slowly and can show up blank on iPhones). They stay in the same places on the site.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={run} disabled={status !== null} className="shrink-0">
        <Minimize2 className="size-4" />
        {status ?? "Shrink large photos"}
      </Button>
    </div>
  );
}
