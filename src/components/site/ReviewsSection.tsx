import { Star, Quote, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { SectionReveal } from "@/components/site/SectionReveal";
import { REVIEWS } from "@/lib/reviews";
import { SITE } from "@/lib/site";

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionReveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold">
              What Charleston is saying
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-navy">Reviews from the Hive</h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars />
              <span className="font-display text-2xl text-navy">{SITE.googleRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                from {SITE.googleReviewCount} Google reviews
              </span>
            </div>
          </div>
          <a
            href={SITE.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-navy/40 transition-colors"
          >
            Read all reviews on Google <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </SectionReveal>

        <SectionReveal delay={100} className="mt-12">
          <Carousel opts={{ align: "start", loop: true }} className="px-1">
            <CarouselContent>
              {REVIEWS.map((r) => (
                <CarouselItem key={r.name + r.timeAgo} className="sm:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col rounded-3xl bg-card border border-border p-6 shadow-sm">
                    <Quote className="h-6 w-6 text-gold" />
                    <Stars />
                    <blockquote className="mt-3 flex-1 text-sm text-navy/85 leading-relaxed line-clamp-6">
                      {r.text}
                    </blockquote>
                    <figcaption className="mt-5 border-t border-border pt-4">
                      <div className="text-sm font-semibold text-navy">{r.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {r.meta} · {r.timeAgo}
                      </div>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12 border-navy/15 text-navy" />
            <CarouselNext className="hidden sm:flex -right-4 lg:-right-12 border-navy/15 text-navy" />
          </Carousel>
        </SectionReveal>
      </div>
    </section>
  );
}
