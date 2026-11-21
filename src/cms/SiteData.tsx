import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULTS, type Content } from "@/content/defaults";
import { MEDIA_SLOTS, STATIC_IMAGES, type MediaSlotId } from "@/content/media";
import { mergeContent } from "./merge";
import { composeList, composeSingle, composeVideo } from "./compose";
import type { ServerSlot, SiteDataPayload, SlotDef } from "./types";

/**
 * Loads /api/get-site-data.php once and exposes the merged content + media to
 * every page. If the endpoint is unreachable (e.g. `vite dev`, where PHP does
 * not run) everything falls back to the bundled defaults, so the site never
 * renders blank.
 */

const CACHE_KEY = "cms-site-data-v1";
const MAX_WAIT_MS = 1200;

type Ctx = {
  content: Content;
  media: Record<string, ServerSlot>;
  /** True once the server copy has arrived (or failed). */
  loaded: boolean;
  /** Was the server reachable? false on `vite dev` without a PHP proxy. */
  online: boolean;
  reload: () => Promise<void>;
};

const SiteDataContext = createContext<Ctx | null>(null);

function readCache(): SiteDataPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SiteDataPayload) : null;
  } catch {
    return null;
  }
}

function writeCache(d: SiteDataPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(d));
  } catch {
    /* storage full or blocked - fine */
  }
}

export async function fetchSiteData(): Promise<SiteDataPayload> {
  const res = await fetch(`/api/get-site-data.php?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.includes("application/json")) throw new Error(`Site data unavailable (${res.status})`);
  const data = (await res.json()) as SiteDataPayload;
  if (!data?.success) throw new Error("Site data unavailable");
  return { success: true, content: data.content ?? {}, media: data.media ?? {} };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteDataPayload | null>(() => (typeof window === "undefined" ? null : readCache()));
  const [loaded, setLoaded] = useState(false);
  const [online, setOnline] = useState(false);
  // Render immediately when we have a cached copy; otherwise wait briefly for
  // the server so visitors don't see old text flash and then change.
  const [ready, setReady] = useState(() => data !== null);

  const reload = useCallback(async () => {
    try {
      const d = await fetchSiteData();
      setData(d);
      setOnline(true);
      writeCache(d);
    } catch {
      setOnline(false);
    } finally {
      setLoaded(true);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), MAX_WAIT_MS);
    reload().finally(() => clearTimeout(t));
    return () => clearTimeout(t);
  }, [reload]);

  const value = useMemo<Ctx>(
    () => ({
      content: mergeContent(DEFAULTS, data?.content),
      media: data?.media ?? {},
      loaded,
      online,
      reload,
    }),
    [data, loaded, online, reload],
  );

  return (
    <SiteDataContext.Provider value={value}>{ready ? children : <div className="min-h-screen" />}</SiteDataContext.Provider>
  );
}

export function useSiteData(): Ctx {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used inside <SiteDataProvider>");
  return ctx;
}

/** All editable text, merged over the bundled defaults. */
export function useContent(): Content {
  return useSiteData().content;
}

function slotDef(slot: MediaSlotId): SlotDef {
  return MEDIA_SLOTS[slot] as SlotDef;
}

/** Ordered URLs for a gallery/list slot (photos, or videos too - check with isVideoUrl). */
export function useMediaList(slot: MediaSlotId): string[] {
  const { media } = useSiteData();
  const def = slotDef(slot);
  if (def.type !== "list") return [];
  return composeList(def, media[slot]).map((m) => m.url);
}

/** URL for a single-image slot (uploaded replacement or the bundled original). */
export function useImage(slot: MediaSlotId): string {
  const { media } = useSiteData();
  const def = slotDef(slot);
  if (def.type !== "single") return "";
  return composeSingle(def, media[slot]).url;
}

/** Sources for a video slot. An uploaded video replaces both bundled formats. */
export function useVideo(slot: MediaSlotId): { webm?: string; mp4?: string } {
  const { media } = useSiteData();
  const def = slotDef(slot);
  if (def.type !== "video") return {};
  const { webm, mp4 } = composeVideo(def, media[slot]);
  return { webm, mp4 };
}

/**
 * Resolves an image value stored inside content (e.g. a team member photo):
 *   "static:<key>"   -> bundled image from STATIC_IMAGES
 *   "/uploads/..."   -> uploaded file
 *   ""               -> "" (caller shows a placeholder)
 */
export function resolveImage(value: string | undefined | null): string {
  if (!value) return "";
  if (value.startsWith("static:")) return STATIC_IMAGES[value.slice(7)] ?? "";
  if (value.startsWith("/uploads/")) return value;
  return "";
}
