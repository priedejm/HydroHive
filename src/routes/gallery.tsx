import { createFileRoute } from "@tanstack/react-router";
import { SectionReveal } from "@/components/site/SectionReveal";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { useGalleryContent } from "@/lib/content/hooks";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Before & After · Hydro Hive" },
      {
        name: "description",
        content:
          "See the transformation. Before & after photos of Hydro Hive exterior cleaning projects across Charleston, SC.",
      },
      { property: "og:title", content: "Before & After · Hydro Hive" },
      { property: "og:description", content: "Real Hydro Hive transformations in the Lowcountry." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const gallery = useGalleryContent();

  return (
    <div>
      <section className="bg-navy text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <SectionReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Portfolio</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">{gallery.heroTitle}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">{gallery.heroSub}</p>
          </SectionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {gallery.items.map((item, i) => (
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
