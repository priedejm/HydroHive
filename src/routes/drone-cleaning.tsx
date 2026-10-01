import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getServicePath } from "@/lib/site";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  jsonLdScript,
} from "@/lib/schema";

// head()/schema below run at route-module load, before any component has
// rendered, so they read the build-time DEFAULT_CONTENT snapshot rather than
// live admin-edited content - see the comment in src/lib/schema.ts.
const service = DEFAULT_CONTENT.services.find((s) => s.slug === "drone-cleaning")!;
const content = DEFAULT_CONTENT.service_content["drone-cleaning"];
const path = getServicePath("drone-cleaning");

export const Route = createFileRoute("/drone-cleaning")({
  head: () => ({
    meta: [
      { title: "Drone Cleaning for Tall Buildings · Hydro Hive Charleston" },
      {
        name: "description",
        content:
          "Low-pressure drone soft-washing for steeples, multi-story homes, and tall commercial facades in Charleston, SC. 100+ ft reach, no ladders. Partnered with LucidBots.",
      },
      { property: "og:title", content: "Drone Cleaning · Hydro Hive" },
      { property: "og:description", content: service.short },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Drone Cleaning", path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({
          slug: "drone-cleaning",
          name: service.name,
          description: service.long,
          path,
        }),
      ),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="drone-cleaning" />,
});
