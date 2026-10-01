import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getServicePath } from "@/lib/site";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  jsonLdScript,
} from "@/lib/schema";

// head()/schema below run at route-module load, before any component has
// rendered, so they read the build-time DEFAULT_CONTENT snapshot rather than
// live admin-edited content - see the comment in src/lib/schema.ts.
const service = DEFAULT_CONTENT.services.find((s) => s.slug === "residential")!;
const content = DEFAULT_CONTENT.service_content.residential;
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
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="residential" />,
});
