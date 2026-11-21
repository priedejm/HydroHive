import type { CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminApp, type AdminConfig } from "@/cms/admin/AdminApp";
import { resolveImage } from "@/cms/SiteData";
import { DEFAULTS } from "@/content/defaults";
import { MEDIA_SLOTS } from "@/content/media";
import { LABELS } from "@/content/labels";

const CONFIG: AdminConfig = {
  siteName: "Hydro Hive",
  defaults: DEFAULTS as unknown as Record<string, unknown>,
  labels: LABELS,
  slots: MEDIA_SLOTS,
  resolveImage,
  accent: "color-mix(in srgb, var(--color-gold) 70%, black)",
  heroSlot: "home-residential",
};

// The shared admin uses `font-serif` for headings; this site has no serif
// font, so point it at the site's display font.
const FONT_VARS = { "--font-serif": "var(--font-display)" } as CSSProperties;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Site Admin | Hydro Hive" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => (
    <div style={FONT_VARS}>
      <AdminApp config={CONFIG} />
    </div>
  ),
});
