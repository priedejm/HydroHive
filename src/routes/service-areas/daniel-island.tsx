import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULTS } from "@/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const location = DEFAULTS.danielIsland.about;
const path = getLocationPath("daniel-island");

export const Route = createFileRoute("/service-areas/daniel-island")({
  head: () => ({
    meta: [
      { title: "Exterior Cleaning in Daniel Island, SC · Hydro Hive" },
      {
        name: "description",
        content:
          "Soft washing, pressure washing, and dock cleaning for Daniel Island homes along the Cooper and Wando Rivers. Free estimates from a locally owned crew.",
      },
      { property: "og:title", content: "Daniel Island Exterior Cleaning · Hydro Hive" },
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
  component: () => <ServiceAreaPage slug="daniel-island" />,
});
