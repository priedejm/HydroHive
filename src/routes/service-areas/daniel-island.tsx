import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { getLocation } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

const location = getLocation("daniel-island");

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
  component: () => <ServiceAreaPage slug="daniel-island" />,
});
