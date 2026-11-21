// Structural, code-level routing data only. All editable text (names, blurbs,
// descriptions) lives in src/content/defaults.ts and can be edited from /admin.
// Slugs, paths and the slug -> content page mapping stay here because they
// drive actual route matching.
import type { AreaPageKey, ServicePageKey } from "@/content/defaults";

export type ServiceSlug = "residential" | "commercial" | "dock" | "drone-cleaning";

export const SERVICE_ROUTES: Array<{ slug: ServiceSlug; path: string }> = [
  { slug: "residential", path: "/residential" },
  { slug: "commercial", path: "/commercial" },
  { slug: "dock", path: "/dock" },
  { slug: "drone-cleaning", path: "/drone-cleaning" },
];

export function getServicePath(slug: ServiceSlug): string {
  return SERVICE_ROUTES.find((s) => s.slug === slug)!.path;
}

export type LocationSlug =
  "downtown-charleston" | "mount-pleasant" | "james-island" | "west-ashley" | "daniel-island";

export const LOCATION_ROUTES: Array<{ slug: LocationSlug; path: string }> = [
  { slug: "downtown-charleston", path: "/service-areas/downtown-charleston" },
  { slug: "mount-pleasant", path: "/service-areas/mount-pleasant" },
  { slug: "james-island", path: "/service-areas/james-island" },
  { slug: "west-ashley", path: "/service-areas/west-ashley" },
  { slug: "daniel-island", path: "/service-areas/daniel-island" },
];

/** Which content page holds each service's text. */
export const SERVICE_PAGE: Record<ServiceSlug, ServicePageKey> = {
  residential: "residential",
  commercial: "commercial",
  dock: "dock",
  "drone-cleaning": "drone",
};

/** Which content page holds each service area's text. */
export const LOCATION_PAGE: Record<LocationSlug, AreaPageKey> = {
  "downtown-charleston": "downtownCharleston",
  "mount-pleasant": "mountPleasant",
  "james-island": "jamesIsland",
  "west-ashley": "westAshley",
  "daniel-island": "danielIsland",
};

export function getLocationPath(slug: LocationSlug): string {
  return LOCATION_ROUTES.find((l) => l.slug === slug)!.path;
}

/** Menu links. The visible labels are editable (site.header.nav). */
export const NAV = [
  { to: "/", key: "home" },
  { to: "/services", key: "services" },
  { to: "/service-areas", key: "serviceAreas" },
  { to: "/", hash: "reviews", key: "reviews" },
  { to: "/gallery", key: "gallery" },
  { to: "/team", key: "team" },
] as const;
