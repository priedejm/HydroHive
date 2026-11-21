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
const service = DEFAULTS.residential.about;
const faqs = DEFAULTS.residential.faq.items;
const path = getServicePath("residential");

export const Route = createFileRoute("/residential")({
  head: () => ({
    meta: [
      { title: "Residential Pressure & Soft Washing · Hydro Hive Charleston" },
      {
        name: "description",
        content:
          "Soft washing, pressure washing, and window cleaning for Charleston homes - siding, roofs, driveways, and pavers cleaned by a locally owned crew. Free estimates.",
      },
      { property: "og:title", content: "Residential Exterior Cleaning · Hydro Hive" },
      { property: "og:description", content: service.short },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Residential", path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({
          slug: "residential",
          name: service.name,
          description: service.long,
          path,
        }),
      ),
      jsonLdScript(buildFaqSchema(faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="residential" />,
});
