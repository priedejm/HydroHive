import { createFileRoute } from "@tanstack/react-router";
import { SectionReveal } from "@/components/site/SectionReveal";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import before1 from "@/assets/before1.jpeg";
import after1 from "@/assets/after1.jpeg";
import before2 from "@/assets/before2.webp";
import after2 from "@/assets/after2.jpeg";
import before3 from "@/assets/before3.webp";
import after3 from "@/assets/after3.webp";
import before4 from "@/assets/before4.webp";
import after4 from "@/assets/after4.jpeg";

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

const ITEMS: Item[] = [
  { id: "r1", label: "Deck & Siding Soft Wash", before: before1, after: after1 },
  { id: "r2", label: "Home Exterior & Walkway", before: before2, after: after2 },
  { id: "r3", label: "Roof & Deck Restoration", before: before3, after: after3 },
  { id: "r4", label: "Pool Deck & Pavers", before: before4, after: after4 },
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
        <div className="grid gap-6 sm:grid-cols-2">
          {ITEMS.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 60}>
              <div>
                <BeforeAfterSlider before={item.before} after={item.after} alt={item.label} />
                <div className="mt-3 text-sm font-semibold text-navy">{item.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
