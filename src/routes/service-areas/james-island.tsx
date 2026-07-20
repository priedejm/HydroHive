import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { getLocation } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

const location = getLocation("james-island");

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
      { property: "og:url", content: location.path },
    ],
    links: [{ rel: "canonical", href: location.path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
          { name: location.name, path: location.path },
        ]),
      ),
    ],
  }),
  component: () => <ServiceAreaPage slug="james-island" />,
});
