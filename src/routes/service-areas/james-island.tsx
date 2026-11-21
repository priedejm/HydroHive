import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULTS } from "@/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const location = DEFAULTS.jamesIsland.about;
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
