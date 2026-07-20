import { createFileRoute } from "@tanstack/react-router";
import { SectionReveal } from "@/components/site/SectionReveal";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Before & After · Hydro Hive" },
      {
        name: "description",
        content: "See the transformation. Before & after photos of Hydro Hive exterior cleaning projects across Charleston, SC.",
      },
      { property: "og:title", content: "Before & After · Hydro Hive" },
      { property: "og:description", content: "Real Hydro Hive transformations in the Lowcountry." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

type Item = { id: string; before: string; after: string; label: string };

/* Replace placeholder images with real before/after project photos */
const ITEMS: Item[] = [
  { id: "r1", label: "Home siding - West Ashley", before: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80" },
  { id: "r2", label: "Driveway - Mount Pleasant", before: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { id: "r3", label: "Roof soft wash - James Island", before: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
  { id: "c1", label: "Storefront - King St", before: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
  { id: "c2", label: "Bank exterior", before: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=900&q=80" },
  { id: "d1", label: "Private dock - Wando River", before: "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=900&q=80" },
  { id: "d2", label: "Boardwalk restoration", before: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=60&sat=-100", after: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80" },
];

function GalleryPage() {
  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Portfolio</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">Before &amp; After</h1>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">
              Drag the slider on each project to reveal the transformation. Real work, real Lowcountry properties.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 60}>
              <div>
                <BeforeAfterSlider before={item.before} after={item.after} alt={item.label} />
                <div className="mt-3 text-sm font-semibold text-navy">{item.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <p className="mt-14 text-center text-xs text-muted-foreground">
          Placeholder imagery - swap in real project photos.
        </p>
      </section>
    </div>
  );
}
