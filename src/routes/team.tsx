import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/site/SectionReveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Meet the Hive · Hydro Hive" },
      { name: "description", content: "Meet Ben and Nate - the locally owned crew behind Hydro Hive Charleston." },
      { property: "og:title", content: "Meet the Hive · Hydro Hive" },
      { property: "og:description", content: "The crew behind Charleston's locally owned exterior cleaning company." },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

type Member = {
  first: string;
  initials: string;
  role: string;
  bio: string[];
};

const TEAM: Member[] = [
  {
    first: "Ben",
    initials: "B",
    role: "Operations · Engineer",
    bio: [
      "Ben is the engineer of the group (Clemson class of 2024). But before college and all the way through it, he was working in the service industry.",
      "Eight years of experience will teach you that the technical fix is only half the job - the other half is the person standing in front of you.",
      "Off the clock, you'll find Ben on the golf course, on the mat, or enjoying live music at Chico Feo.",
    ],
  },
  {
    first: "Nate",
    initials: "N",
    role: "Field · Lacrosse alum",
    bio: [
      "Nate is one of five kids. He grew up on a horse farm in Maryland - his family means everything to him.",
      "Nate played college lacrosse for Bill Tierney at the University of Denver. His older brother Henry played at Notre Dame and his little brother Ben plays for Ohio State. Cousins scattered across Duke, Princeton, Maryland, Georgetown, Navy, Lehigh, Towson, Dartmouth, and High Point.",
      "Nate enjoys competing in Brazilian jiu-jitsu and surfing/skating in his free time.",
    ],
  },
];

function TeamPage() {
  return (
    <div>
      <section className="relative bg-cream">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Who we are</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl text-navy">Meet the Hive</h1>
            <p className="mt-4 text-muted-foreground">
              Locally owned, Charleston-based, and small on purpose. Two guys who show up, work hard,
              and treat your property like their own.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-primary-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold">Est. 2025 · Charleston, SC</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-20">
        {TEAM.map((m, i) => {
          const reverse = i % 2 === 1;
          return (
            <SectionReveal key={m.first}>
              <div className={cn("grid gap-10 md:grid-cols-[minmax(0,340px)_1fr] items-center", reverse && "md:grid-cols-[1fr_minmax(0,340px)] md:[&>*:first-child]:order-2")}>
                <div className="mx-auto">
                  <div className="relative">
                    <div className="h-72 w-72 rounded-3xl border-4 border-dashed border-navy/40 bg-cream grid place-items-center">
                      <span className="font-display text-[10rem] text-navy/30 leading-none">{m.initials}</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-52 rounded-full border-4 border-gold bg-navy px-4 py-3 text-center shadow-lg">
                      <span className="font-display italic text-gold text-2xl tracking-wide">{m.first}</span>
                    </div>
                  </div>
                  <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/40 px-3 py-1.5 text-xs font-semibold text-navy">
                    <Camera className="h-3.5 w-3.5" /> Replace with {m.first}'s headshot
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">{m.role}</span>
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
            <h2 className="font-display text-4xl text-navy">Our story</h2>
            <p className="mt-4 text-navy/85">
              Hydro Hive was founded in 2025 by a small crew who believed Charleston deserved better
              exterior cleaning - the kind where somebody shows up on time, does the work right, and
              stands behind it. Locally owned. Locally run. That's it. That's the promise.
            </p>
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
