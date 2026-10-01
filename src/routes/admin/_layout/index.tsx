import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SERVICE_ROUTES, LOCATION_ROUTES } from "@/lib/site";

export const Route = createFileRoute("/admin/_layout/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminDashboard,
});

const SECTION_LINKS = [
  {
    to: "/admin/home",
    title: "Home page",
    description: "Hero, service teasers, drone block, final CTA",
  },
  {
    to: "/admin/gallery",
    title: "Before & after gallery",
    description: "Portfolio photos shown on the gallery page and home",
  },
  { to: "/admin/team", title: "Team", description: "Team bios, photos, and the Our Story section" },
  {
    to: "/admin/reviews",
    title: "Reviews",
    description: "Customer review text shown across the site",
  },
  {
    to: "/admin/site",
    title: "Site settings",
    description: "Business name, contact info, and address",
  },
  { to: "/admin/seo", title: "SEO", description: "Page titles and descriptions" },
] as const;

function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a page to edit its photos and text.
        </p>
      </div>

      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {SECTION_LINKS.map((s) => (
            <Link key={s.to} to={s.to}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base text-navy">{s.title}</CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-navy">Services</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {SERVICE_ROUTES.map((s) => (
            <Link key={s.slug} to="/admin/services/$slug" params={{ slug: s.slug }}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base text-navy capitalize">
                    {s.slug.replace("-", " ")}
                  </CardTitle>
                  <CardDescription>Description, bullets, FAQs, and photos</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-navy">Service areas</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {LOCATION_ROUTES.map((l) => (
            <Link key={l.slug} to="/admin/service-areas/$slug" params={{ slug: l.slug }}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base text-navy capitalize">
                    {l.slug.replace(/-/g, " ")}
                  </CardTitle>
                  <CardDescription>Description and neighborhoods</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
