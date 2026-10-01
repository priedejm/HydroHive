import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/site/SectionReveal";
import { cn } from "@/lib/utils";
import { useTeam, useSite } from "@/lib/content/hooks";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Meet the Hive · Hydro Hive" },
      {
        name: "description",
        content: "Meet Ben and Nate - the locally owned crew behind Hydro Hive Charleston.",
      },
      { property: "og:title", content: "Meet the Hive · Hydro Hive" },
      {
        property: "og:description",
        content: "The crew behind Charleston's locally owned exterior cleaning company.",
      },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  const team = useTeam();
  const site = useSite();

  return (
    <div>
      <section className="relative bg-cream">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Who we are
            </span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl text-navy">{team.heroTitle}</h1>
            <p className="mt-4 text-muted-foreground">{team.heroSub}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-primary-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold">
                {site.established} · {site.city}
              </span>
            </div>
          </SectionReveal>
        </div>
        <SectionReveal delay={120}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="overflow-hidden rounded-3xl shadow-lg border-4 border-white">
              <img
                src={team.heroImage}
                alt="The Hive crew on site"
                className="w-full aspect-[4/3] object-cover object-bottom"
              />
            </div>
          </div>
        </SectionReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-20">
        {team.members.map((m, i) => {
          const reverse = i % 2 === 1;
          return (
            <SectionReveal key={m.first}>
              <div
                className={cn(
                  "grid gap-10 md:grid-cols-[minmax(0,340px)_1fr] items-center",
                  reverse && "md:grid-cols-[1fr_minmax(0,340px)] md:[&>*:first-child]:order-2",
                )}
              >
                <div className="mx-auto">
                  <img
                    src={m.photo}
                    alt={`${m.first} - Hydro Hive crew`}
                    className="h-80 w-auto object-contain"
                  />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">
                    {m.role}
                  </span>
                  <h2 className="mt-2 font-display text-4xl text-navy">{m.first}</h2>
                  <div className="mt-4 space-y-4 text-muted-foreground">
                    {m.bio.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </section>

      <section className="bg-gold">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl text-navy">{team.storyTitle}</h2>
            <p className="mt-4 text-navy/85">{team.storyBody}</p>
            <Button
              asChild
              className="mt-6 rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-12 px-7 font-semibold"
            >
              <Link to="/contact">Work with the Hive</Link>
            </Button>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
