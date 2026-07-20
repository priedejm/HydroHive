export type Review = {
  name: string;
  meta: string;
  timeAgo: string;
  text: string;
};

/**
 * Verbatim text pulled from the Hydro Hive Google Business Profile.
 * The aggregate (SITE.googleRating / googleReviewCount) reflects the true
 * Google total; this array holds every review whose full text we have on
 * file - more may exist on Google than are rendered here.
 */
export const REVIEWS: Review[] = [
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
];
