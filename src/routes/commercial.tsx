import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { DEFAULTS } from "@/content/defaults";
import { getServicePath } from "@/lib/site";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  jsonLdScript,
} from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const service = DEFAULTS.commercial.about;
const faqs = DEFAULTS.commercial.faq.items;
const path = getServicePath("commercial");

export const Route = createFileRoute("/commercial")({
  head: () => ({
    meta: [
      { title: "Commercial Pressure Washing · Hydro Hive Charleston" },
      {
        name: "description",
        content:
          "Storefront, restaurant, office, and parking lot pressure washing in Charleston, SC. Fully insured, flexible after-hours scheduling. Free estimates.",
      },
      { property: "og:title", content: "Commercial Exterior Cleaning · Hydro Hive" },
      { property: "og:description", content: service.short },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Commercial", path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({
          slug: "commercial",
          name: service.name,
          description: service.long,
          path,
        }),
      ),
      jsonLdScript(buildFaqSchema(faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="commercial" />,
});
