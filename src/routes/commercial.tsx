import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { getService } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, jsonLdScript } from "@/lib/schema";

const service = getService("commercial");
const content = SERVICE_CONTENT.commercial;

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
      { property: "og:url", content: service.path },
    ],
    links: [{ rel: "canonical", href: service.path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Commercial", path: service.path },
        ]),
      ),
      jsonLdScript(buildServiceSchema({ slug: "commercial", name: service.name, description: service.long, path: service.path })),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="commercial" />,
});
