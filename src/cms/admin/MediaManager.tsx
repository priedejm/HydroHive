import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, EyeOff, Play, RotateCcw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../api";
import { composeList, composeSingle, composeVideo, isVideoUrl } from "../compose";
import type { ServerSlot, SlotDef } from "../types";
import { canOptimizeVideo, optimizeVideo } from "./optimizeVideo";
import { optimizeImage } from "./optimizeImage";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,.mp4,.m4v,.mov,.webm";
const MAX_IMAGE_MB = 15;
const MAX_VIDEO_MB = 140;
const ACCENT_BTN = "bg-[color:var(--cms-accent)] text-white hover:bg-[color:var(--cms-accent)] hover:brightness-110";

type Props = {
  slots: Record<string, SlotDef>;
  media: Record<string, ServerSlot>;
  refresh: () => Promise<void>;
};

/** Slots that belong on a page's editor (slot group "Home" matches page "Home", "Site-wide" matches "Site-wide & Contact Info"). */
export function slotsForPage(slots: Record<string, SlotDef>, pageLabel: string): [string, SlotDef][] {
  return Object.entries(slots).filter(([, d]) => d.group === pageLabel || pageLabel.startsWith(d.group));
}

export function MediaManager({ slots, media, refresh }: Props) {
  const groups = new Map<string, [string, SlotDef][]>();
  for (const [id, def] of Object.entries(slots)) {
    const g = groups.get(def.group) ?? [];
    g.push([id, def]);
    groups.set(def.group, g);
  }
  return (
    <div className="space-y-12">
      {[...groups.entries()].map(([group, items]) => (
        <section key={group}>
          <h2 className="mb-4 font-serif text-2xl text-navy">{group}</h2>
          <div className="space-y-4">
            {items.map(([id, def]) => (
              <SlotCard key={id} id={id} def={def} server={media[id]} refresh={refresh} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** "media" = photos and videos (a gallery with `videos: true`). */
type UploadKind = "image" | "video" | "media";

function isVideoFile(f: File) {
  return f.type.startsWith("video/") || /\.(mp4|m4v|mov|webm)$/i.test(f.name);
}

/** The server's real per-file limit in MB (asked once; null = unknown). */
let serverLimit: Promise<number | null> | null = null;
function serverMaxMb(): Promise<number | null> {
  serverLimit ??= api
    .session()
    .then((r) => (r.maxUpload ? Math.floor(r.maxUpload / 1024 / 1024) : null))
    .catch(() => null);
  return serverLimit;
}

const fmtMb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)}MB`;
/** Errors stay on screen long enough to read (uploads can take minutes). */
const showError = (msg: string) => toast.error(msg, { duration: 20000 });

function useUploader(slot: string, kind: UploadKind, refresh: () => Promise<void>) {
  const [progress, setProgress] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [stage, setStage] = useState("Uploading");
  const input = useRef<HTMLInputElement>(null);
  const maxFor = (f: File) => (kind === "video" || (kind === "media" && isVideoFile(f)) ? MAX_VIDEO_MB : MAX_IMAGE_MB);

  const upload = async (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    setLastError(null);
    const fail = (msg: string) => {
      setLastError(msg);
      showError(msg);
    };
    const wrongType = kind !== "image" ? files.filter((f) => !isVideoFile(f) && !f.type.startsWith("image/")) : [];
    if (wrongType.length) {
      fail(`${wrongType.map((f) => f.name).join(", ")}: only photos (JPG, PNG, WebP) and videos (MP4, MOV, WebM) can be uploaded.`);
      return;
    }
    const server = await serverMaxMb();
    const limitFor = (f: File) => Math.min(maxFor(f), server ?? Infinity);
    const tooBigMsg = (f: File) =>
      server !== null && server < maxFor(f)
        ? `${f.name} is ${fmtMb(f.size)} - the web server only accepts files up to ${server}MB. Trim or compress the video, or ask your web host to raise "upload_max_filesize" and "post_max_size".`
        : `${f.name} is ${fmtMb(f.size)} - the limit is ${limitFor(f)}MB. Trim or compress it and try again.`;
    const isVid = (f: File) => kind === "video" || (kind === "media" && isVideoFile(f));
    // Videos and photos get shrunk in the browser first, so only check videos after that.
    // (Photos are checked after too; this only catches videos the browser can't shrink.)
    const optimize = canOptimizeVideo();
    const tooBig = files.filter((f) => isVid(f) && !optimize && f.size > limitFor(f) * 1024 * 1024);
    if (tooBig.length) {
      fail(tooBig.map(tooBigMsg).join(" "));
      return;
    }
    setProgress(0);
    try {
      // One file per request, so several large videos never exceed the server's
      // per-request limit.
      let count = 0;
      for (const [i, original] of files.entries()) {
        const of = files.length > 1 ? ` ${i + 1} of ${files.length}` : "";
        try {
          let f = original;
          if (optimize && isVid(f)) {
            setStage(`Optimizing video${of}`);
            setProgress(0);
            f = await optimizeVideo(f, setProgress);
          } else if (!isVid(f)) {
            setStage(`Preparing photo${of}`);
            f = await optimizeImage(f);
          }
          if (f.size > limitFor(f) * 1024 * 1024) {
            fail(tooBigMsg(f));
            continue;
          }
          setStage(`Uploading${of}`);
          setProgress(0);
          const r = await api.upload(slot, [f], setProgress);
          if (r.errors?.length) fail(r.errors.join(" "));
          count += r.files?.length ?? 0;
        } catch (e) {
          fail(`${original.name}: ${(e as Error).message}`);
        }
      }
      if (count) toast.success(count > 1 ? `${count} files uploaded.` : "Uploaded - it's live now.");
    } finally {
      setProgress(null);
      setStage("Uploading");
      if (input.current) input.current.value = "";
      await refresh();
    }
  };

  const picker = (multiple: boolean) => (
    <input
      ref={input}
      type="file"
      multiple={multiple}
      accept={kind === "video" ? VIDEO_ACCEPT : kind === "media" ? `${IMAGE_ACCEPT},${VIDEO_ACCEPT}` : IMAGE_ACCEPT}
      className="hidden"
      onChange={(e) => upload(e.target.files)}
    />
  );
  const errorNote = lastError && (
    <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {lastError}
    </p>
  );
  const label = progress === null ? "" : `${stage}... ${Math.round(progress * 100)}%`;
  return { progress, label, open: () => input.current?.click(), picker, upload, errorNote };
}

export function SlotCard({ id, def, server, refresh }: { id: string; def: SlotDef; server?: ServerSlot; refresh: () => Promise<void> }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-serif text-xl text-navy">{def.label}</h3>
        {def.hint && <p className="mt-1 text-xs text-navy/55">{def.hint}</p>}
      </div>
      {def.type === "list" ? (
        <ListSlot id={id} def={def} server={server} refresh={refresh} />
      ) : (
        <SingleSlot id={id} def={def} server={server} refresh={refresh} />
      )}
    </div>
  );
}

function DropZone({
  onFiles,
  children,
  disabled,
}: {
  onFiles: (f: FileList | null) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) onFiles(e.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed p-4 transition-colors ${over ? "border-[color:var(--cms-accent)] bg-[color:var(--cms-accent-soft)]" : "border-navy/15 bg-[#f7f8fa]"}`}
    >
      {children}
    </div>
  );
}

function SingleSlot({
  id,
  def,
  server,
  refresh,
}: {
  id: string;
  def: Extract<SlotDef, { type: "single" | "video" }>;
  server?: ServerSlot;
  refresh: () => Promise<void>;
}) {
  const isVideo = def.type === "video";
  const up = useUploader(id, isVideo ? "video" : "image", refresh);
  const [busy, setBusy] = useState(false);
  const uploads = server?.uploads ?? [];
  const uploaded = uploads.length > 0;

  let previewEl: React.ReactNode;
  if (def.type === "video") {
    const v = composeVideo(def, server);
    const src = v.mp4 ?? v.webm;
    previewEl = src ? (
      <video key={src} src={src} muted loop autoPlay playsInline className="aspect-video w-full rounded-lg bg-navy object-cover" />
    ) : null;
  } else {
    const item = composeSingle(def, server);
    previewEl = <img src={item.url} alt="" className="max-h-64 w-full rounded-lg bg-cream object-contain" />;
  }

  const revert = async () => {
    if (!window.confirm("Remove your upload and go back to the original?")) return;
    setBusy(true);
    try {
      for (const u of uploads) await api.deleteMedia(u.url);
      toast.success("Back to the original.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      await refresh();
    }
  };

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        {previewEl}
        <p className="mt-2 text-xs text-navy/55">{uploaded ? `Your upload: ${uploads[uploads.length - 1].name}` : "Original (built into the site)"}</p>
      </div>
      <DropZone onFiles={up.upload} disabled={up.progress !== null}>
        {up.picker(false)}
        <div className="flex h-full flex-col items-start justify-center gap-3">
          <p className="text-sm text-navy/70">Drag a {isVideo ? "video" : "photo"} here, or</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={up.open} disabled={up.progress !== null || busy} className={ACCENT_BTN}>
              <Upload className="size-4" />
              {up.progress !== null ? up.label : `Replace ${isVideo ? "video" : "photo"}`}
            </Button>
            {uploaded && (
              <Button type="button" variant="outline" onClick={revert} disabled={busy || up.progress !== null}>
                <RotateCcw className="size-4" /> Use original
              </Button>
            )}
          </div>
          {up.progress !== null && <ProgressBar value={up.progress} />}
        </div>
        {up.errorNote}
      </DropZone>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy/10">
      <div className="h-full bg-[color:var(--cms-accent)] transition-[width]" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

function ListSlot({
  id,
  def,
  server,
  refresh,
}: {
  id: string;
  def: Extract<SlotDef, { type: "list" }>;
  server?: ServerSlot;
  refresh: () => Promise<void>;
}) {
  const withVideo = !!def.videos;
  const noun = withVideo ? "photos or videos" : "photos";
  const up = useUploader(id, withVideo ? "media" : "image", refresh);
  const [busy, setBusy] = useState(false);
  const items = composeList(def, server);
  const hidden = server?.hidden ?? [];
  const hiddenStatics = def.fallback.filter((f) => hidden.includes(`static_${f.key}`));

  const save = async (order: string[], nextHidden: string[], msg?: string) => {
    setBusy(true);
    try {
      await api.reorder(id, order, nextHidden);
      if (msg) toast.success(msg);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      await refresh();
    }
  };

  const ids = items.map((m) => m.id);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = [...ids];
    [next[i], next[j]] = [next[j], next[i]];
    save(next, hidden);
  };
  const removeItem = async (i: number) => {
    const m = items[i];
    if (m.source === "static") {
      if (!window.confirm("Hide this original photo? You can bring it back any time.")) return;
      save(
        ids.filter((x) => x !== m.id),
        [...hidden, m.id],
        "Photo hidden.",
      );
      return;
    }
    const what = isVideoUrl(m.url) ? "video" : "photo";
    if (!window.confirm(`Delete this ${what} permanently?`)) return;
    setBusy(true);
    try {
      await api.deleteMedia(m.url);
      toast.success(what === "video" ? "Video deleted." : "Photo deleted.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      await refresh();
    }
  };
  const restore = (key: string) => {
    const sid = `static_${key}`;
    save(
      [...ids, sid],
      hidden.filter((h) => h !== sid),
      "Photo restored (added at the end).",
    );
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="text-sm text-navy/60">No {noun} - this section is hidden on the site until you add one.</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m, i) => (
          <figure key={m.id} className="overflow-hidden rounded-xl border border-navy/10 bg-cream">
            <div className="relative aspect-[4/3]">
              {isVideoUrl(m.url) ? (
                <>
                  <video src={m.url} muted playsInline preload="metadata" className="size-full bg-navy object-cover" />
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-navy/80 px-2 py-0.5 text-[11px] text-white">
                    <Play className="size-3" /> Video
                  </span>
                </>
              ) : (
                <img src={m.url} alt="" className="size-full object-cover" loading="lazy" />
              )}
              <span className="absolute left-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[11px] text-white">{i + 1}</span>
            </div>
            <figcaption className="flex items-center justify-between gap-1 p-1.5">
              <div className="flex">
                <Button type="button" variant="ghost" size="icon" title="Move earlier" disabled={busy || i === 0} onClick={() => move(i, -1)}>
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Move later"
                  disabled={busy || i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={busy}
                title={m.source === "static" ? "Hide this original" : "Delete"}
                className="text-red-600 hover:text-red-700"
                onClick={() => removeItem(i)}
              >
                {m.source === "static" ? <EyeOff className="size-4" /> : <Trash2 className="size-4" />}
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>

      <DropZone onFiles={up.upload} disabled={up.progress !== null}>
        {up.picker(true)}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={up.open} disabled={up.progress !== null || busy} className={ACCENT_BTN}>
            <Upload className="size-4" />
            {up.progress !== null ? up.label : withVideo ? "Add photos or videos" : "Add photos"}
          </Button>
          <span className="text-sm text-navy/60">or drag {noun} here (you can pick several at once)</span>
        </div>
        {up.progress !== null && (
          <div className="mt-3">
            <ProgressBar value={up.progress} />
          </div>
        )}
        {up.errorNote}
      </DropZone>

      {hiddenStatics.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-navy/50">Hidden originals</p>
          <div className="flex flex-wrap gap-3">
            {hiddenStatics.map((f) => (
              <div key={f.key} className="w-32 overflow-hidden rounded-lg border border-navy/10 bg-cream opacity-80">
                <img src={f.url} alt="" className="aspect-[4/3] w-full object-cover grayscale" />
                <Button type="button" variant="ghost" size="sm" className="w-full" disabled={busy} onClick={() => restore(f.key)}>
                  <RotateCcw className="size-3.5" /> Restore
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
