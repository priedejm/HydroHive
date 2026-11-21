import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { DEFAULTS } from "@/content/defaults";
import { getServicePath } from "@/lib/site";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  jsonLdScript,
} from "@/lib/schema";

// SEO (head()/JSON-LD) stays in code: it reads the bundled DEFAULTS, not
// Content Studio edits.
const service = DEFAULTS.dock.about;
const faqs = DEFAULTS.dock.faq.items;
const path = getServicePath("dock");

export const Route = createFileRoute("/dock")({
  head: () => ({
    meta: [
      { title: "Dock Cleaning & Restoration · Hydro Hive Charleston" },
      {
        name: "description",
        content:
          "Marine-safe dock cleaning in the Charleston Lowcountry - mildew and algae removal, wood restoration, no harm to the marsh or waterway. Free estimates.",
      },
      { property: "og:title", content: "Dock Cleaning · Hydro Hive" },
      { property: "og:description", content: service.short },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Docks", path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({ slug: "dock", name: service.name, description: service.long, path }),
      ),
      jsonLdScript(buildFaqSchema(faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="dock" />,
});
