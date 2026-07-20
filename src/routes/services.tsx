import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/site/SectionReveal";
import { SERVICES, LOCATIONS } from "@/lib/site";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { buildBreadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Hydro Hive Exterior Cleaning" },
      {
        name: "description",
        content:
          "Residential, commercial, dock, and drone exterior cleaning in Charleston, SC. Fully insured, locally owned.",
      },
      { property: "og:title", content: "Services · Hydro Hive" },
      { property: "og:description", content: "Residential, commercial, dock, and drone cleaning in Charleston." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
      ),
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Our services</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">Clean, top to bottom.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">
              Four services, one crew. Pick what you need - we'll bring the pressure, the chemistry, and the care.
            </p>
            <nav className="mt-8 flex flex-wrap justify-center gap-2">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  to={s.path}
                  className="rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy px-4 py-2 text-sm font-semibold transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </nav>
          </SectionReveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {SERVICES.map((s, i) => {
          const reverse = i % 2 === 1;
          const isDrone = s.slug === "drone-cleaning";
          const content = SERVICE_CONTENT[s.slug];
          return (
            <section
              key={s.slug}
              className={cn(
                "rounded-3xl overflow-hidden",
                isDrone && "bg-gold p-6 sm:p-10 -mx-2",
              )}
            >
              <div className={cn("grid gap-10 items-center md:grid-cols-2", reverse && "md:[&>*:first-child]:order-2")}>
                <SectionReveal>
                  <div className="overflow-hidden rounded-3xl shadow-lg border-4 border-white">
                    <img src={content.image} alt={s.name} className="w-full aspect-[4/3] object-cover" />
                  </div>
                </SectionReveal>
                <SectionReveal delay={100}>
                  <span className={cn("text-xs font-bold uppercase tracking-widest", isDrone ? "text-navy" : "text-gold")}>
                    Service {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className={cn("mt-3 font-display text-4xl sm:text-5xl", "text-navy")}>{s.name}</h2>
                  <p className={cn("mt-4 text-base", isDrone ? "text-navy/85" : "text-muted-foreground")}>{s.long}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {content.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-navy">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-primary-foreground">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      className="rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-12 px-6 font-semibold"
                    >
                      <Link to="/contact" search={{ service: s.slug }}>
                        {s.cta} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                    <Link
                      to={s.path}
                      className={cn(
                        "inline-flex items-center gap-1 text-sm font-semibold",
                        isDrone ? "text-navy hover:text-navy/70" : "text-navy hover:text-gold",
                      )}
                    >
                      Full details &amp; FAQs <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </SectionReveal>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-cream border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Where we work</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-navy">Serving the Charleston Lowcountry</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <Link
                  key={l.slug}
                  to={l.path}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-navy hover:border-navy/40 hover:bg-navy/5 transition-colors"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
