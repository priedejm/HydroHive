import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/site/SectionReveal";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { TrustStrip } from "@/components/site/TrustStrip";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { HeroEstimateForm } from "@/components/site/HeroEstimateForm";
import { SERVICES, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hydro Hive · Charleston Exterior Cleaning" },
      {
        name: "description",
        content:
          "Charleston's locally owned exterior cleaning crew. Soft wash, pressure wash, windows, docks, and drone cleaning across the Lowcountry.",
      },
      { property: "og:title", content: "Hydro Hive · Charleston Exterior Cleaning" },
      {
        property: "og:description",
        content:
          "Soft wash, pressure wash, windows, docks, drone. Locally owned. Charleston, SC.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const RES_IMG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80";
const COM_IMG =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
const DOCK_IMG =
  "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=1200&q=80";
const DRONE_IMG =
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80";

function Home() {
  const teasers = SERVICES.filter((s) => s.slug !== "drone-cleaning");
  const teaserImgs: Record<string, string> = {
    residential: RES_IMG,
    commercial: COM_IMG,
    dock: DOCK_IMG,
  };

  return (
    <div>
      {/* HERO - image-free, brand-driven */}
      <section className="relative isolate overflow-hidden bg-navy text-cream">
        {/* Drifting honeycomb pattern */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 -z-10 h-full w-[calc(100%+56px)] animate-[hex-drift_6s_linear_infinite] text-gold opacity-[0.10]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hive-hero" width="56" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M28 2 L54 17 L54 47 L28 62 L2 47 L2 17 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hive-hero)" />
        </svg>

        {/* Floating honeycomb bubbles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {[
            { left: "2%", top: "10%", size: 52, dur: 5.6, delay: -1.4, dx: 34, dy: -18, spin: 42, op: 0.36, tone: "bg-gold/35" },
            { left: "7%", top: "58%", size: 26, dur: 4.4, delay: -3.1, dx: -18, dy: 16, spin: -65, op: 0.42, tone: "bg-cream/45" },
            { left: "12%", top: "28%", size: 78, dur: 6.2, delay: -4.6, dx: 28, dy: 24, spin: 28, op: 0.28, tone: "bg-gold/30" },
            { left: "18%", top: "82%", size: 38, dur: 4.8, delay: -2.2, dx: -24, dy: -20, spin: 74, op: 0.38, tone: "bg-cream/40" },
            { left: "24%", top: "14%", size: 30, dur: 5.1, delay: -0.8, dx: 20, dy: 18, spin: -52, op: 0.34, tone: "bg-gold/25" },
            { left: "30%", top: "70%", size: 64, dur: 6.8, delay: -5.5, dx: -36, dy: -22, spin: 36, op: 0.26, tone: "bg-cream/38" },
            { left: "36%", top: "8%", size: 42, dur: 4.6, delay: -3.8, dx: 26, dy: 26, spin: 68, op: 0.36, tone: "bg-gold/32" },
            { left: "4%", top: "88%", size: 22, dur: 3.9, delay: -1.9, dx: -18, dy: -16, spin: -80, op: 0.44, tone: "bg-cream/42" },
            { left: "62%", top: "6%", size: 88, dur: 7.2, delay: -6.2, dx: 38, dy: -24, spin: 30, op: 0.20, tone: "bg-gold/26" },
            { left: "55%", top: "88%", size: 46, dur: 5, delay: -2.7, dx: -28, dy: 20, spin: -48, op: 0.34, tone: "bg-cream/40" },
            { left: "72%", top: "78%", size: 28, dur: 4.2, delay: -3.5, dx: 18, dy: -18, spin: 76, op: 0.40, tone: "bg-gold/28" },
            { left: "88%", top: "12%", size: 70, dur: 6.5, delay: -4.9, dx: -34, dy: 26, spin: -34, op: 0.24, tone: "bg-cream/35" },
            { left: "94%", top: "58%", size: 34, dur: 4.7, delay: -1.2, dx: 26, dy: -20, spin: 58, op: 0.38, tone: "bg-gold/34" },
            { left: "80%", top: "90%", size: 58, dur: 5.8, delay: -5.1, dx: -30, dy: 22, spin: 44, op: 0.28, tone: "bg-cream/36" },
            { left: "96%", top: "82%", size: 24, dur: 4.1, delay: -2.9, dx: 20, dy: -16, spin: -70, op: 0.42, tone: "bg-cream/44" },
          ].map((b, i) => (
            <div
              key={i}
              className={`absolute hex-shape border border-gold/30 shadow-[0_14px_36px_-24px_var(--brand-gold)] ${b.tone}`}
              style={{
                left: b.left,
                top: b.top,
                width: `${b.size}px`,
                height: `${b.size * 1.05}px`,
                animation: `hive-bubble-float ${b.dur}s ease-in-out ${b.delay}s infinite`,
                ["--drift-x" as string]: `${b.dx}px`,
                ["--drift-y" as string]: `${b.dy}px`,
                ["--spin" as string]: `${b.spin}deg`,
                ["--opacity" as string]: `${b.op}`,
              }}
            />
          ))}
        </div>
        {/* Soft glow orbs */}
        <div className="absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-cream/20 blur-3xl" />

        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 pb-28 lg:pt-32 lg:pb-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:items-center">
            <div className="order-2 lg:order-1">
              <SectionReveal delay={80}>
                <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tight text-white">
                  Exterior cleaning,
                  <span className="block">
                    done <span className="italic text-gold">right</span>.
                  </span>
                </h1>
              </SectionReveal>

              <SectionReveal delay={160}>
                <p className="mt-8 max-w-xl text-lg sm:text-xl text-cream/75">
                  Soft wash, pressure wash, windows, docks, and drone cleaning across the
                  Lowcountry - from your front porch to a hundred feet up.
                </p>
              </SectionReveal>

              <SectionReveal delay={220}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-gold text-navy hover:bg-gold/90 h-12 px-7 text-base font-semibold shadow-[0_10px_30px_-8px_rgba(229,185,60,0.35)]"
                  >
                    <Link to="/contact">
                      Get a Free Estimate <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-gold/30 bg-gold/5 text-cream hover:bg-gold/10 hover:text-white h-12 px-7 text-base font-semibold backdrop-blur"
                  >
                    <Link to="/services">Explore services</Link>
                  </Button>
                </div>
              </SectionReveal>

              {/* Stat row */}
              <SectionReveal delay={320}>
                <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-cream/10 pt-8">
                  {[
                    { k: "100+ ft", v: "Drone reach" },
                    { k: "Soft-wash", v: "Safe on siding" },
                    { k: "5★", v: "Lowcountry-rated" },
                  ].map((s) => (
                    <div key={s.v}>
                      <dt className="font-display text-2xl sm:text-3xl text-white">{s.k}</dt>
                      <dd className="mt-1 text-xs sm:text-sm uppercase tracking-wider text-cream/60">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </SectionReveal>
            </div>

            <SectionReveal delay={200} className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg">
                <div className="absolute -inset-6 -z-10 rounded-full bg-gold/25 blur-3xl" />
                <div className="rounded-[2rem] bg-cream p-6 sm:p-7 shadow-2xl ring-4 ring-gold/50">
                  <HeroEstimateForm />
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

      </section>

      <TrustStrip />

      {/* SERVICE TEASERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionReveal className="max-w-2xl">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold">What we do</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-navy">Explore our traditional services</h2>
          <p className="mt-4 text-muted-foreground">
            Homes, storefronts, and the docks that hold your boat above the marsh - we handle the outside so you don't have to.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {teasers.map((s, i) => (
            <SectionReveal key={s.slug} delay={i * 80}>
              <Link
                to={s.path}
                className="group block overflow-hidden rounded-3xl bg-card border border-border shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={teaserImgs[s.slug]}
                    alt={s.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-navy">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <SectionReveal className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold">The proof</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-navy">Before &amp; after</h2>
          </div>
          <Link to="/gallery" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold">
            See more transformations <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              before: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=60&sat=-100",
              after: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
              alt: "Home siding",
            },
            {
              before: "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=900&q=60&sat=-100",
              after: "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=900&q=80",
              alt: "Dock",
            },
            {
              before: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=60&sat=-100",
              after: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
              alt: "Storefront",
            },
          ].map((p, i) => (
            <SectionReveal key={i} delay={i * 80}>
              <BeforeAfterSlider before={p.before} after={p.after} alt={p.alt} />
            </SectionReveal>
          ))}
        </div>
      </section>

      <ReviewsSection />

      {/* DRONE gold block - animated honeycomb texture */}
      <section className="relative isolate overflow-hidden bg-gold text-navy">
        {/* Drifting honeycomb pattern */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 -z-10 h-full w-[calc(100%+56px)] animate-[hex-drift_6s_linear_infinite] text-navy opacity-[0.10]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hive-drone" width="56" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M28 2 L54 17 L54 47 L28 62 L2 47 L2 17 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hive-drone)" />
        </svg>

        {/* Floating honeycomb bubbles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {[
            { left: "5%", top: "12%", size: 48, dur: 5.4, delay: -1.2, dx: 30, dy: -16, spin: 38, op: 0.42, tone: "bg-white/42" },
            { left: "10%", top: "62%", size: 24, dur: 4.2, delay: -2.9, dx: -16, dy: 14, spin: -62, op: 0.48, tone: "bg-cream/50" },
            { left: "16%", top: "32%", size: 72, dur: 6.0, delay: -4.4, dx: 26, dy: 22, spin: 26, op: 0.36, tone: "bg-white/38" },
            { left: "22%", top: "86%", size: 36, dur: 4.6, delay: -2.0, dx: -22, dy: -18, spin: 72, op: 0.44, tone: "bg-cream/46" },
            { left: "28%", top: "16%", size: 28, dur: 4.9, delay: -0.6, dx: 18, dy: 16, spin: -50, op: 0.40, tone: "bg-cream/48" },
            { left: "34%", top: "74%", size: 60, dur: 6.6, delay: -5.3, dx: -34, dy: -20, spin: 34, op: 0.34, tone: "bg-white/40" },
            { left: "40%", top: "6%", size: 40, dur: 4.4, delay: -3.6, dx: 24, dy: 24, spin: 66, op: 0.42, tone: "bg-white/44" },
            { left: "8%", top: "92%", size: 20, dur: 3.7, delay: -1.7, dx: -16, dy: -14, spin: -78, op: 0.50, tone: "bg-cream/52" },
            { left: "66%", top: "8%", size: 84, dur: 7.0, delay: -6.0, dx: 36, dy: -22, spin: 28, op: 0.28, tone: "bg-white/34" },
            { left: "58%", top: "90%", size: 44, dur: 4.8, delay: -2.5, dx: -26, dy: 18, spin: -46, op: 0.40, tone: "bg-cream/44" },
            { left: "76%", top: "80%", size: 26, dur: 4.0, delay: -3.3, dx: 16, dy: -16, spin: 74, op: 0.46, tone: "bg-white/46" },
            { left: "92%", top: "14%", size: 68, dur: 6.3, delay: -4.7, dx: -32, dy: 24, spin: -32, op: 0.32, tone: "bg-white/40" },
            { left: "98%", top: "60%", size: 32, dur: 4.5, delay: -1.0, dx: 24, dy: -18, spin: 56, op: 0.44, tone: "bg-cream/48" },
            { left: "84%", top: "92%", size: 56, dur: 5.6, delay: -4.9, dx: -28, dy: 20, spin: 42, op: 0.34, tone: "bg-cream/42" },
            { left: "100%", top: "84%", size: 22, dur: 3.9, delay: -2.7, dx: 18, dy: -14, spin: -68, op: 0.48, tone: "bg-white/48" },
            { left: "45%", top: "48%", size: 34, dur: 4.3, delay: -2.1, dx: -20, dy: 18, spin: 54, op: 0.46, tone: "bg-white/46" },
            { left: "52%", top: "22%", size: 18, dur: 3.5, delay: -0.9, dx: 14, dy: -12, spin: -60, op: 0.52, tone: "bg-cream/50" },
            { left: "72%", top: "38%", size: 52, dur: 5.8, delay: -3.9, dx: 28, dy: 20, spin: 40, op: 0.38, tone: "bg-white/40" },
            { left: "38%", top: "96%", size: 30, dur: 4.1, delay: -1.5, dx: -18, dy: -16, spin: -44, op: 0.44, tone: "bg-cream/46" },
            { left: "62%", top: "68%", size: 42, dur: 5.2, delay: -4.0, dx: 22, dy: -20, spin: 64, op: 0.40, tone: "bg-white/44" },
          ].map((b, i) => (
            <div
              key={i}
              className={`absolute hex-shape border border-navy/25 shadow-[0_14px_36px_-24px_var(--brand-navy)] ${b.tone}`}
              style={{
                left: b.left,
                top: b.top,
                width: `${b.size}px`,
                height: `${b.size * 1.05}px`,
                animation: `hive-bubble-float ${b.dur}s ease-in-out ${b.delay}s infinite`,
                ["--drift-x" as string]: `${b.dx}px`,
                ["--drift-y" as string]: `${b.dy}px`,
                ["--spin" as string]: `${b.spin}deg`,
                ["--opacity" as string]: `${b.op}`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-10 md:grid-cols-2 items-center">
          <SectionReveal>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-navy">
              <Sparkles className="h-3.5 w-3.5" /> New capability
            </span>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl text-navy leading-[0.95]">
              Drone Cleaning
            </h2>
            <p className="mt-5 text-navy/85 text-lg max-w-md">
              Where ladders end, our drone begins. Low-pressure soft-wash chemistry for steeples,
              multi-story homes, and tall commercial facades. 100+ feet up, same clean, no ladders.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="rounded-full bg-navy text-white hover:bg-navy/90 h-12 px-7 font-semibold shadow-[0_10px_30px_-8px_rgba(27,42,74,0.35)]"
              >
                <Link to="/drone-cleaning">Learn more</Link>
              </Button>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold text-navy backdrop-blur-sm border border-navy/15">
                Partnered with <span className="font-display tracking-wide text-navy">LUCID BOTS</span>
              </div>
            </div>
          </SectionReveal>
          <SectionReveal delay={120}>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40">
              <img
                src={DRONE_IMG}
                alt="Drone soft-wash cleaning a tall building"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FINAL CTA - soft cream break between gold and navy footer */}
      <section className="bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-navy">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Lowcountry trusted
            </span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl">Ready for a cleaner property?</h2>
            <p className="mt-3 text-navy/70 text-lg">
              Free estimates. Fast quotes. We serve {SITE.city} and the Lowcountry.
            </p>
            <Button
              asChild
              className="mt-7 rounded-full bg-navy text-white hover:bg-navy/90 h-12 px-8 font-semibold shadow-lg"
            >
              <Link to="/contact">Get your free estimate</Link>
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
