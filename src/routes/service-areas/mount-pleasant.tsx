import { createFileRoute } from "@tanstack/react-router";
import { ServiceAreaPage } from "@/components/site/ServiceAreaPage";
import { DEFAULTS } from "@/content/defaults";
import { getLocationPath } from "@/lib/site";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const location = DEFAULTS.mountPleasant.about;
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
