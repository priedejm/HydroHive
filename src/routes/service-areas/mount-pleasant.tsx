import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// head()/schema below run at route-module load, before any component has
// rendered, so they read the build-time DEFAULT_CONTENT snapshot rather than
// live admin-edited content - see the comment in src/lib/schema.ts.
const location = DEFAULT_CONTENT.locations.find((l) => l.slug === "mount-pleasant")!;
const path = getLocationPath("mount-pleasant");

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
  component: () => <ServiceAreaPage slug="mount-pleasant" />,
});
