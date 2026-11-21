import { LOCATION_ROUTES, LOCATION_PAGE, type ServiceSlug } from "@/lib/site";
import { DEFAULTS, contactInfo } from "@/content/defaults";
import { telHref } from "@/cms/Rich";

/**
 * Structured data helpers.
 *
 * Deliberately does NOT emit AggregateRating / Review markup: Google's
 * structured-data guidelines treat ratings a business publishes about
 * itself on its own site as "self-serving reviews," which are against
 * their review-snippet policy. The on-page ReviewsSection shows real
 * Google reviews to visitors, it's just not marked up for rich results.
 *
 * SEO stays in code: this runs at route-module load time (inside each
 * route's `head()`) and reads the bundled DEFAULTS, not Content Studio edits.
 */

const DOMAIN = "https://thehydrohive.com";
const CONTACT = DEFAULTS.site.contact;
const TELEPHONE = telHref(CONTACT.phone).replace("tel:", "");
const LOCATIONS = LOCATION_ROUTES.map((r) => ({ name: DEFAULTS[LOCATION_PAGE[r.slug]].about.name }));

const absoluteUrl = (path: string) => `${DOMAIN}${path}`;

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CONTACT.legalName,
    alternateName: CONTACT.name,
    url: DOMAIN,
    telephone: TELEPHONE,
    email: CONTACT.email,
    priceRange: "$$",
    image: absoluteUrl("/og-image.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.state,
      postalCode: CONTACT.zip,
      addressCountry: "US",
    },
    areaServed: LOCATIONS.map((l) => ({
      "@type": "City",
      name: l.name,
    })),
    sameAs: [CONTACT.instagram],
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
    name: `${opts.name} · ${CONTACT.name}`,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: {
      "@type": "LocalBusiness",
      name: CONTACT.legalName,
      telephone: TELEPHONE,
      address: contactInfo(CONTACT).fullAddress,
    },
    areaServed: LOCATIONS.map((l) => l.name),
  };
}

export function jsonLdScript(data: unknown) {
  // The router spreads these keys straight onto the <script> tag.
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
