import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionReveal } from "@/components/site/SectionReveal";
import {
  LOCATION_ROUTES,
  LOCATION_PAGE,
  SERVICE_PAGE,
  getLocationPath,
  type ServiceSlug,
} from "@/lib/site";
import { useContent, useImage, useMediaList } from "@/cms/SiteData";
import { isVideoUrl } from "@/cms/compose";
import { telHref } from "@/cms/Rich";
import { COMMERCIAL_GALLERY_ALTS } from "@/content/media";
import { cn } from "@/lib/utils";

export function ServiceDetailPage({ slug }: { slug: ServiceSlug }) {
  const all = useContent();
  const pageKey = SERVICE_PAGE[slug];
  const page = all[pageKey];
  const service = page.about;
  const image = useImage(`${pageKey}-photo`);
  const gallery = useMediaList(`${pageKey}-gallery`);
  const { contact } = all.site;
  const { nav } = all.site.header;
  const locations = LOCATION_ROUTES.map((r) => ({ slug: r.slug, name: all[LOCATION_PAGE[r.slug]].about.name }));
  const isDrone = slug === "drone-cleaning";

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
              <Link to="/services" className="hover:text-gold">
                {nav.services}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary-foreground/85">{service.name}</span>
            </nav>
            <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-gold">
              {page.hero.eyebrow}
            </span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl max-w-3xl">
              {page.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-primary-foreground/80">{service.short}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-12 px-6 font-semibold"
              >
                <Link to="/contact" search={{ service: slug }}>
                  {service.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={telHref(contact.phone)}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10"
              >
                <Phone className="h-4 w-4 text-gold" /> {contact.phone}
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <section className={cn("rounded-3xl overflow-hidden", isDrone && "bg-gold p-6 sm:p-10")}>
          <div className="grid gap-10 items-center md:grid-cols-2">
            <SectionReveal>
              <div className="overflow-hidden rounded-3xl shadow-lg border-4 border-white">
                <img
                  src={image}
                  alt={`${service.name} exterior cleaning`}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </SectionReveal>
            <SectionReveal delay={100}>
              <h2 className={cn("font-display text-3xl sm:text-4xl", "text-navy")}>
                {page.included.title}
              </h2>
              <p
                className={cn("mt-4 text-base", isDrone ? "text-navy/85" : "text-muted-foreground")}
              >
                {service.long}
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {page.included.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>
        </section>

        {gallery.length > 0 && (
          <SectionReveal className="mt-14">
            <h2 className="font-display text-3xl text-navy">
              {page.gallery.title}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {gallery.map((src) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-2xl shadow-sm border border-border"
                >
                  {isVideoUrl(src) ? (
                    <video
                      src={`${src}#t=0.1`}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`${service.name} project video`}
                      className="w-full aspect-[3/4] object-cover bg-navy"
                    />
                  ) : (
                    <img
                      src={src}
                      alt={COMMERCIAL_GALLERY_ALTS[src] ?? `${service.name} project`}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* Service areas internal linking */}
        <SectionReveal className="mt-20">
          <h2 className="font-display text-3xl text-navy">
            {page.areas.title}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {page.areas.sub}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {locations.map((l) => (
              <Link
                key={l.slug}
                to={getLocationPath(l.slug)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-navy hover:border-navy/40 hover:bg-navy/5 transition-colors"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </SectionReveal>

        {/* FAQs */}
        <SectionReveal className="mt-20 max-w-3xl">
          <h2 className="font-display text-3xl text-navy">{page.faq.title}</h2>
          <Accordion type="single" collapsible className="mt-6">
            {page.faq.items.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-display text-lg text-navy">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionReveal>
      </div>

      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl sm:text-5xl">
              {page.finalCta.title}
            </h2>
            <p className="mt-3 text-primary-foreground/75">
              {page.finalCta.sub}
            </p>
            <Button
              asChild
              className="mt-7 rounded-full bg-gold text-navy hover:bg-gold/90 h-12 px-8 font-semibold"
            >
              <Link to="/contact" search={{ service: slug }}>
                {service.cta} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
