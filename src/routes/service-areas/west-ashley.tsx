import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULTS } from "@/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const location = DEFAULTS.westAshley.about;
const path = getLocationPath("west-ashley");

export const Route = createFileRoute("/service-areas/west-ashley")({
  head: () => ({
    meta: [
      { title: "Exterior Cleaning in West Ashley, SC · Hydro Hive" },
      {
        name: "description",
        content:
          "Soft washing and pressure washing for West Ashley homes and businesses along Savannah Highway and Ashley River Road. Free estimates from a locally owned crew.",
      },
      { property: "og:title", content: "West Ashley Exterior Cleaning · Hydro Hive" },
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
  component: () => <ServiceAreaPage slug="west-ashley" />,
});
