/**
 * Every swappable image on the site.
 *
 * !! KEEP IN SYNC with public/api/_slots.php - the server only accepts uploads
 * !! for slot ids listed there (that list is the security allow-list).
 *
 * Types:
 *   single - one image; an upload replaces the bundled original
 *   list   - a gallery; client can add, delete, hide originals and reorder.
 *            `videos: true` also accepts mp4/webm (server type "media")
 *   video  - one background video (mp4 or webm); an upload replaces the original
 *            (none on this site yet)
 *
 * `group` must match a page label in labels.ts so the photo shows on that
 * page's editor too.
 *
 * Images that belong to a text record (team portraits, before/after pairs) are
 * NOT slots - they live in the content itself as "static:<key>" or an
 * "/uploads/content/..." URL. STATIC_IMAGES below maps those keys.
 */
import type { SlotDef } from "@/cms/types";

import logo from "@/assets/hydro-hive-logo.svg";
import wordmark from "@/assets/hydro-hive-bee-wordmark.svg";
import benPhoto from "@/assets/Ben.png";
import natePhoto from "@/assets/Nate.png";
import chaseBank from "@/assets/ChaseBank.png";
import church from "@/assets/Church.png";
import aptCommercial from "@/assets/aptCommercial.jpeg";
import aptCommercial2 from "@/assets/aptCommercial2.jpeg";
import aptCommercialHallway from "@/assets/aptCommercialHallway.jpeg";
import before1 from "@/assets/before1.jpeg";
import after1 from "@/assets/after1.jpeg";
import before2 from "@/assets/before2.webp";
import after2 from "@/assets/after2.jpeg";
import before3 from "@/assets/before3.webp";
import after3 from "@/assets/after3.webp";
import before4 from "@/assets/before4.webp";
import after4 from "@/assets/after4.jpeg";
import powerWashingSideofHouse from "@/assets/powerWashingSideofHouse.jpg";
import dockFinal from "@/assets/dockFinal.png";
import droneFlying from "@/assets/droneFlying.jpeg";
import dronFlying2 from "@/assets/dronFlying2.jpeg";
import working from "@/assets/working.jpg";
import chimneyBefore from "@/assets/chimneyBefore.jpg";
import chimneyAfter from "@/assets/chimneyAfter.jpg";
import edgingBefore from "@/assets/edgingBefore.jpg";
import edgingAfter from "@/assets/edgingAfter.jpg";
import porchBefore from "@/assets/porchBefore.jpg";
import porchAfter from "@/assets/porchAfter.jpg";

/** Bundled images referenced from content as "static:<key>". */
export const STATIC_IMAGES: Record<string, string> = {
  ben: benPhoto,
  nate: natePhoto,
  before1,
  after1,
  before2,
  after2,
  before3,
  after3,
  before4,
  after4,
  chimneyBefore,
  chimneyAfter,
  edgingBefore,
  edgingAfter,
  porchBefore,
  porchAfter,
};

const PHOTO_HINT = "JPG, PNG or WebP. Landscape photos around 1600px wide work best.";
const LOGO_HINT = "PNG with a transparent background works best (SVG uploads are not allowed).";

export const MEDIA_SLOTS = {
  // Site-wide
  "site-logo": {
    group: "Site-wide & Contact Info",
    type: "single",
    label: "Logo in the top menu bar",
    hint: LOGO_HINT,
    fallback: logo,
  },
  "footer-logo": {
    group: "Site-wide & Contact Info",
    type: "single",
    label: "Logo in the footer",
    hint: LOGO_HINT,
    fallback: wordmark,
  },

  // Home
  "home-residential": {
    group: "Home",
    type: "single",
    label: "Residential card photo",
    hint: PHOTO_HINT,
    fallback: powerWashingSideofHouse,
  },
  "home-commercial": {
    group: "Home",
    type: "single",
    label: "Commercial card photo",
    hint: PHOTO_HINT,
    fallback: aptCommercial2,
  },
  "home-dock": {
    group: "Home",
    type: "single",
    label: "Docks card photo",
    hint: PHOTO_HINT,
    fallback: dockFinal,
  },
  "home-drone": {
    group: "Home",
    type: "single",
    label: "Drone section photo",
    hint: "Portrait (taller than wide) photos work best.",
    fallback: dronFlying2,
  },

  // Service pages
  "residential-photo": {
    group: "Residential",
    type: "single",
    label: "Main photo",
    hint: "Also used on the Services page. " + PHOTO_HINT,
    fallback: powerWashingSideofHouse,
  },
  "residential-gallery": {
    group: "Residential",
    type: "list",
    label: "Recent residential work (photos & videos)",
    hint: "Photos and videos (MP4, MOV or WebM, up to 140MB each). Shown three across, newest at the end - use the arrows to reorder. The section stays hidden until you add something.",
    videos: true,
    fallback: [],
  },
  "commercial-photo": {
    group: "Commercial",
    type: "single",
    label: "Main photo",
    hint: "Also used on the Services page. " + PHOTO_HINT,
    fallback: aptCommercial,
  },
  "commercial-gallery": {
    group: "Commercial",
    type: "list",
    label: "Recent commercial work (photos & videos)",
    hint: "Photos and videos (MP4, MOV or WebM, up to 140MB each). Shown three across; portrait (taller than wide) works best.",
    videos: true,
    fallback: [
      { key: "aptCommercialHallway", url: aptCommercialHallway },
      { key: "chaseBank", url: chaseBank },
      { key: "church", url: church },
    ],
  },
  "dock-photo": {
    group: "Docks",
    type: "single",
    label: "Main photo",
    hint: "Also used on the Services page. " + PHOTO_HINT,
    fallback: dockFinal,
  },
  "dock-gallery": {
    group: "Docks",
    type: "list",
    label: "Recent dock work (photos & videos)",
    hint: "Photos and videos (MP4, MOV or WebM, up to 140MB each). Shown three across, newest at the end - use the arrows to reorder. The section stays hidden until you add something.",
    videos: true,
    fallback: [],
  },
  "drone-photo": {
    group: "Drone Cleaning",
    type: "single",
    label: "Main photo",
    hint: "Also used on the Services page. " + PHOTO_HINT,
    fallback: droneFlying,
  },
  "drone-gallery": {
    group: "Drone Cleaning",
    type: "list",
    label: "Recent drone work (photos & videos)",
    hint: "Photos and videos (MP4, MOV or WebM, up to 140MB each). Shown three across, newest at the end - use the arrows to reorder. The section stays hidden until you add something.",
    videos: true,
    fallback: [],
  },

  // Team
  "team-hero": {
    group: "Meet the Hive",
    type: "single",
    label: "Crew photo at the top of the page",
    hint: "Team member portraits are edited with each person under Text & Content.",
    fallback: working,
  },
} satisfies Record<string, SlotDef>;

export type MediaSlotId = keyof typeof MEDIA_SLOTS;

/** Alt text for the bundled commercial gallery photos (uploads use a generic one). */
export const COMMERCIAL_GALLERY_ALTS: Record<string, string> = {
  [aptCommercialHallway]: "Apartment complex breezeway soft wash",
  [chaseBank]: "Bank branch storefront & parking lot cleaning",
  [church]: "Multi-story church exterior cleaning setup",
};
