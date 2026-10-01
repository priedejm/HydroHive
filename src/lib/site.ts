// Structural, code-level routing data only. All editable text (names, blurbs,
// descriptions) lives in the content system (src/lib/content) and is fetched
// at runtime so it can be edited from /admin without a rebuild. Slugs and
// paths stay here because they drive actual route matching.

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

export function getLocationPath(slug: LocationSlug): string {
  return LOCATION_ROUTES.find((l) => l.slug === slug)!.path;
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/", hash: "reviews", label: "Reviews" },
  { to: "/gallery", label: "Before & After" },
  { to: "/team", label: "Meet the Hive" },
] as const;
