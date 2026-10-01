import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// head()/schema below run at route-module load, before any component has
// rendered, so they read the build-time DEFAULT_CONTENT snapshot rather than
// live admin-edited content - see the comment in src/lib/schema.ts.
const location = DEFAULT_CONTENT.locations.find((l) => l.slug === "james-island")!;
const path = getLocationPath("james-island");

export const Route = createFileRoute("/service-areas/james-island")({
  head: () => ({
    meta: [
      { title: "Exterior Cleaning in James Island, SC · Hydro Hive" },
      {
        name: "description",
        content:
          "Soft washing and marine-safe dock cleaning for James Island homes along the Stono River and Charleston Harbor marshes. Free estimates from a locally owned crew.",
      },
      { property: "og:title", content: "James Island Exterior Cleaning · Hydro Hive" },
      { property: "og:description", content: location.short },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
          { name: location.name, path },
        ]),
      ),
    ],
  }),
  component: () => <ServiceAreaPage slug="james-island" />,
});
