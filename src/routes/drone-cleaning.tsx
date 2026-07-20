import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/site/ServiceDetailPage";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { getService } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema, jsonLdScript } from "@/lib/schema";

const service = getService("drone-cleaning");
const content = SERVICE_CONTENT["drone-cleaning"];

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
      { property: "og:url", content: service.path },
    ],
    links: [{ rel: "canonical", href: service.path }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Drone Cleaning", path: service.path },
        ]),
      ),
      jsonLdScript(
        buildServiceSchema({ slug: "drone-cleaning", name: service.name, description: service.long, path: service.path }),
      ),
      jsonLdScript(buildFaqSchema(content.faqs)),
    ],
  }),
  component: () => <ServiceDetailPage slug="drone-cleaning" />,
});
