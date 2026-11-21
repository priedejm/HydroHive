import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Star } from "lucide-react";
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
import { telHref } from "@/cms/Rich";
import { contactInfo } from "@/content/defaults";

export function Footer() {
  const content = useContent();
  const wordmark = useImage("footer-logo");
  const { contact, google } = content.site;
  const { nav } = content.site.header;
  const f = content.site.footer;
  const { city, fullAddress } = contactInfo(contact);
  const services = SERVICE_ROUTES.map((r) => ({ slug: r.slug, name: content[SERVICE_PAGE[r.slug]].about.name }));
  const locations = LOCATION_ROUTES.map((r) => ({ slug: r.slug, name: content[LOCATION_PAGE[r.slug]].about.name }));
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="rounded-3xl bg-cream p-5 inline-block overflow-visible">
              <img src={wordmark} alt={contact.name} className="h-28 sm:h-32 w-auto" />
            </div>
            <p className="mt-5 text-base text-primary-foreground/70 max-w-xs">
              {f.blurb}
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">{f.exploreHeading}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.key}>
                  <Link
                    to={n.to}
                    hash={"hash" in n ? n.hash : undefined}
                    className="text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {nav[n.key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-gold transition-colors"
                >
                  {f.estimateLink}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">{f.servicesHeading}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={getServicePath(s.slug)}
                    className="text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">
              {f.areasHeading}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    to={getLocationPath(l.slug)}
                    className="text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">{f.contactHeading}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold"
                >
                  <Mail className="h-4 w-4" /> {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={telHref(contact.phone)}
                  className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold"
                >
                  <Phone className="h-4 w-4" /> {contact.phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {fullAddress}
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3 flex-nowrap">
              <a
                href={safeHref(contact.instagram)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" /> {f.badge}
                <span className="mx-1 h-3 w-px bg-primary-foreground/30" aria-hidden="true" />
                <Star className="h-3.5 w-3.5 text-gold fill-gold" /> Google{" "}
                {google.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-6">
          <p className="text-sm italic text-primary-foreground/75 text-center sm:text-left">
            {f.tagline}
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {contact.established} · {city} · {f.bottomNote}
            </div>
            <div>
              © {new Date().getFullYear()} {contact.legalName}. {f.rights}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
