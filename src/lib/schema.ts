import { LOCATIONS, SITE, type ServiceSlug } from "@/lib/site";

/**
 * Structured data helpers.
 *
 * Deliberately does NOT emit AggregateRating / Review markup: Google's
 * structured-data guidelines treat ratings a business publishes about
 * itself on its own site as "self-serving reviews," which are against
 * their review-snippet policy. The on-page ReviewsSection shows real
 * Google reviews to visitors, it's just not marked up for rich results.
 */

const absoluteUrl = (path: string) => `${SITE.domain}${path}`;

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.domain,
    telephone: SITE.phoneHref.replace("tel:", ""),
    email: SITE.email,
    priceRange: "$$",
    image: absoluteUrl("/og-image.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.addressLocality,
      addressRegion: SITE.addressRegion,
      postalCode: SITE.postalCode,
      addressCountry: "US",
    },
    areaServed: LOCATIONS.map((l) => ({
      "@type": "City",
      name: l.name,
    })),
    sameAs: [SITE.instagram],
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function buildServiceSchema(opts: {
  slug: ServiceSlug;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: `${opts.name} · ${SITE.name}`,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: {
      "@type": "LocalBusiness",
      name: SITE.legalName,
      telephone: SITE.phoneHref.replace("tel:", ""),
      address: SITE.fullAddress,
    },
    areaServed: LOCATIONS.map((l) => l.name),
  };
}

export function jsonLdScript(data: unknown) {
  return { attrs: { type: "application/ld+json" }, children: JSON.stringify(data) };
}
