import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { getService } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, jsonLdScript } from "@/lib/schema";

const service = getService("residential");
const content = SERVICE_CONTENT.residential;

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
      { property: "og:url", content: service.path },
    ],
    links: [{ rel: "canonical", href: service.path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Residential", path: service.path },
        ]),
      ),
      jsonLdScript(buildServiceSchema({ slug: "residential", name: service.name, description: service.long, path: service.path })),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="residential" />,
});
