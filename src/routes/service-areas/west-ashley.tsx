import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { getLocation } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

const location = getLocation("west-ashley");

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
  component: () => <ServiceAreaPage slug="west-ashley" />,
});
