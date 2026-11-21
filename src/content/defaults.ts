/**
 * All editable text on the site, as bundled at build time.
 *
 * The admin (/admin) saves only what differs from this object to
 * site-data/content.json; src/cms/merge.ts lays that over these defaults.
 * With nothing saved, the site renders exactly this.
 *
 * Shape rules (see src/cms/merge.ts):
 *   - top-level keys are admin pages, their keys are sections (always objects)
 *   - every array needs at least one item (the first is the template for new items)
 *   - photos inside records are a `photo` field: "static:<key>" (STATIC_IMAGES
 *     in media.ts) or an "/uploads/content/..." URL
 *
 * SEO titles/descriptions are NOT here - they stay in each route's head().
 */

export const DEFAULTS = {
  site: {
    contact: {
      name: "Hydro Hive",
      legalName: "Hydro Hive Exterior Cleaning Services",
      phone: "(854) 222-9125",
      email: "info@thehydrohive.com",
      street: "170 Smith St",
      city: "Charleston",
      state: "SC",
      zip: "29403",
      instagram: "https://instagram.com/thehydrohive",
      established: "Est. 2025",
    },
    google: {
      rating: 5.0,
      reviewCount: 34,
      reviewsUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Hydro+Hive+170+Smith+St+Charleston+SC+29403",
    },
    header: {
      nav: {
        home: "Home",
        services: "Services",
        serviceAreas: "Service Areas",
        reviews: "Reviews",
        gallery: "Before & After",
        team: "Meet the Hive",
      },
      ctaLabel: "Get a Free Estimate",
      followUs: "Follow us",
    },
    footer: {
      blurb:
        "Charleston's locally owned exterior cleaning crew. Soft wash, pressure wash, windows, docks, and drone.",
      exploreHeading: "Explore",
      servicesHeading: "Services",
      areasHeading: "Service Areas",
      contactHeading: "Contact",
      estimateLink: "Get a Free Estimate",
      badge: "Locally Owned",
      tagline: "Proud to serve the Lowcountry with precision, pride, and a little buzz.",
      bottomNote: "Locally Owned & Operated",
      rights: "All rights reserved.",
    },
    trustStrip: {
      owned: "Locally Owned & Operated",
    },
    estimateForm: {
      title: "Get a Free Estimate",
      sub: "Quick quote - we'll follow up within 24 hours.",
      button: "Get My Free Estimate",
      sending: "Sending...",
      doneTitle: "You're all set.",
      doneText: "Someone from the Hive will reach out within 24 hours.",
      again: "Submit another",
    },
    quoteWizard: {
      steps: {
        service: "Service",
        property: "Property",
        contact: "Contact",
        review: "Review",
      },
      serviceTitle: "What can we clean for you?",
      serviceSub: "Pick the service closest to what you need - you can add details in a moment.",
      propertyTitle: "Tell us about the property",
      propertySub: "Rough numbers are fine - we'll confirm on-site.",
      sizeLabel: "Approximate size",
      sizes: ["Under 1,500 sq ft", "1,500–3,000 sq ft", "3,000–5,000 sq ft", "5,000+ sq ft"],
      storiesLabel: "Stories",
      addonsLabel: "Add-ons",
      addons: ["Windows", "Gutter brightening", "Roof soft wash", "Dock/deck", "Drone reach"],
      contactTitle: "How can we reach you?",
      contactSub: "Your info stays with the Hive. We'll never share it.",
      reviewTitle: "Anything else?",
      reviewSub: "Optional notes, gate codes, timing preferences.",
      preferredLabel: "Preferred contact method",
      notesLabel: "Notes (optional)",
      notesPlaceholder: "Anything we should know before we quote?",
      back: "Back",
      next: "Continue",
      submit: "Send my estimate request",
      sending: "Sending...",
      doneTitle: "You're all set.",
      doneText:
        "Thanks for reaching out. Someone from the Hive will be in touch within 24 hours to lock in your free estimate.",
      again: "Submit another",
    },
  },

  home: {
    hero: {
      line1: "Exterior cleaning,",
      line2: "done right.",
      sub: "Soft wash, pressure wash, windows, docks, and drone cleaning across the Lowcountry - from your front porch to a hundred feet up.",
      ctaPrimary: "Get a Free Estimate",
      ctaSecondary: "Explore services",
      stats: [
        { k: "100+ ft", v: "Drone reach" },
        { k: "Soft-wash", v: "Safe on siding" },
        { k: "5★", v: "Lowcountry-rated" },
      ],
    },
    services: {
      eyebrow: "What we do",
      title: "Explore our traditional services",
      sub: "Homes, storefronts, and the docks that hold your boat above the marsh - we handle the outside so you don't have to.",
      learnMore: "Learn more",
    },
    beforeAfter: {
      eyebrow: "The proof",
      title: "Before & after",
      moreLink: "See more transformations",
    },
    reviews: {
      eyebrow: "What Charleston is saying",
      title: "Reviews from the Hive",
      countLabel: "Google reviews",
      allLink: "Read all reviews on Google",
      items: [
        {
          name: "Father Gregory West",
          meta: "4 reviews",
          timeAgo: "2 months ago",
          text: "Nate, Kyle, and Ben are hard working perfectionists who will not rest until the job is done thoroughly. They were on time, professional, polite, and great to work with. I highly recommend them.",
        },
        {
          name: "Zach LoCicero",
          meta: "3 reviews",
          timeAgo: "a month ago",
          text: "Nothing but awesome things to say about the Hydro Hive crew! They did a great job on my house and they're also great people which made the process easy start to finish. Highly recommend!",
        },
        {
          name: "Devin Lynch",
          meta: "1 review",
          timeAgo: "4 weeks ago",
          text: "Awesome experience using Hydro Hive. They do exceptional work and have great pricing. Highly recommend.",
        },
        {
          name: "Robert Gordon",
          meta: "14 reviews · 1 photo",
          timeAgo: "a month ago",
          text: "Nate & the fellas are studs. They put my house through a car wash & had it coming out perfectly clean. Don't hesitate to use them.",
        },
        {
          name: "Jake Tomsik",
          meta: "3 reviews",
          timeAgo: "a month ago",
          text: "Been using pressure washing companies for my house on and off over the past 4 years. Nate, Ben, and Kyle have treated me better than anyone, and the service they provide is amazing. Will definitely be using them moving forward!",
        },
        {
          name: "Jeff Kleiman",
          meta: "Local Guide · 37 reviews · 6 photos",
          timeAgo: "3 weeks ago",
          text: "Couldn't ask for more. Incredible detailed and thorough treating our spot. Thank you again!",
        },
        {
          name: "Carson",
          meta: "15 reviews · 1 photo",
          timeAgo: "a month ago",
          text: "House was very dirty. Nate and the hydro hive treated us great! Completely removed the mold that was growing and made our stairs look brand new!",
        },
        {
          name: "Peter Greene",
          meta: "1 review",
          timeAgo: "a month ago",
          text: "A very friendly and dedicated team that always does great work. I would highly recommend",
        },
        {
          name: "LowCountry Lowdown",
          meta: "1 review",
          timeAgo: "a month ago",
          text: "Kyle, Nate, and Ben were extremely professional from start to finish. They communicated clearly, showed up on time, and did excellent work. You can tell they take pride in what they do and care about delivering a great customer experience. I would highly recommend Hydro Hive to anyone looking for quality work and a team you can trust.",
        },
        {
          name: "Tyler Schneider",
          meta: "2 reviews",
          timeAgo: "a month ago",
          text: "Very professional young men that sold me on the spot. Knocked it out of the park. My wife even made it a point to tell me how impressed she was!",
        },
        {
          name: "Hank Williams",
          meta: "Local Guide · 27 reviews · 16 photos",
          timeAgo: "a month ago",
          text: "The Hydro Hive team did a great job power washing my house. The gentlemen who own and operate the business are trust worthy, honest, and genuinely nice to be around. I already booked for next year and plan to have them washing my house on an annual basis.",
        },
        {
          name: "John Austen",
          meta: "1 review",
          timeAgo: "a month ago",
          text: "Hydro Hive is an amazing group of gentlemen who are trustworthy, respectful, and hardworking. They offer fair prices while doing incredible work, focusing on all the little things and don't miss a spot. If you need a power washing job, these are the guys you want to go with!",
        },
        {
          name: "Morgan Egloff",
          meta: "1 review",
          timeAgo: "a month ago",
          text: "Excellent service. Nate, Ben and Kyle are true professionals and I will 100% be hiring them again for future jobs!",
        },
        {
          name: "George Roux",
          meta: "4 reviews",
          timeAgo: "a month ago",
          text: "Hydrohive is the best in the business! Nate's easy-going nature and desire to connect with his clients resonates from the moment you meet him, and this translates to a real “ownership” mentality and pride in his work. I could not have been more impressed with either. I used hydrohive for my commercial building and then immediately asked for the same for my home. The experience/service was incredible both times!",
        },
        {
          name: "mikey",
          meta: "2 reviews",
          timeAgo: "a month ago",
          text: "Did a great job on my home in downtown Charleston SC, very professional and thorough work!",
        },
        {
          name: "Jack Weisenberger",
          meta: "2 reviews",
          timeAgo: "a month ago",
          text: "The guys did a great job on my house, super convenient process, would highly recommend!",
        },
        {
          name: "Will O'Connell",
          meta: "3 reviews · 2 photos",
          timeAgo: "a month ago",
          text: "Amazing service - very friendly, efficient, and looks great! Would definitely recommend to a friend",
        },
        {
          name: "Lee S-j",
          meta: "8 reviews",
          timeAgo: "a month ago",
          text: "Great service, punctual and handsome. Would recommend",
        },
        {
          name: "Greer Hanlon",
          meta: "7 reviews",
          timeAgo: "a month ago",
          text: "As a real estate investor, I needed a fast turnaround on pressure washing before listing two properties. The team at Hydro Hive responded within hours and completely transformed both homes. They were able to remove tough concrete stains and significantly improve the overall curb appeal before we went to market. Professional, responsive, and easy to work with — I'd highly recommend Hydro Hive to anyone in the Charleston area looking for quality pressure washing services.",
        },
        {
          name: "Brady Dashiell",
          meta: "2 reviews",
          timeAgo: "a month ago",
          text: "Great company and great people!",
        },
        {
          name: "Ben Iott",
          meta: "10 reviews · 1 photo",
          timeAgo: "a month ago",
          text: "The Hive buzzed around my house and it has never looked cleaner.",
        },
        {
          name: "Jill Davidge",
          meta: "6 reviews",
          timeAgo: "2 weeks ago",
          text: "Nate and Ben show up on time and do a great job. Courteous and personable I'd hire them again for sure. They washed my driveway, pool surfaces, and outdoor porch and deck. Like new!",
        },
        {
          name: "Michael Nathan",
          meta: "3 reviews",
          timeAgo: "2 weeks ago",
          text: "Hydro Hive is the most reliable company in the low country area. Super easy to work with, show up on time, and do a tremendous job",
        },
        {
          name: "Christian Hart",
          meta: "1 review",
          timeAgo: "2 weeks ago",
          text: "These guys are true professionals. Best service. So happy with the results. Will definitely be using them regularly!",
        },
        {
          name: "Gavin Dooley",
          meta: "5 reviews",
          timeAgo: "2 weeks ago",
          text: "The best guys in town!",
        },
        {
          name: "Nancy Scheurer",
          meta: "2 reviews",
          timeAgo: "3 weeks ago",
          text: "Nate and team did an absolutely amazing job on our downtown home. There was no portion of the exterior they didn't meticulously clean. Timely, efficient, thorough, couldn't recommend these guys enough!",
        },
        {
          name: "Chip Cross",
          meta: "3 reviews",
          timeAgo: "3 weeks ago",
          text: "Ben and Nate were great. All the algae and mold is off my house. Can't wait to use them again next year.",
        },
        {
          name: "Pedro Lacerda",
          meta: "4 reviews",
          timeAgo: "3 weeks ago",
          text: "Great service! Nate and Ben came by to pressure washed my house and did an amazing job. Everything looks spotless and brand new. They were professional, on time, and paid attention to every detail. Highly recommend them to anyone looking for quality pressure washing services!",
        },
        {
          name: "Haley Roux",
          meta: "2 reviews",
          timeAgo: "a month ago",
          text: "Huge shoutout to this company for doing such a fantastic job power washing my house. It looks completely refreshed! The workers were super polite, efficient, and professional from start to finish. They got right to work and were incredibly thorough with the cleanup without bothering any of my landscaping. If you're looking for amazing results, definitely give them a call. I'll absolutely be a returning customer!",
        },
      ],
    },
    drone: {
      eyebrow: "New capability",
      title: "Drone Cleaning",
      body: "Where ladders end, our drone begins. Low-pressure soft-wash chemistry for steeples, multi-story homes, and tall commercial facades. 100+ feet up, same clean, no ladders.",
      cta: "Learn more",
      partnerPrefix: "Partnered with",
      partner: "LUCID BOTS",
      imageAlt: "Drone soft-wash cleaning a tall building",
    },
    finalCta: {
      badge: "Lowcountry trusted",
      title: "Ready for a cleaner property?",
      sub: "Free estimates. Fast quotes. We serve Charleston, SC and the Lowcountry.",
      cta: "Get your free estimate",
    },
  },

  services: {
    hero: {
      eyebrow: "Our services",
      title: "Clean, top to bottom.",
      sub: "Four services, one crew. Pick what you need - we'll bring the pressure, the chemistry, and the care.",
    },
    list: {
      numberPrefix: "Service",
      detailsLink: "Full details & FAQs",
    },
    areas: {
      eyebrow: "Where we work",
      title: "Serving the Charleston Lowcountry",
    },
  },

  residential: {
    about: {
      name: "Residential",
      short: "Soft washing, pressure washing, and window cleaning for homes across the Lowcountry.",
      long: "From historic Charleston single houses to new construction in Mount Pleasant, we tailor pressure and chemistry to protect your siding, paint, brick, and landscaping - while lifting years of grime, algae, and salt spray in a single visit.",
      cta: "Quote your House",
    },
    hero: {
      eyebrow: "Residential Cleaning",
      title: "Residential exterior cleaning in Charleston, SC",
    },
    included: {
      title: "What's included",
      bullets: [
        "Soft wash siding & roofs",
        "Pressure wash driveways & pavers",
        "Streak-free window cleaning",
        "Gutter brightening",
      ],
    },
    gallery: {
      title: "Recent residential work",
    },
    areas: {
      title: "Serving residential clients across the Lowcountry",
      sub: "We bring residential cleaning to these Charleston-area communities and beyond.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
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
    finalCta: {
      title: "Ready for residential that's done right?",
      sub: "Free estimates. Fast quotes. Fully insured.",
    },
  },

  commercial: {
    about: {
      name: "Commercial",
      short:
        "Storefronts, restaurants, offices, and parking lots - fully insured, flexibly scheduled.",
      long: "Flexible scheduling including after-hours and early mornings so your customers only see the result. Fully insured, W-9 ready, and comfortable working around active operations from King Street boutiques to industrial facilities.",
      cta: "Quote your Business",
    },
    hero: {
      eyebrow: "Commercial Cleaning",
      title: "Commercial exterior cleaning in Charleston, SC",
    },
    included: {
      title: "What's included",
      bullets: [
        "After-hours scheduling",
        "Fully insured / W-9 ready",
        "Storefronts, restaurants, offices",
        "Parking lots & sidewalks",
      ],
    },
    gallery: {
      title: "Recent commercial work",
    },
    areas: {
      title: "Serving commercial clients across the Lowcountry",
      sub: "We bring commercial cleaning to these Charleston-area communities and beyond.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
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
    finalCta: {
      title: "Ready for commercial that's done right?",
      sub: "Free estimates. Fast quotes. Fully insured.",
    },
  },

  dock: {
    about: {
      name: "Docks",
      short: "Marine-safe treatments, mildew and algae removal, and gentle wood restoration.",
      long: "Charleston is a waterfront town, and your dock takes a beating. We use marine-safe chemistry to lift mildew, algae, and salt buildup and restore wood without harming the water around it.",
      cta: "Quote your Dock",
    },
    hero: {
      eyebrow: "Docks Cleaning",
      title: "Docks exterior cleaning in Charleston, SC",
    },
    included: {
      title: "What's included",
      bullets: [
        "Marine-safe chemistry",
        "Mildew & algae removal",
        "Wood restoration",
        "No harm to marsh or waterway",
      ],
    },
    gallery: {
      title: "Recent dock work",
    },
    areas: {
      title: "Serving docks clients across the Lowcountry",
      sub: "We bring docks cleaning to these Charleston-area communities and beyond.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
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
    finalCta: {
      title: "Ready for docks that's done right?",
      sub: "Free estimates. Fast quotes. Fully insured.",
    },
  },

  drone: {
    about: {
      name: "Drone Cleaning",
      short:
        "Low-pressure soft-wash chemistry for steeples, multi-story homes, and tall facades - 100+ feet up, no ladders.",
      long: "Where ladders end, our drone begins. Partnered with LucidBots, we bring low-pressure soft-wash chemistry to steeples, multi-story homes, and tall commercial facades. 100+ feet up, same clean, no ladders.",
      cta: "Inquire Today",
    },
    hero: {
      eyebrow: "Drone Cleaning Cleaning",
      title: "Drone Cleaning exterior cleaning in Charleston, SC",
    },
    included: {
      title: "What's included",
      bullets: [
        "Steeples & multi-story homes",
        "Tall commercial facades",
        "100+ ft reach, no ladders",
        "Partnered with LucidBots",
      ],
    },
    gallery: {
      title: "Recent drone work",
    },
    areas: {
      title: "Serving drone cleaning clients across the Lowcountry",
      sub: "We bring drone cleaning cleaning to these Charleston-area communities and beyond.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
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
    finalCta: {
      title: "Ready for drone cleaning that's done right?",
      sub: "Free estimates. Fast quotes. Fully insured.",
    },
  },

  serviceAreas: {
    hero: {
      eyebrow: "Where we work",
      title: "Service areas",
      sub: "Based at 170 Smith St, Charleston, SC 29403, the Hive covers the Charleston peninsula and the surrounding Lowcountry.",
    },
    areaPage: {
      ctaLabel: "Get a Free Estimate",
      learnMore: "Learn more",
      reviewsTitle: "What neighbors are saying",
      contactTitle: "Quick contact",
      contactButton: "Request a free estimate",
      badgeTitle: "Locally Owned",
      badgeText: "Charleston-based, fully insured, and small on purpose.",
    },
  },

  downtownCharleston: {
    about: {
      name: "Downtown Charleston",
      region: "The Peninsula",
      short:
        "Historic single houses, King Street storefronts, and peninsula stoops - washed with care for old brick, stucco, and paint.",
      cardLink: "View Downtown Charleston services",
    },
    hero: {
      title: "Exterior cleaning in Downtown Charleston, SC",
    },
    local: {
      title: "Locally trusted in Downtown Charleston",
      body: "The peninsula's historic homes and storefronts need a lighter touch - low-pressure soft washing that lifts algae, mildew, and salt haze from siding, brick, and stucco without damaging century-old materials. We work early mornings and off-hours around King Street and Upper King so business keeps moving.",
      neighborhoods: [
        "King Street",
        "South of Broad",
        "Cannonborough-Elliotborough",
        "Wagener Terrace",
        "Hampton Park",
      ],
      servicesTitle: "Services available in Downtown Charleston",
      servingLine: "Serving Downtown Charleston & the Lowcountry",
    },
  },

  mountPleasant: {
    about: {
      name: "Mount Pleasant",
      region: "East Cooper",
      short:
        "New construction and family homes across Mount Pleasant, plus the docks lining Shem Creek and the Wando.",
      cardLink: "View Mount Pleasant services",
    },
    hero: {
      title: "Exterior cleaning in Mount Pleasant, SC",
    },
    local: {
      title: "Locally trusted in Mount Pleasant",
      body: "From Old Village to new-build neighborhoods off Highway 17, Mount Pleasant homes face heavy pollen, humidity, and salt air off the harbor. We soft wash siding and roofs, pressure wash driveways and pavers, and take care of the docks along Shem Creek and the Wando River.",
      neighborhoods: ["Old Village", "Shem Creek", "I'On", "Park West", "Rivertowne"],
      servicesTitle: "Services available in Mount Pleasant",
      servingLine: "Serving Mount Pleasant & the Lowcountry",
    },
  },

  jamesIsland: {
    about: {
      name: "James Island",
      region: "James Island",
      short:
        "Marsh-front homes and docks between the Stono and the harbor - soft washing and marine-safe dock care.",
      cardLink: "View James Island services",
    },
    hero: {
      title: "Exterior cleaning in James Island, SC",
    },
    local: {
      title: "Locally trusted in James Island",
      body: "James Island's marsh-front homes and docks take a beating from humidity, algae, and pluff mud spray. We bring soft-wash chemistry safe for landscaping and waterways, and marine-safe treatments for docks along the Stono River and the creeks feeding Charleston Harbor.",
      neighborhoods: ["Folly Road", "Riverland Terrace", "Fort Johnson", "Harbor View Road"],
      servicesTitle: "Services available in James Island",
      servingLine: "Serving James Island & the Lowcountry",
    },
  },

  westAshley: {
    about: {
      name: "West Ashley",
      region: "West Ashley",
      short:
        "Established neighborhoods and busy retail corridors along Savannah Highway and Ashley River Road.",
      cardLink: "View West Ashley services",
    },
    hero: {
      title: "Exterior cleaning in West Ashley, SC",
    },
    local: {
      title: "Locally trusted in West Ashley",
      body: "West Ashley's mix of established neighborhoods and commercial corridors along Savannah Highway and Ashley River Road means we're just as comfortable soft washing a family home as we are scheduling after-hours pressure washing for a storefront or office.",
      neighborhoods: ["Avondale", "South Windermere", "Ashleyville", "St. Andrews"],
      servicesTitle: "Services available in West Ashley",
      servingLine: "Serving West Ashley & the Lowcountry",
    },
  },

  danielIsland: {
    about: {
      name: "Daniel Island",
      region: "Daniel Island",
      short:
        "Newer construction, HOA-standard curb appeal, and riverfront docks between the Cooper and Wando.",
      cardLink: "View Daniel Island services",
    },
    hero: {
      title: "Exterior cleaning in Daniel Island, SC",
    },
    local: {
      title: "Locally trusted in Daniel Island",
      body: "Daniel Island's newer homes and tight HOA standards call for clean, even results every time - soft-washed siding and roofs, pressure-washed driveways and pool decks, and marine-safe care for docks along the Cooper and Wando Rivers.",
      neighborhoods: ["Smythe Park", "Codner's Ferry", "Beresford Creek", "Etiwan Park"],
      servicesTitle: "Services available in Daniel Island",
      servingLine: "Serving Daniel Island & the Lowcountry",
    },
  },

  gallery: {
    hero: {
      eyebrow: "Portfolio",
      title: "Before & After",
      sub: "Drag the slider on each project to reveal the transformation. Real work, real Lowcountry properties.",
    },
    projects: {
      items: [
        {
          label: "Deck & Siding Soft Wash",
          before: { photo: "static:before1" },
          after: { photo: "static:after1" },
        },
        {
          label: "Home Exterior & Walkway",
          before: { photo: "static:before2" },
          after: { photo: "static:after2" },
        },
        {
          label: "Roof & Deck Restoration",
          before: { photo: "static:before3" },
          after: { photo: "static:after3" },
        },
        {
          label: "Pool Deck & Pavers",
          before: { photo: "static:before4" },
          after: { photo: "static:after4" },
        },
        {
          label: "Chimney & AC Pad Soft Wash",
          before: { photo: "static:chimneyBefore" },
          after: { photo: "static:chimneyAfter" },
        },
        {
          label: "Brick Edging Cleaning",
          before: { photo: "static:edgingBefore" },
          after: { photo: "static:edgingAfter" },
        },
        {
          label: "Porch & Steps Cleaning",
          before: { photo: "static:porchBefore" },
          after: { photo: "static:porchAfter" },
        },
      ],
    },
  },

  team: {
    hero: {
      eyebrow: "Who we are",
      title: "Meet the Hive",
      sub: "Locally owned, Charleston-based, and small on purpose. Two guys who show up, work hard, and treat your property like their own.",
    },
    members: {
      items: [
        {
          first: "Ben",
          role: "Operations · Engineer",
          photo: "static:ben",
          bio: [
            "Ben is the engineer of the group (Clemson class of 2024). But before college and all the way through it, he was working in the service industry.",
            "Eight years of experience will teach you that the technical fix is only half the job - the other half is the person standing in front of you.",
            "Off the clock, you'll find Ben on the golf course, on the mat, or enjoying live music at Chico Feo.",
          ],
        },
        {
          first: "Nate",
          role: "Field · Lacrosse alum",
          photo: "static:nate",
          bio: [
            "Nate is one of five kids. He grew up on a horse farm in Maryland - his family means everything to him.",
            "Nate played college lacrosse for Bill Tierney at the University of Denver. His older brother Henry played at Notre Dame and his little brother Ben plays for Ohio State. Cousins scattered across Duke, Princeton, Maryland, Georgetown, Navy, Lehigh, Towson, Dartmouth, and High Point.",
            "Nate enjoys competing in Brazilian jiu-jitsu and surfing/skating in his free time.",
          ],
        },
      ],
    },
    story: {
      title: "Our story",
      body: "Hydro Hive was founded in 2025 by a small crew who believed Charleston deserved better exterior cleaning - the kind where somebody shows up on time, does the work right, and stands behind it. Locally owned. Locally run. That's it. That's the promise.",
      cta: "Work with the Hive",
    },
  },

  contact: {
    hero: {
      eyebrow: "Free estimate",
      title: "Let's get you a quote.",
      sub: "Four quick steps. We'll follow up within 24 hours with a real number - no pressure.",
    },
    direct: {
      title: "Prefer to reach out directly?",
      servingLine: "Serving Charleston, SC and the Lowcountry",
    },
    badge: {
      title: "Locally Owned",
      text: "Charleston-based, fully insured, and small on purpose. Your job doesn't get pawned off to a stranger.",
    },
  },
};

export type Content = typeof DEFAULTS;

/** Page keys for the four service pages. */
export type ServicePageKey = "residential" | "commercial" | "dock" | "drone";
/** Page keys for the five service-area pages. */
export type AreaPageKey =
  | "downtownCharleston"
  | "mountPleasant"
  | "jamesIsland"
  | "westAshley"
  | "danielIsland";

/** Derived contact strings, shared by components and the JSON-LD helpers. */
export function contactInfo(c: Content["site"]["contact"]) {
  return {
    city: `${c.city}, ${c.state}`,
    fullAddress: `${c.street}, ${c.city}, ${c.state} ${c.zip}`,
  };
}
