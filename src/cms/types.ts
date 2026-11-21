/** A bundled image that ships with the site build (can be hidden, never deleted). */
export type StaticItem = { key: string; url: string };

type SlotBase = {
  /** Admin grouping (usually the page name). */
  group: string;
  label: string;
  /** Shown under the label in the admin, e.g. recommended size. */
  hint?: string;
};

export type SlotDef =
  | (SlotBase & { type: "single"; fallback: string })
  /** `videos: true` lets the gallery take mp4/webm videos as well as photos (server slot type "media"). */
  | (SlotBase & { type: "list"; fallback: StaticItem[]; videos?: boolean })
  | (SlotBase & { type: "video"; fallback: { webm?: string; mp4?: string } });

export type SlotType = SlotDef["type"];

/** What get-site-data.php returns for each slot. */
export type ServerUpload = {
  id: string; // "uploaded_<filename>"
  name: string;
  url: string; // "/uploads/<slot>/<filename>"
  size: number;
  modified: number;
};

export type ServerSlot = {
  uploads: ServerUpload[]; // oldest first
  order: string[];
  hidden: string[];
};

export type SiteDataPayload = {
  success: boolean;
  content: unknown;
  media: Record<string, ServerSlot>;
};

/** One resolved item in a list/single slot (used by both site and admin). */
export type MediaItem = {
  id: string;
  url: string;
  source: "uploaded" | "static";
  name: string;
  size?: number;
};
