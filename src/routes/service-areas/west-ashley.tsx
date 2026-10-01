import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// head()/schema below run at route-module load, before any component has
// rendered, so they read the build-time DEFAULT_CONTENT snapshot rather than
// live admin-edited content - see the comment in src/lib/schema.ts.
const location = DEFAULT_CONTENT.locations.find((l) => l.slug === "west-ashley")!;
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
