import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  NAV,
  SERVICE_ROUTES,
  LOCATION_ROUTES,
  SERVICE_PAGE,
  LOCATION_PAGE,
  getServicePath,
  getLocationPath,
} from "@/lib/site";
import { useContent, useImage } from "@/cms/SiteData";
import { safeHref } from "@/cms/SmartLink";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const content = useContent();
  const logo = useImage("site-logo");
  const { contact } = content.site;
  const { nav, ctaLabel, followUs } = content.site.header;
  const services = SERVICE_ROUTES.map((r) => ({ slug: r.slug, name: content[SERVICE_PAGE[r.slug]].about.name }));
  const locations = LOCATION_ROUTES.map((r) => ({ slug: r.slug, name: content[LOCATION_PAGE[r.slug]].about.name }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "bg-cream/90 backdrop-blur border-b border-border shadow-sm"
          : "bg-cream/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={`${contact.name} home`}>
          <img src={logo} alt={contact.name} className="h-12 w-auto sm:h-14" />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-1">
          {NAV.map((item) => {
            if (item.key === "services") {
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/5",
                      services.some((s) => pathname === getServicePath(s.slug)) && "bg-navy/5",
                    )}
                    activeProps={{ className: "bg-navy/5" }}
                  >
                    {nav[item.key]}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  {servicesOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                      <div className="min-w-[220px] rounded-2xl border border-border bg-card p-2 shadow-xl">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            to={getServicePath(s.slug)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if (item.key === "serviceAreas") {
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setAreasOpen(true)}
                  onMouseLeave={() => setAreasOpen(false)}
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/5",
                      locations.some((l) => pathname === getLocationPath(l.slug)) && "bg-navy/5",
                    )}
                    activeProps={{ className: "bg-navy/5" }}
                  >
                    {nav[item.key]}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  {areasOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                      <div className="min-w-[220px] rounded-2xl border border-border bg-card p-2 shadow-xl">
                        {locations.map((l) => (
                          <Link
                            key={l.slug}
                            to={getLocationPath(l.slug)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                          >
                            {l.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const hash = "hash" in item ? item.hash : undefined;
            return (
              <Link
                key={item.key}
                to={item.to}
                hash={hash}
                className="rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
                activeProps={{ className: hash ? undefined : "bg-navy/5" }}
                activeOptions={{ exact: item.to === "/" && !hash }}
              >
                {nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 justify-end shrink-0">
          <a
            href={safeHref(contact.instagram)}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-navy/5"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Button
            asChild
            className="hidden sm:inline-flex rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-11 px-5 font-semibold"
          >
            <Link to="/contact">{ctaLabel}</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-navy/5"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm bg-cream p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <img src={logo} alt="" className="h-10 w-auto" />
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-navy/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col p-4">
                {NAV.map((item) => {
                  const hash = "hash" in item ? item.hash : undefined;
                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      hash={hash}
                      className="rounded-xl px-4 py-3 text-base font-semibold text-navy hover:bg-navy/5"
                    >
                      {nav[item.key]}
                    </Link>
                  );
                })}
                <div className="mt-2 border-t border-border pt-2">
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {nav.services}
                  </div>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      to={getServicePath(s.slug)}
                      className="block rounded-xl px-4 py-2.5 text-sm text-navy hover:bg-navy/5"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-2 border-t border-border pt-2">
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {nav.serviceAreas}
                  </div>
                  {locations.map((l) => (
                    <Link
                      key={l.slug}
                      to={getLocationPath(l.slug)}
                      className="block rounded-xl px-4 py-2.5 text-sm text-navy hover:bg-navy/5"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
                <Button
                  asChild
                  className="mt-6 h-12 rounded-full bg-cta text-cta-foreground hover:bg-cta/90 font-semibold"
                >
                  <Link to="/contact">{ctaLabel}</Link>
                </Button>
                <a
                  href={safeHref(contact.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium text-navy"
                >
                  <Instagram className="h-4 w-4" /> {followUs}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
