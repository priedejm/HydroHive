import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Star } from "lucide-react";
import wordmark from "@/assets/hydro-hive-bee-wordmark.svg";
import { NAV, SERVICES, LOCATIONS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
          <div className="rounded-3xl bg-cream p-5 inline-block overflow-visible">
            <img src={wordmark} alt="Hydro Hive" className="h-28 sm:h-32 w-auto" />
          </div>
          <p className="mt-5 text-base text-primary-foreground/70 max-w-xs">
              Charleston's locally owned exterior cleaning crew. Soft wash, pressure wash, windows, docks, and drone.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link
                    to={n.to}
                    hash={"hash" in n ? n.hash : undefined}
                    className="text-primary-foreground/80 hover:text-gold transition-colors"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Get a Free Estimate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={s.path} className="text-primary-foreground/80 hover:text-gold transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Service Areas</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link to={l.path} className="text-primary-foreground/80 hover:text-gold transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold">
                  <Mail className="h-4 w-4" /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold">
                  <Phone className="h-4 w-4" /> {SITE.phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.fullAddress}
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3 flex-nowrap">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-gold hover:text-navy transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Locally Owned
                <span className="mx-1 h-3 w-px bg-primary-foreground/30" aria-hidden="true" />
                <Star className="h-3.5 w-3.5 text-gold fill-gold" /> Google 5.0
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-6">
          <p className="text-sm italic text-primary-foreground/75 text-center sm:text-left">
            Proud to serve the Lowcountry with precision, pride, and a little buzz.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <div>{SITE.established} · {SITE.city} · Locally Owned & Operated</div>
            <div>© {new Date().getFullYear()} Hydro Hive Exterior Cleaning Services. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
