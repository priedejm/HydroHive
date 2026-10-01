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
const service = DEFAULT_CONTENT.services.find((s) => s.slug === "dock")!;
const content = DEFAULT_CONTENT.service_content.dock;
const path = getServicePath("dock");

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
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Docks", path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({ slug: "dock", name: service.name, description: service.long, path }),
      ),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="dock" />,
});
