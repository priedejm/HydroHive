import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { getLocation } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

const location = getLocation("mount-pleasant");

export const Route = createFileRoute("/service-areas/mount-pleasant")({
  head: () => ({
    meta: [
      { title: "Exterior Cleaning in Mount Pleasant, SC · Hydro Hive" },
      {
        name: "description",
        content:
          "Soft washing, pressure washing, and dock cleaning for Mount Pleasant homes near Shem Creek and the Wando River. Free estimates from a locally owned crew.",
      },
      { property: "og:title", content: "Mount Pleasant Exterior Cleaning · Hydro Hive" },
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
  component: () => <ServiceAreaPage slug="mount-pleasant" />,
});
