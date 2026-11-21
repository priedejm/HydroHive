import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/site/SectionReveal";
import { LOCATION_ROUTES, LOCATION_PAGE, getLocationPath } from "@/lib/site";
import { useContent } from "@/cms/SiteData";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";

export const Route = createFileRoute("/service-areas/")({
  head: () => ({
    meta: [
      { title: "Service Areas · Hydro Hive Exterior Cleaning" },
      {
        name: "description",
        content:
          "Hydro Hive serves Downtown Charleston, Mount Pleasant, James Island, West Ashley, Daniel Island, and the greater Lowcountry with soft washing, pressure washing, dock, and drone cleaning.",
      },
      { property: "og:title", content: "Service Areas · Hydro Hive" },
      {
        property: "og:description",
        content: "Exterior cleaning across Charleston, SC and the Lowcountry.",
      },
      { property: "og:url", content: "/service-areas" },
    ],
    links: [{ rel: "canonical", href: "/service-areas" }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
        ]),
      ),
    ],
  }),
  component: ServiceAreasIndex,
});

function ServiceAreasIndex() {
  const content = useContent();
  const hero = content.serviceAreas.hero;
  const locations = LOCATION_ROUTES.map((r) => ({ slug: r.slug, ...content[LOCATION_PAGE[r.slug]].about }));
  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              {hero.eyebrow}
            </span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">{hero.title}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">
              {hero.sub}
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l, i) => (
            <SectionReveal key={l.slug} delay={i * 80}>
              <Link
                to={getLocationPath(l.slug)}
                className="group block h-full rounded-3xl bg-card border border-border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                  {l.region}
                </span>
                <h2 className="mt-2 font-display text-2xl text-navy">{l.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                  {l.cardLink} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
