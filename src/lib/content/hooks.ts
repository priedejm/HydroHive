import { useQuery } from "@tanstack/react-query";
import { DEFAULT_CONTENT } from "./defaults";
import { fetchContent } from "./fetch";
import type { LocationSlug, ServiceSlug } from "@/lib/site";

export const CONTENT_QUERY_KEY = ["site-content"] as const;

export function useSiteContentQuery() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchContent,
    initialData: DEFAULT_CONTENT,
    // Without this, TanStack Query treats initialData as freshly fetched and
    // - combined with staleTime below - never calls fetchContent() at all
    // within the staleTime window. Marking it as already-ancient forces the
    // live /api/content.php fetch to fire in the background on mount, while
    // initialData still paints instantly so there's no loading flash.
    initialDataUpdatedAt: 0,
    staleTime: 5 * 60_000,
  });
}

export function useSite() {
  return useSiteContentQuery().data.site;
}

export function useServices() {
  return useSiteContentQuery().data.services;
}

export function useService(slug: ServiceSlug) {
  const service = useServices().find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service slug: ${slug}`);
  return service;
}

export function useLocations() {
  return useSiteContentQuery().data.locations;
}

export function useLocation(slug: LocationSlug) {
  const location = useLocations().find((l) => l.slug === slug);
  if (!location) throw new Error(`Unknown location slug: ${slug}`);
  return location;
}

export function useServiceContent(slug: ServiceSlug) {
  return useSiteContentQuery().data.service_content[slug];
}

// For rendering a list of all services with their content (e.g. the /services
// index) without calling a hook once per loop iteration.
export function useServiceContentMap() {
  return useSiteContentQuery().data.service_content;
}

export function useReviews() {
  return useSiteContentQuery().data.reviews;
}

export function useTeam() {
  return useSiteContentQuery().data.team;
}

export function useHomeContent() {
  return useSiteContentQuery().data.home;
}

export function useGalleryContent() {
  return useSiteContentQuery().data.gallery;
}

export function useSeo(path: string) {
  return useSiteContentQuery().data.seo[path];
}
