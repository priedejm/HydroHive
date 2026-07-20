import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { getService } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, jsonLdScript } from "@/lib/schema";

const service = getService("dock");
const content = SERVICE_CONTENT.dock;

export const Route = createFileRoute("/dock")({
  head: () => ({
    meta: [
      { title: "Dock Cleaning & Restoration · Hydro Hive Charleston" },
      {
        name: "description",
        content:
          "Marine-safe dock cleaning in the Charleston Lowcountry - mildew and algae removal, wood restoration, no harm to the marsh or waterway. Free estimates.",
      },
      { property: "og:title", content: "Dock Cleaning · Hydro Hive" },
      { property: "og:description", content: service.short },
      { property: "og:url", content: service.path },
    ],
    links: [{ rel: "canonical", href: service.path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Docks", path: service.path },
        ]),
      ),
      jsonLdScript(buildServiceSchema({ slug: "dock", name: service.name, description: service.long, path: service.path })),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="dock" />,
});
