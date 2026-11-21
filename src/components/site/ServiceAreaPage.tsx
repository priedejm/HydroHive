import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/site/SectionReveal";
import {
  SERVICE_ROUTES,
  SERVICE_PAGE,
  LOCATION_PAGE,
  getServicePath,
  type LocationSlug,
} from "@/lib/site";
import { useContent } from "@/cms/SiteData";
import { telHref } from "@/cms/Rich";

export function ServiceAreaPage({ slug }: { slug: LocationSlug }) {
  const all = useContent();
  const page = all[LOCATION_PAGE[slug]];
  const location = page.about;
  const t = all.serviceAreas.areaPage;
  const { contact, google } = all.site;
  const { nav } = all.site.header;
  const phoneHref = telHref(contact.phone);
  const services = SERVICE_ROUTES.map((r) => ({ slug: r.slug, ...all[SERVICE_PAGE[r.slug]].about }));
  const spotlightReviews = all.home.reviews.items.slice(0, 3);

  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <SectionReveal>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-primary-foreground/60"
            >
              <Link to="/" className="hover:text-gold">
                {nav.home}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/service-areas" className="hover:text-gold">
                {nav.serviceAreas}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary-foreground/85">{location.name}</span>
            </nav>
            <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-gold">
              {location.region}
            </span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl max-w-3xl">
              {page.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-primary-foreground/80">{location.short}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-12 px-6 font-semibold"
              >
                <Link to="/contact">
                  {t.ctaLabel} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10"
              >
                <Phone className="h-4 w-4 text-gold" /> {contact.phone}
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <SectionReveal>
            <h2 className="font-display text-3xl text-navy">{page.local.title}</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">{page.local.body}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {page.local.neighborhoods.map((n, i) => (
                <span
                  key={i}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-navy"
                >
                  {n}
                </span>
              ))}
            </div>

            <h3 className="mt-12 font-display text-2xl text-navy">
              {page.local.servicesTitle}
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={getServicePath(s.slug)}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="font-display text-xl text-navy">{s.name}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                    {t.learnMore} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>

            <h3 className="mt-12 font-display text-2xl text-navy">{t.reviewsTitle}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {spotlightReviews.map((r, i) => (
                <figure key={i} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm text-navy/85 line-clamp-4">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-3 text-xs font-semibold text-navy">{r.name}</figcaption>
                </figure>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={100} className="space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-sm">
              <h3 className="font-display text-xl text-navy">{t.contactTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-navy hover:text-gold"
                  >
                    <Mail className="h-4 w-4" /> {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-2 text-navy hover:text-gold"
                  >
                    <Phone className="h-4 w-4" /> {contact.phone}
                  </a>
                </li>
                <li className="inline-flex items-start gap-2 text-navy">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {page.local.servingLine}
                </li>
              </ul>
              <Button
                asChild
                className="mt-5 w-full rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-11 font-semibold"
              >
                <Link to="/contact">{t.contactButton}</Link>
              </Button>
            </div>

            <div className="rounded-3xl bg-gold p-6">
              <div className="flex items-center gap-2 text-navy">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-display text-lg">{t.badgeTitle}</span>
              </div>
              <p className="mt-2 text-sm text-navy/85">
                {t.badgeText}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-navy">
                <Star className="h-3.5 w-3.5 fill-navy" /> {google.rating.toFixed(1)} on Google
                ({google.reviewCount} reviews)
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
