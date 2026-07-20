import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, Phone, MapPin, ShieldCheck, Star } from "lucide-react";
import { SectionReveal } from "@/components/site/SectionReveal";
import { QuoteWizard } from "@/components/site/QuoteWizard";
import { SITE, type ServiceSlug } from "@/lib/site";

const searchSchema = z.object({
  service: z.enum(["residential", "commercial", "dock", "drone-cleaning"]).optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Get a Free Estimate · Hydro Hive" },
      {
        name: "description",
        content:
          "Request a free exterior cleaning estimate in Charleston, SC. Residential, commercial, dock, and drone quotes in under a minute.",
      },
      { property: "og:title", content: "Get a Free Estimate · Hydro Hive" },
      { property: "og:description", content: "Free estimates from Charleston's locally owned exterior cleaning crew." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();
  const initial = search.service as ServiceSlug | undefined;

  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Free estimate</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">Let's get you a quote.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">
              Four quick steps. We'll follow up within 24 hours with a real number - no pressure.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <SectionReveal>
            <QuoteWizard initialService={initial} />
          </SectionReveal>

          <SectionReveal delay={100} className="space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-sm">
              <h3 className="font-display text-xl text-navy">Prefer to reach out directly?</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-navy hover:text-gold">
                    <Mail className="h-4 w-4" /> {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="inline-flex items-center gap-2 text-navy hover:text-gold">
                    <Phone className="h-4 w-4" /> {SITE.phone}
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 text-navy">
                  <MapPin className="h-4 w-4" /> Serving {SITE.city} and the Lowcountry
                </li>
              </ul>
            </div>

            <div className="rounded-3xl overflow-hidden border border-border shadow-sm">
              <iframe
                title="Service area map"
                src="https://www.google.com/maps?q=Charleston%20SC&z=10&output=embed"
                className="w-full h-56 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-3xl bg-gold p-6">
              <div className="flex items-center gap-2 text-navy">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-display text-lg">Locally Owned</span>
              </div>
              <p className="mt-2 text-sm text-navy/85">
                Charleston-based, fully insured, and small on purpose. Your job doesn't get pawned off to a stranger.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-navy">
                <Star className="h-3.5 w-3.5 fill-navy" /> 5.0 on Google
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
