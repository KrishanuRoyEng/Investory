# Open API Stubs, Deferred Features & Data Integrity Log

## §Phase Stubs (pre-existing)
- **Phase 5 (Live Sessions)**: True automated Agora Cloud Recording (webhooks + BullMQ) is deferred. MVP supports manual recording URL entry via `POST /admin/live-sessions/:id/recording`.
- **Phase 6 (Webinars)**: True automated webinar recording auto-attach is deferred. MVP supports manual recording URL entry via `POST /admin/webinars/:id/recording`.

---

## §L-STATS — Client-Supplied Statistics (must be backed by real data before launch)

The following numbers are client-supplied and live in `frontend/src/content/landing.ts`.
They MUST be verified against real platform data before the site goes live.
Do NOT treat them as established claims in marketing until verified.

| Stat | Value | Location |
|------|-------|----------|
| Overall learner count | 3000+ | `HERO_STATS[0]` |
| Site average rating | 4.7 | `HERO_STATS[1]` |
| Master Trader Programme — enrolled | 1500+ | `PROMO_CARD.enrolledCount`, `SPOTLIGHT.chips[1]` |
| Master Trader Programme — rating | 4.5 | `PROMO_CARD.ratingValue`, `SPOTLIGHT.chips[0]` |
| Masterclass learner count | 1000+ | `FEATURED_COURSES[0].learnerCount` |
| Derivatives learner count | 1000+ | `FEATURED_COURSES[1].learnerCount` |
| Instructor experience | 12 years | `PROMO_CARD.instructorTitle`, banner copy |

---

## §L-PRICES — Compare-At / Was Prices (display-only)

Struck-through "was" prices are stored in `landing.ts` (`wasPrice` in paise).
These render only when `wasPrice > currentPrice` (from DB).
They are display-only — they do NOT affect checkout amounts.

> **Warning:** A "You save X" claim must only be shown if the higher price was genuinely charged on this platform at some prior time. Confirm with client before launch that wasPrice was real, or remove the claim.

| Course | Was Price (paise) | Was Price (display) |
|--------|--------------------|----------------------|
| Master Trader Programme | 1,499,900 | ₹14,999 |
| Masterclass of Indicators & Strategies | 2,499,900 | ₹24,999 |
| Mastery in Derivatives | null | (none) |

---

## §L-ROUTES — Missing Routes

| Route | Used In | Status |
|-------|---------|--------|
| `/mentorship` | Nav, Card 4, mentorship section | ❌ Page does not exist |
| `/market-insights` | Nav | ❌ Page does not exist |
| `/scholarship` | Scholarship banner CTA | ❌ Page does not exist — opening soon. Scholarship assessment/rules not built. |
| `/courses?category=indicators` | Nav dropdown | ⚠️ `category` filter not in catalogue query DTO or Prisma index |
| `/courses?category=derivatives` | Nav dropdown | ⚠️ Same as above |
| `/courses?category=nism` | Nav dropdown | ⚠️ Same as above |

---

## §L-NISM — NISM Category Filter

The catalogue currently has no `category` field on the `Course` model.
Journey Card 3 and the NISM nav item link to `/courses?level=ADVANCED` as an approximation.
A dedicated `category` or `tag` system needs to be added to the schema to properly filter by NISM, indicators, derivatives.

---

## §L-CARD-C — Third Course Card

No copy was supplied for a third course card in the featured courses grid.
The grid renders cards A (Masterclass) and B (Derivatives) plus an empty config slot.
Do NOT invent a third course. This slot will be filled when client provides copy.

---

## §L-ASSETS — Unfilled Asset Slots

All assets live under `frontend/public/brand/`. Manifest in `frontend/src/content/assets.ts`.
Swap: replace the file at the listed path. `filled: false` → placeholder; `filled: true` → real asset.

| Slot | Path | Status |
|------|------|--------|
| logo-light.svg | `/public/brand/logo-light.svg` | ❌ Not provided |
| logo-dark.svg | `/public/brand/logo-dark.svg` | ❌ Not provided |
| icon.svg | `/public/brand/icon.svg` | ❌ Not provided |
| apple-touch-icon.png | `/public/brand/apple-touch-icon.png` | ❌ Not provided |
| favicon.ico | `/public/brand/favicon.ico` | ❌ Not provided |
| og-image.png (1200×630) | `/public/brand/og-image.png` | ❌ Not provided |
| facultyTeam | `/public/brand/faculty-team.jpg` | ❌ Not provided |
| instructorCutout-jayanta | `/public/brand/instructor-cutout-jayanta.png` | ❌ Not provided |
| mentorshipBanner | `/public/brand/mentorship-banner.jpg` | ❌ Not provided |
| scholarshipBanner | `/public/brand/scholarship-banner.jpg` | ❌ Not provided |
| brochure-master-trader-programme.pdf | `/public/brand/brochure-master-trader-programme.pdf` | ❌ Not provided — button disabled |
| brochure-masterclass-indicators-strategies.pdf | `/public/brand/brochure-masterclass-indicators-strategies.pdf` | ❌ Not provided — button disabled |
| brochure-mastery-derivatives-risk-management.pdf | `/public/brand/brochure-mastery-derivatives-risk-management.pdf` | ❌ Not provided — button disabled |
| companyLogos[] | `/public/brand/company-logo-*.svg` | ❌ None provided — strip hidden |

---

## §L-SOCIAL — Social URLs

No social handles have been supplied by the client.
Social icons in the footer and social strip are hidden until URLs are added to `frontend/src/content/siteConfig.ts`.

---

## §L-LIVE-BADGE — Live Badge Data Source

The "Live" pill in the navbar polls `GET /api/v1/live-sessions` (public endpoint).
It checks `session.status === 'IN_PROGRESS'`. If the endpoint is not publicly accessible without auth, the badge will silently stay hidden (fail-safe, does not throw).

**Backend gap:** The `GET /api/v1/live-sessions` endpoint currently requires registration/auth per the route map. A public `?status=IN_PROGRESS&count=true` endpoint is needed for the badge to work without requiring the visitor to be logged in. This is flagged for the next backend sprint.

---

## §L-GENERATE-METADATA — Course slug generateMetadata

`generateMetadata` for `/courses/[slug]` is stubbed. It needs to call `GET /api/v1/courses/:slug` server-side and return real OG data. Currently the courses detail page uses static metadata.

---

## §L-SCHOLARSHIP — Scholarship Assessment

The scholarship assessment (questions, scoring, scholarship rules, storage of results) is unbuilt and needs its own plan. Scholarship terms and amounts are undefined. Do not state any amount, percentage or eligibility criterion anywhere on the site.

---

## §L-BRAND — Brand Name Stale Spellings

Client confirmed brand name: **Invesone** (2026-10-10).
The following files may still contain stale spellings ("INVESTONE", "Investory", "INVESONE", "InvesOne"):
- `frontend/src/components/layouts/SiteHeader.tsx`
- `frontend/src/components/layouts/SiteFooter.tsx`
- `frontend/src/app/layout.tsx` (metadata title)
- Admin sidebar / dashboard components

Audit all before launch.
