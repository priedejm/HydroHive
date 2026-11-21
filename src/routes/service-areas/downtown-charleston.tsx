import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULTS } from "@/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const location = DEFAULTS.downtownCharleston.about;
const path = getLocationPath("downtown-charleston");

export const Route = createFileRoute("/service-areas/downtown-charleston")({
  head: () => ({
    meta: [
      { title: "Exterior Cleaning in Downtown Charleston, SC · Hydro Hive" },
      {
        name: "description",
        content:
          "Soft washing, pressure washing, and storefront cleaning for downtown Charleston's historic homes and King Street businesses. Free estimates from a locally owned crew.",
      },
      { property: "og:title", content: "Downtown Charleston Exterior Cleaning · Hydro Hive" },
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
  component: () => <ServiceAreaPage slug="downtown-charleston" />,
});
