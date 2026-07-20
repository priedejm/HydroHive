import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionReveal } from "@/components/site/SectionReveal";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { LOCATIONS, SITE, getService, type ServiceSlug } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ServiceDetailPage({ slug }: { slug: ServiceSlug }) {
  const service = getService(slug);
  const content = SERVICE_CONTENT[slug];
  const isDrone = slug === "drone-cleaning";

  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <SectionReveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
              <Link to="/" className="hover:text-gold">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-gold">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary-foreground/85">{service.name}</span>
            </nav>
            <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-gold">
              {service.name} Cleaning
            </span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl max-w-3xl">
              {service.name} exterior cleaning in Charleston, SC
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
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10"
              >
                <Phone className="h-4 w-4 text-gold" /> {SITE.phone}
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
                <img src={content.image} alt={`${service.name} exterior cleaning`} className="w-full aspect-[4/3] object-cover" />
              </div>
            </SectionReveal>
            <SectionReveal delay={100}>
              <h2 className={cn("font-display text-3xl sm:text-4xl", "text-navy")}>What's included</h2>
              <p className={cn("mt-4 text-base", isDrone ? "text-navy/85" : "text-muted-foreground")}>{service.long}</p>
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
            </SectionReveal>
          </div>
        </section>

        {/* Service areas internal linking */}
        <SectionReveal className="mt-20">
          <h2 className="font-display text-3xl text-navy">Serving {service.name.toLowerCase()} clients across the Lowcountry</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            We bring {service.name.toLowerCase()} cleaning to these Charleston-area communities and beyond.
          </p>
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

        {/* FAQs */}
        <SectionReveal className="mt-20 max-w-3xl">
          <h2 className="font-display text-3xl text-navy">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {content.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-display text-lg text-navy">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionReveal>
      </div>

      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl sm:text-5xl">Ready for {service.name.toLowerCase()} that's done right?</h2>
            <p className="mt-3 text-primary-foreground/75">Free estimates. Fast quotes. Fully insured.</p>
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
