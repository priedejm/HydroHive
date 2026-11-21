import { ShieldCheck, Star, MapPin, Calendar } from "lucide-react";
import { useContent } from "@/cms/SiteData";
import { contactInfo } from "@/content/defaults";

export function TrustStrip() {
  const { contact, google, trustStrip } = useContent().site;
  const items = [
    { icon: ShieldCheck, label: trustStrip.owned },
    { icon: Star, label: `${google.rating.toFixed(1)} on Google` },
    { icon: Calendar, label: contact.established },
    { icon: MapPin, label: contactInfo(contact).city },
  ];
  return (
    <div className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-y-4 py-6 sm:grid-cols-4">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 text-navy">
              <Icon className="h-5 w-5 text-gold" />
              <span className="text-sm font-semibold">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
