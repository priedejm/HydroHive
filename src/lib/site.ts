export const SITE = {
  name: "Hydro Hive",
  legalName: "Hydro Hive Exterior Cleaning Services",
  tagline: "Exterior Cleaning Services",
  email: "info@thehydrohive.com",
  phone: "(854) 222-9125",
  phoneHref: "tel:+18542229125",
  city: "Charleston, SC",
  street: "170 Smith St",
  addressLocality: "Charleston",
  addressRegion: "SC",
  postalCode: "29403",
  fullAddress: "170 Smith St, Charleston, SC 29403",
  instagram: "https://instagram.com/thehydrohive",
  established: "Est. 2025",
  domain: "https://thehydrohive.com",
  googleRating: 5.0,
  googleReviewCount: 34,
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Hydro+Hive+170+Smith+St+Charleston+SC+29403",
};

export type ServiceSlug = "residential" | "commercial" | "dock" | "drone-cleaning";

export const SERVICES: Array<{
  slug: ServiceSlug;
  path: string;
  name: string;
  short: string;
  long: string;
  cta: string;
}> = [
  {
    slug: "residential",
    path: "/residential",
    name: "Residential",
    short: "Soft washing, pressure washing, and window cleaning for homes across the Lowcountry.",
    long: "From historic Charleston single houses to new construction in Mount Pleasant, we tailor pressure and chemistry to protect your siding, paint, brick, and landscaping - while lifting years of grime, algae, and salt spray in a single visit.",
    cta: "Quote your House",
  },
  {
    slug: "commercial",
    path: "/commercial",
    name: "Commercial",
    short: "Storefronts, restaurants, offices, and parking lots - fully insured, flexibly scheduled.",
    long: "Flexible scheduling including after-hours and early mornings so your customers only see the result. Fully insured, W-9 ready, and comfortable working around active operations from King Street boutiques to industrial facilities.",
    cta: "Quote your Business",
  },
  {
    slug: "dock",
    path: "/dock",
    name: "Docks",
    short: "Marine-safe treatments, mildew and algae removal, and gentle wood restoration.",
    long: "Charleston is a waterfront town, and your dock takes a beating. We use marine-safe chemistry to lift mildew, algae, and salt buildup and restore wood without harming the water around it.",
    cta: "Quote your Dock",
  },
  {
    slug: "drone-cleaning",
    path: "/drone-cleaning",
    name: "Drone Cleaning",
    short: "Low-pressure soft-wash chemistry for steeples, multi-story homes, and tall facades - 100+ feet up, no ladders.",
    long: "Where ladders end, our drone begins. Partnered with LucidBots, we bring low-pressure soft-wash chemistry to steeples, multi-story homes, and tall commercial facades. 100+ feet up, same clean, no ladders.",
    cta: "Inquire Today",
  },
];

export function getService(slug: ServiceSlug) {
  return SERVICES.find((s) => s.slug === slug)!;
}

export type LocationSlug =
  | "downtown-charleston"
  | "mount-pleasant"
  | "james-island"
  | "west-ashley"
  | "daniel-island";

export const LOCATIONS: Array<{
  slug: LocationSlug;
  path: string;
  name: string;
  region: string;
  short: string;
  long: string;
  neighborhoods: string[];
}> = [
  {
    slug: "downtown-charleston",
    path: "/service-areas/downtown-charleston",
    name: "Downtown Charleston",
    region: "The Peninsula",
    short: "Historic single houses, King Street storefronts, and peninsula stoops - washed with care for old brick, stucco, and paint.",
    long: "The peninsula's historic homes and storefronts need a lighter touch - low-pressure soft washing that lifts algae, mildew, and salt haze from siding, brick, and stucco without damaging century-old materials. We work early mornings and off-hours around King Street and Upper King so business keeps moving.",
    neighborhoods: ["King Street", "South of Broad", "Cannonborough-Elliotborough", "Wagener Terrace", "Hampton Park"],
  },
  {
    slug: "mount-pleasant",
    path: "/service-areas/mount-pleasant",
    name: "Mount Pleasant",
    region: "East Cooper",
    short: "New construction and family homes across Mount Pleasant, plus the docks lining Shem Creek and the Wando.",
    long: "From Old Village to new-build neighborhoods off Highway 17, Mount Pleasant homes face heavy pollen, humidity, and salt air off the harbor. We soft wash siding and roofs, pressure wash driveways and pavers, and take care of the docks along Shem Creek and the Wando River.",
    neighborhoods: ["Old Village", "Shem Creek", "I'On", "Park West", "Rivertowne"],
  },
  {
    slug: "james-island",
    path: "/service-areas/james-island",
    name: "James Island",
    region: "James Island",
    short: "Marsh-front homes and docks between the Stono and the harbor - soft washing and marine-safe dock care.",
    long: "James Island's marsh-front homes and docks take a beating from humidity, algae, and pluff mud spray. We bring soft-wash chemistry safe for landscaping and waterways, and marine-safe treatments for docks along the Stono River and the creeks feeding Charleston Harbor.",
    neighborhoods: ["Folly Road", "Riverland Terrace", "Fort Johnson", "Harbor View Road"],
  },
  {
    slug: "west-ashley",
    path: "/service-areas/west-ashley",
    name: "West Ashley",
    region: "West Ashley",
    short: "Established neighborhoods and busy retail corridors along Savannah Highway and Ashley River Road.",
    long: "West Ashley's mix of established neighborhoods and commercial corridors along Savannah Highway and Ashley River Road means we're just as comfortable soft washing a family home as we are scheduling after-hours pressure washing for a storefront or office.",
    neighborhoods: ["Avondale", "South Windermere", "Ashleyville", "St. Andrews"],
  },
  {
    slug: "daniel-island",
    path: "/service-areas/daniel-island",
    name: "Daniel Island",
    region: "Daniel Island",
    short: "Newer construction, HOA-standard curb appeal, and riverfront docks between the Cooper and Wando.",
    long: "Daniel Island's newer homes and tight HOA standards call for clean, even results every time - soft-washed siding and roofs, pressure-washed driveways and pool decks, and marine-safe care for docks along the Cooper and Wando Rivers.",
    neighborhoods: ["Smythe Park", "Codner's Ferry", "Beresford Creek", "Etiwan Park"],
  },
];

export function getLocation(slug: LocationSlug) {
  return LOCATIONS.find((l) => l.slug === slug)!;
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/", hash: "reviews", label: "Reviews" },
  { to: "/gallery", label: "Before & After" },
  { to: "/team", label: "Meet the Hive" },
] as const;
