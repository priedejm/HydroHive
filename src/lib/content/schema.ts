import { z } from "zod";

const faqSchema = z.object({ q: z.string(), a: z.string() });
const galleryImageSchema = z.object({ src: z.string(), alt: z.string() });

const SERVICE_SLUGS = ["residential", "commercial", "dock", "drone-cleaning"] as const;
const LOCATION_SLUGS = [
  "downtown-charleston",
  "mount-pleasant",
  "james-island",
  "west-ashley",
  "daniel-island",
] as const;

const serviceSlugSchema = z.enum(SERVICE_SLUGS);
const locationSlugSchema = z.enum(LOCATION_SLUGS);

export const siteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  email: z.string(),
  phone: z.string(),
  phoneHref: z.string(),
  city: z.string(),
  street: z.string(),
  addressLocality: z.string(),
  addressRegion: z.string(),
  postalCode: z.string(),
  fullAddress: z.string(),
  instagram: z.string(),
  established: z.string(),
  domain: z.string(),
  googleRating: z.number(),
  googleReviewCount: z.number(),
  googleReviewsUrl: z.string(),
});

// Every consumer (useService, ServiceDetailPage, the /services index, etc.)
// assumes all 4 services are present and looks one up by slug without a
// fallback - so an admin save that drops a slug must fail validation here
// and fall back to the complete DEFAULT_CONTENT.services, rather than
// serving a partial list that crashes those lookups downstream.
export const servicesSchema = z
  .array(
    z.object({
      slug: serviceSlugSchema,
      name: z.string(),
      short: z.string(),
      long: z.string(),
      cta: z.string(),
    }),
  )
  .refine((services) => SERVICE_SLUGS.every((slug) => services.some((s) => s.slug === slug)), {
    message: "services must include all known service slugs",
  });

export const locationsSchema = z
  .array(
    z.object({
      slug: locationSlugSchema,
      name: z.string(),
      region: z.string(),
      short: z.string(),
      long: z.string(),
      neighborhoods: z.array(z.string()),
    }),
  )
  .refine((locations) => LOCATION_SLUGS.every((slug) => locations.some((l) => l.slug === slug)), {
    message: "locations must include all known location slugs",
  });

export const serviceContentSchema = z
  .record(
    serviceSlugSchema,
    z.object({
      image: z.string(),
      bullets: z.array(z.string()),
      faqs: z.array(faqSchema),
      gallery: z.array(galleryImageSchema).optional(),
    }),
  )
  .refine((map) => SERVICE_SLUGS.every((slug) => slug in map), {
    message: "service_content must include all known service slugs",
  });

export const reviewsSchema = z.array(
  z.object({
    name: z.string(),
    meta: z.string(),
    timeAgo: z.string(),
    text: z.string(),
  }),
);

export const teamSchema = z.object({
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string(),
  members: z.array(
    z.object({
      first: z.string(),
      photo: z.string(),
      role: z.string(),
      bio: z.array(z.string()),
    }),
  ),
  storyTitle: z.string(),
  storyBody: z.string(),
});

export const homeSchema = z.object({
  heroHeadlineLine1: z.string(),
  heroHeadlineLine2: z.string(),
  heroSub: z.string(),
  statRow: z.array(z.object({ k: z.string(), v: z.string() })),
  serviceTeaserEyebrow: z.string(),
  serviceTeaserHeading: z.string(),
  serviceTeaserSub: z.string(),
  images: z.object({
    residential: z.string(),
    commercial: z.string(),
    dock: z.string(),
    droneBlock: z.string(),
  }),
  beforeAfterEyebrow: z.string(),
  beforeAfterHeading: z.string(),
  droneEyebrow: z.string(),
  droneHeading: z.string(),
  droneBody: z.string(),
  finalCtaHeading: z.string(),
  finalCtaSub: z.string(),
});

export const gallerySchema = z.object({
  heroTitle: z.string(),
  heroSub: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      before: z.string(),
      after: z.string(),
    }),
  ),
});

export const seoSchema = z.record(
  z.string(),
  z.object({ title: z.string(), description: z.string() }),
);

// One schema per top-level content_sections key, used to validate each
// section independently (see src/lib/content/fetch.ts) so a single bad
// section falls back to its own default instead of blanking the whole site.
export const sectionSchemas = {
  site: siteSchema,
  services: servicesSchema,
  locations: locationsSchema,
  service_content: serviceContentSchema,
  reviews: reviewsSchema,
  team: teamSchema,
  home: homeSchema,
  gallery: gallerySchema,
  seo: seoSchema,
} as const;

export const siteContentSchema = z.object({
  site: siteSchema,
  services: servicesSchema,
  locations: locationsSchema,
  service_content: serviceContentSchema,
  reviews: reviewsSchema,
  team: teamSchema,
  home: homeSchema,
  gallery: gallerySchema,
  seo: seoSchema,
});
