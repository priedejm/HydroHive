import type { ServiceSlug } from "@/lib/site";

export const SERVICE_CONTENT: Record<
  ServiceSlug,
  {
    image: string;
    bullets: string[];
    faqs: Array<{ q: string; a: string }>;
  }
> = {
  residential: {
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Soft wash siding & roofs",
      "Pressure wash driveways & pavers",
      "Streak-free window cleaning",
      "Gutter brightening",
    ],
    faqs: [
      {
        q: "What's the difference between soft washing and pressure washing?",
        a: "Soft washing uses low pressure and a cleaning solution to safely lift algae, mildew, and grime from siding and roofs without damaging paint or shingles. Pressure washing uses higher water pressure and is best suited for hard, durable surfaces like concrete driveways, pavers, and brick.",
      },
      {
        q: "How often should I have my house washed?",
        a: "Most Charleston homes benefit from an annual soft wash - the humidity and salt air here speed up algae and mildew growth. Homes in shaded or marsh-adjacent areas may need it more often.",
      },
      {
        q: "Is soft washing safe for my landscaping and paint?",
        a: "Yes. We use low-pressure application and rinse thoroughly, and we take care to protect plants and landscaping around your home during the process.",
      },
      {
        q: "Do you serve my neighborhood?",
        a: "We serve homes across the Charleston peninsula and the greater Lowcountry, including Mount Pleasant, James Island, West Ashley, and Daniel Island. See our service area pages or reach out and we'll confirm.",
      },
    ],
  },
  commercial: {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "After-hours scheduling",
      "Fully insured / W-9 ready",
      "Storefronts, restaurants, offices",
      "Parking lots & sidewalks",
    ],
    faqs: [
      {
        q: "Can you schedule around our business hours?",
        a: "Yes - we regularly schedule early mornings, evenings, and weekends so cleaning doesn't interrupt your customers or operations.",
      },
      {
        q: "Are you insured for commercial properties?",
        a: "Yes, we're fully insured and can provide a W-9 and certificate of insurance for property managers and businesses that require it.",
      },
      {
        q: "What kinds of commercial properties do you clean?",
        a: "Storefronts, restaurants, offices, parking lots, sidewalks, and multi-tenant buildings across Charleston and the Lowcountry - from King Street boutiques to industrial facilities.",
      },
      {
        q: "Do you offer recurring maintenance plans?",
        a: "Many of our commercial clients book us on a recurring schedule to keep storefronts and walkways consistently clean. Ask about a maintenance plan when you request your quote.",
      },
    ],
  },
  dock: {
    image: "https://images.unsplash.com/photo-1523496922380-91d5afba98a3?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Marine-safe chemistry",
      "Mildew & algae removal",
      "Wood restoration",
      "No harm to marsh or waterway",
    ],
    faqs: [
      {
        q: "Is your dock cleaning process safe for the marsh and waterway?",
        a: "Yes - we use marine-safe chemistry specifically chosen to lift mildew, algae, and salt buildup without harming the marsh, pluff mud, or water around your dock.",
      },
      {
        q: "Can you restore weathered or graying dock wood?",
        a: "In most cases, yes. Our cleaning process lifts years of algae and salt buildup and can significantly brighten weathered wood, restoring a lot of its original look.",
      },
      {
        q: "Do you clean boat lifts and boardwalks too?",
        a: "Yes - we clean boardwalks, boat lifts, and dock decking as part of a full dock service.",
      },
      {
        q: "How often does a dock need to be cleaned?",
        a: "Most Lowcountry docks benefit from cleaning once or twice a year, depending on sun exposure and how close they sit to the marsh.",
      },
    ],
  },
  "drone-cleaning": {
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80",
    bullets: [
      "Steeples & multi-story homes",
      "Tall commercial facades",
      "100+ ft reach, no ladders",
      "Partnered with LucidBots",
    ],
    faqs: [
      {
        q: "How high can the cleaning drone reach?",
        a: "Our LucidBots drone system reaches 100+ feet, covering steeples, multi-story homes, and tall commercial facades that ladders and lifts can't safely reach.",
      },
      {
        q: "Is drone cleaning safe for my property?",
        a: "Yes - the drone applies the same low-pressure soft-wash chemistry we use on the ground, just from the air, so there's no ladder risk and no foot traffic on delicate roofing.",
      },
      {
        q: "What kinds of buildings is drone cleaning best for?",
        a: "Steeples, church facades, multi-story homes, condo and apartment buildings, and tall commercial exteriors where traditional access equipment is impractical or costly.",
      },
      {
        q: "Do I need to be present during a drone cleaning?",
        a: "No, but we do coordinate access and scheduling ahead of time. Reach out and we'll walk you through what to expect for your specific building.",
      },
    ],
  },
};
