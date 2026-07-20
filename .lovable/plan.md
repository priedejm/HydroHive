
# Hydro Hive - Multi-Page Marketing Site

Rebuild the current single-scroller as a proper multi-page site. Keep the playful blue-collar/Lowcountry personality from the screenshots (navy + gold, bold wordmark, yellow "Drone Cleaning" color-block break, oval name badges under portraits), but with real navigation, real page-per-topic SEO, and a much better quote flow.

## Design system

- **Colors** (tokens in `src/styles.css`, all `oklch`):
  - `--brand-navy` `#1B2A4A` - primary, headers, body text
  - `--brand-gold` `#E5B93C` - accents, section blocks, badges
  - `--brand-cream` `#F5F4F0` - page background
  - `--brand-ink` `#0A0A0A` - CTA button fills
  - Mapped through `@theme inline` as `--color-primary` (navy), `--color-accent` (gold), `--color-background` (cream), plus `--color-cta`.
- **Type:** Headlines in a bold rounded sans (Archivo Black / Figtree Black feel, matching the "HYDRO HIVE" wordmark weight). Body in Figtree/Inter. Load via `<link>` in `__root.tsx`.
- **Buttons:** Black pill CTA (`rounded-full bg-cta text-white`) as the primary - matches current site. Gold pill as secondary. Ghost navy outline for tertiary.
- **Motion:** Subtle scroll-reveal (opacity + translate-y) on section entry via IntersectionObserver hook. Hover lifts on cards.

## Site structure

```
src/routes/
  __root.tsx        → site shell: sticky Header + Footer + <Outlet />
  index.tsx         → /                 Home
  services.tsx      → /services         All 4 services on one page, anchor jumps (#residential, #commercial, #docks, #drone)
  gallery.tsx       → /gallery          Before/after with category filter
  team.tsx          → /team             Meet the Hive (Kyle, Ben, Nate)
  contact.tsx       → /contact          Multi-step quote form
```

Every route sets its own `head()` with distinct `title`, `description`, `og:title`, `og:description`. `og:image` on leaves only.

## Shared chrome

**Header** (`src/components/site/Header.tsx`) - sticky, cream background w/ subtle border-b on scroll:
- Left: three-man logo (link to `/`)
- Center: Home · Services (dropdown → Residential / Commercial / Docks / Drone) · Before & After · Meet the Hive
- Right: Instagram icon + black-pill "Get a Free Estimate" → `/contact`
- Mobile: hamburger → slide-down sheet, same links, full-width CTA at bottom

**Footer** (`src/components/site/Footer.tsx`):
- Bee + wordmark lockup, nav column, contact column (`info@thehydrohive.com`, `(854) 222-9125`), badges row (Veteran-Owned seal, Google G, Instagram)
- Bottom line: "Est. 2025 · Charleston, SC · Veteran-Owned & Operated"

## Pages

### Home (`/`)
1. Full-bleed hero: marsh/waterfront placeholder image, dark gradient overlay, gold "HYDRO HIVE" wordmark + bee, sub-line "Charleston's veteran-owned exterior cleaning crew.", black-pill "Get a Free Estimate".
2. Three service teasers (Residential / Commercial / Docks) - image + 2-line blurb + "Learn More →" deep-links to `/services#residential` etc.
3. Before/After preview strip - 3 slider comparison pairs + "See More Transformations →" `/gallery`.
4. **Drone Cleaning gold block** (full-bleed `bg-accent`) - big headline, blurb, "Learn More" → `/services#drone`, drone photo right.
5. "Partnered with LucidBots" logo strip.
6. Trust strip: Veteran-Owned · Google 5★ · Est. 2025 · Charleston, SC.
7. Footer CTA banner (navy): "Ready for a cleaner property?" + black-pill CTA.

### Services (`/services`)
- Intro header + anchor chip nav (Residential · Commercial · Docks · Drone).
- 4 alternating image/text sections (zigzag), each with its own CTA:
  - `#residential` - "Quote your House"
  - `#commercial` - "Quote your Business"
  - `#docks` - "Quote your Dock"
  - `#drone` - gold background break, LucidBots mention, "Inquire Today"
- All CTAs link to `/contact?service=<slug>` (contact form pre-selects).

### Before & After (`/gallery`)
- Filter tabs: All / Residential / Commercial / Docks (client-side state).
- Responsive grid of comparison cards. Each card uses a custom `<BeforeAfterSlider>` component (draggable divider handle over two stacked images, pointer/touch events, no library needed).
- Placeholder image pairs with a light "Before/After" tag overlay and dashed border.
- Comment at top: `{/* Replace placeholder images with real before/after project photos */}`.

### Meet the Hive (`/team`)
- Header "Meet the Hive" + three-man logo art.
- Three alternating rows (image left/right, bio right/left) for Kyle, Ben, Nate using the bios from the brief.
- **Placeholder avatars:** circle with initials (KM / BM / NM style) inside a dashed navy border, gold oval name-badge underneath (matches the existing "Kyle / Ben / Nate" script badges). Caption bubble: 📸 "Replace with [Name]'s headshot".
- Closing "Our Story" block: veteran-owned, Est. 2025, Charleston SC.

### Contact / Get a Free Estimate (`/contact`)
- Two-column layout desktop / stacked mobile.
- **Left: multi-step quote wizard** (`<QuoteWizard>`), 4 steps with progress bar:
  1. Service - 4 big tiles: Residential / Commercial / Docks / Drone Cleaning
  2. Property details - approx sq ft (slider or select), single/multi-story, add-ons (windows, gutter, dock)
  3. Contact - name, email, phone, address (all Zod-validated: trim, email, length caps)
  4. Preferred contact method + optional notes → Submit
- Submit handler: toast "Thanks! We'll get back to you within 24 hours.", console.log payload, show success state that resets the wizard. Comment: `// TODO: connect form submission to backend / CRM`.
- Reads `?service=` search param to preselect step 1.
- **Right sidebar:** direct contact card (email, phone, "Serving Charleston & the Lowcountry"), Veteran-Owned + Google badges, simple static map illustration or embedded iframe placeholder.

## Technical notes

- **Assets:** Upload the 7 provided logo variants via `lovable-assets create` from `/mnt/user-uploads/`, commit only the `.asset.json` pointers in `src/assets/`. Use the horseshoe three-man logo in header, bee + wordmark in footer, bee mascot as favicon-scale accent.
- **Components:** `src/components/site/{Header,Footer,SectionReveal,BeforeAfterSlider,ServiceCard,QuoteWizard,TrustBadges,CTAButton}.tsx`. shadcn `button`, `input`, `label`, `textarea`, `select`, `sonner` toaster.
- **Validation:** Zod schemas per wizard step; block Next until valid.
- **Nav dropdown:** shadcn `NavigationMenu` on desktop, disclosure inside sheet on mobile.
- **SEO:** Per-route `head()`, sitewide defaults in `__root.tsx` (charset, viewport, `og:type: website`, `og:site_name: Hydro Hive`). No root `og:image`.
- **404 / error:** Keep existing root boundaries; ensure navy/cream styling.
- **No backend, no Cloud** - form is stubbed as agreed.

## What's out of scope

- Real backend for form submissions (stub only, TODO comment left in place).
- Real photography - placeholder marsh/service/team images marked as swappable.
- Blog, pricing page, reviews page (can add later).
