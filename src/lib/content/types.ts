import type { LocationSlug, ServiceSlug } from "@/lib/site";

export type SiteInfo = {
  name: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  phoneHref: string;
  city: string;
  street: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  fullAddress: string;
  instagram: string;
  established: string;
  domain: string;
  googleRating: number;
  googleReviewCount: number;
  googleReviewsUrl: string;
};

export type ServiceCopy = {
  slug: ServiceSlug;
  name: string;
  short: string;
  long: string;
  cta: string;
};

export type LocationCopy = {
  slug: LocationSlug;
  name: string;
  region: string;
  short: string;
  long: string;
  neighborhoods: string[];
};

export type Faq = { q: string; a: string };
export type GalleryImage = { src: string; alt: string };

export type ServiceContentEntry = {
  image: string;
  bullets: string[];
  faqs: Faq[];
  gallery?: GalleryImage[];
};

export type Review = {
  name: string;
  meta: string;
  timeAgo: string;
  text: string;
};

export type TeamMember = {
  first: string;
  photo: string;
  role: string;
  bio: string[];
};

export type TeamContent = {
  heroTitle: string;
  heroSub: string;
  heroImage: string;
  members: TeamMember[];
  storyTitle: string;
  storyBody: string;
};

export type HomeStat = { k: string; v: string };

export type HomeContent = {
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSub: string;
  statRow: HomeStat[];
  serviceTeaserEyebrow: string;
  serviceTeaserHeading: string;
  serviceTeaserSub: string;
  images: {
    residential: string;
    commercial: string;
    dock: string;
    droneBlock: string;
  };
  beforeAfterEyebrow: string;
  beforeAfterHeading: string;
  droneEyebrow: string;
  droneHeading: string;
  droneBody: string;
  finalCtaHeading: string;
  finalCtaSub: string;
};

export type GalleryItem = { id: string; label: string; before: string; after: string };

export type GalleryContent = {
  heroTitle: string;
  heroSub: string;
  items: GalleryItem[];
};

export type SeoEntry = {
  title: string;
  description: string;
};

export type SiteContent = {
  site: SiteInfo;
  services: ServiceCopy[];
  locations: LocationCopy[];
  service_content: Record<ServiceSlug, ServiceContentEntry>;
  reviews: Review[];
  team: TeamContent;
  home: HomeContent;
  gallery: GalleryContent;
  seo: Record<string, SeoEntry>;
};

export type SectionKey = keyof SiteContent;
