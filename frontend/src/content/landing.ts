/**
 * landing.ts — Single source of truth for all landing page content.
 * No copy is hardcoded in JSX. All text comes from here.
 *
 * CLIENT-SUPPLIED STATS (marked below) must be backed by real
 * data/feedback before launch. See docs/open-stubs.md §L-STATS.
 */

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export const BRAND_NAME = 'Invesone'; // ← confirmed by client 2026-10-10.
// TODO(brand-confirm): The codebase previously used "INVESTONE", "Investory",
// "INVESONE", "InvesOne". Single canonical name is now Invesone. Audit all other
// pages/components for stale spellings.

export const INSTRUCTOR_EXPERIENCE_YEARS = '12 Years'; // client-supplied, docs/open-stubs.md
// pages/components for stale spellings.

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const HERO = {
  h1Line1: 'Master the Stock Market',
  h1Line2: 'with Mentor-Led Courses',   // rendered in gold
  subheadline:
    'Learn share market trading, investing and NISM exam preparation from experienced market professionals.',
  leadIn: 'Where are you on your trading and investing journey?',
} as const;

// ---------------------------------------------------------------------------
// Journey cards (hero)
// Use lucide-react icon NAMES — mapped in the component.
// "Explore ↓" is on ALL four cards per spec §9.
// Routes: category/NISM filters are stubs — see docs/open-stubs.md §L-ROUTES.
// ---------------------------------------------------------------------------
export const JOURNEY_CARDS = [
  {
    icon: 'TrendingUp',
    title: "I'm new to the stock market",
    sub: 'Share market basics for beginners, taught step by step',
    // TODO(stub-route): /courses?level=BEGINNER — exists; category filter does not yet exist.
    href: '/courses?level=BEGINNER',
  },
  {
    icon: 'Target',
    title: 'I want to trade with more skill',
    sub: 'Options, derivatives and technical analysis with live classes',
    href: '/courses?level=INTERMEDIATE',
  },
  {
    icon: 'GraduationCap',
    title: "I'm preparing for a finance career",
    sub: 'NISM exam preparation with career guidance',
    // TODO(stub-route): Routes to ADVANCED level filter until a dedicated NISM
    // category tag exists in the catalogue (docs/open-stubs.md §L-NISM).
    href: '/courses?level=ADVANCED',
  },
  {
    icon: 'Users',
    title: 'I want a mentor beside me',
    sub: 'Personal mentorship and guidance at every step',
    // TODO(stub-route): /mentorship does not yet exist. Linked for future-readiness.
    href: '/mentorship',
  },
] as const;

// ---------------------------------------------------------------------------
// Hero stats strip
// CLIENT-SUPPLIED — must be backed by real data before launch.
// Only two stats per spec §2.
// ---------------------------------------------------------------------------
export const HERO_STATS = [
  {
    value: '3000+',
    label: 'learners', // client-supplied, see docs/open-stubs.md §L-STATS
  },
  {
    value: '4.7',
    label: 'average rating', // client-supplied, see docs/open-stubs.md §L-STATS
  },
] as const;

// ---------------------------------------------------------------------------
// Promo card (hero right) — Master Trader Programme
// Price: DB-derived at render time via GET /courses/master-trader-programme.
// wasPrice is display-only. "You save" is computed (wasPrice - price).
// wasPrice renders ONLY when it is > current price.
// ---------------------------------------------------------------------------
export const PROMO_CARD = {
  slug: 'master-trader-programme',
  label: 'FEATURED COURSE',
  title: 'Master Trader Programme',
  instructorName: 'Jayanta Sarkar',
  instructorTitle: `${INSTRUCTOR_EXPERIENCE_YEARS} of Market Experience`,
  // client-supplied counts (docs/open-stubs.md §L-STATS):
  enrolledCount: '1500+', // client-supplied
  ratingValue: '4.5',     // client-supplied
  ratingLabel: 'Student Ratings',
  duration: '10-day programme',
  wasPrice: 1499900, // paise — display-only struck-through "was" price
  href: '/courses/master-trader-programme',
} as const;

// ---------------------------------------------------------------------------
// Spotlight card (below hero, light section)
// ---------------------------------------------------------------------------
export const SPOTLIGHT = {
  eyebrowLink: 'Ready to learn the market? Begin here →',
  eyebrowHref: '/courses/master-trader-programme',
  title: 'Master Trader Programme',
  description:
    'A 10-day structured programme in technical and fundamental analysis: price action, patterns, volume, momentum and company financials.',
  chips: [
    { icon: 'Star', text: '4.5 (Student Ratings)' },   // client-supplied
    { icon: 'Users', text: '1500+ Enrolled' },            // client-supplied
    { icon: 'Clock', text: '10-day programme' },
  ],
  skillsLabel: "Skills you'll gain",
  skills: [
    'Candlestick Reading',
    'Chart Patterns',
    'Volume & Volatility',
    'Trading Strategies',
    'Fundamental Analysis',
  ],
  ctaText: 'See Course Details',
  ctaHref: '/courses/master-trader-programme',
  slug: 'master-trader-programme',
  wasPrice: 1499900, // paise display-only
} as const;

// ---------------------------------------------------------------------------
// Course grid heading (original copy, not from reference)
// ---------------------------------------------------------------------------
export const COURSE_GRID = {
  eyebrow: 'Structured Learning',
  heading: 'Sharpen your edge with\nlive, expert-led courses',
  subheading:
    'Each programme is designed by practitioners with real market experience — not just theory.',
  viewAllText: 'View All Courses',
  viewAllHref: '/courses',
} as const;

// ---------------------------------------------------------------------------
// Featured courses A & B
// Price: DB-derived. wasPrice is display-only.
// Brochure: resolved via ASSETS.brochures below.
// Card C slot is intentionally empty — see docs/open-stubs.md §L-CARD-C.
// ---------------------------------------------------------------------------
export const FEATURED_COURSES = [
  {
    slug: 'masterclass-indicators-strategies',
    bannerTag: 'Live',
    bannerTagColor: 'live' as const,
    bannerTitle: 'Masterclass of Indicators & Strategies',
    cardTitle: 'Masterclass of Indicators & Strategies',
    instructorName: 'Jayanta Sarkar',
    instructorCredential: `${INSTRUCTOR_EXPERIENCE_YEARS} of Market Experience`,
    skillsText:
      "Skills you'll gain: RSI Strategies, Fibonacci Analysis, Pivot Levels, Ichimoku & more",
    learnerCount: '1000+ Learners', // client-supplied — docs/open-stubs.md §L-STATS
    wasPrice: 2499900, // paise display-only — docs/open-stubs.md §L-PRICES
    viewDetailsHref: '/courses/masterclass-indicators-strategies',
    viewDetailsIcon: 'Eye',
    viewDetailsLabel: 'View Details',
    brochureLabel: 'Download Brochure',
    brochureKey: 'masterclass-indicators-strategies' as const,
  },
  {
    slug: 'mastery-derivatives-risk-management',
    bannerTag: 'Live',
    bannerTagColor: 'live' as const,
    bannerTitle: 'Mastery in Derivatives Trading & Risk Management',
    cardTitle: 'Mastery in Derivatives Trading & Risk Management',
    instructorName: 'Jayanta Sarkar',
    instructorCredential: `${INSTRUCTOR_EXPERIENCE_YEARS} of Market Experience`,
    skillsText:
      "Skills you'll gain: Futures & Options, Option Greeks, Hedging & more",
    learnerCount: '1000+ Learners', // client-supplied — docs/open-stubs.md §L-STATS
    wasPrice: null, // no struck-through price for Derivatives per spec
    viewDetailsHref: '/courses/mastery-derivatives-risk-management',
    viewDetailsIcon: 'Eye',
    viewDetailsLabel: 'View Details',
    brochureLabel: 'Download Brochure',
    brochureKey: 'mastery-derivatives-risk-management' as const,
    // Derivatives: "Download Brochure" is the STRONGER (solid) button per spec.
    brochurePrimary: true,
  },
  // Card C: intentionally empty config slot.
  // TODO(stub-card-c): No copy supplied for a third course.
  // Do not invent one. See docs/open-stubs.md §L-CARD-C.
] as const;

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export const NAV_COURSES_DROPDOWN = [
  { label: 'Beginner', href: '/courses?level=BEGINNER' },
  { label: 'Indicators', href: '/courses?category=indicators' }, // TODO(stub-route): category filter does not exist yet
  { label: 'Derivatives', href: '/courses?category=derivatives' }, // TODO(stub-route)
  { label: 'NISM Exam Prep', href: '/courses?category=nism' },    // TODO(stub-route)
  { label: 'Recorded Courses', href: '/courses?format=SELF_PACED' },
] as const;

export const NAV_LINKS = [
  { label: 'Personal Mentorship', href: '/mentorship' }, // TODO(stub-route): page does not exist
  { label: 'OneLearn', href: '/courses' },
  { label: 'Market Insights', href: '/market-insights' }, // TODO(stub-route): page does not exist
] as const;

export const NAV_SEARCH_PLACEHOLDER = 'Search options, indicators, NISM exams and more';

// ---------------------------------------------------------------------------
// Footer columns
// ---------------------------------------------------------------------------
export const FOOTER_COLS = [
  {
    label: 'Learn',
    links: [
      { label: 'Beginner Courses', href: '/courses?level=BEGINNER' },
      { label: 'Intermediate', href: '/courses?level=INTERMEDIATE' },
      { label: 'Live Classes', href: '/live' },
      { label: 'Webinars', href: '/webinars' },
      { label: 'NISM Exam Prep', href: '/courses?level=ADVANCED' },
      { label: 'Recorded Courses', href: '/courses?format=SELF_PACED' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    label: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Mentorship Banner
// ---------------------------------------------------------------------------
export const MENTORSHIP_BANNER = {
  eyebrow: "MENTORSHIP FOR INDIA'S MARKET PARTICIPANTS",
  heading: 'Personal Trading Mentorship Programme', // h2
  subtext: 'Learn the markets step by step with a structured plan, live market sessions and personal guidance from experienced mentors.',
  stats: [
    { icon: 'CalendarClock', val: 'Flexible', label: 'Duration Planned Around You' },
    { icon: 'Users', val: '100+', label: 'Learners Mentored' }, // client-supplied
    { icon: 'Award', val: INSTRUCTOR_EXPERIENCE_YEARS, label: 'Lead Mentor Experience' }, // client-supplied
  ],
  skillsHeading: 'What you will learn:',
  skills: [
    'Technical Analysis',
    'Candlesticks & Chart Patterns',
    'Indicators & Strategies',
    'Futures & Options',
    'Risk Management',
    'Trading Psychology',
    'Fundamental Analysis',
  ],
  ctaText: 'View Full Programme Details',
  ctaHref: '/mentorship', // TODO(stub-route)
  mentorName: 'Jayanta Sarkar',
  mentorTitle: 'Lead Mentor',
} as const;

// ---------------------------------------------------------------------------
// Scholarship Banner
// ---------------------------------------------------------------------------
export const SCHOLARSHIP_BANNER = {
  heading: 'Your ambition deserves a scholarship.',
  subtext: "We believe in rewarding serious traders. Take our assessment to see if you've earned a partial scholarship for the Personal Trading Mentorship Programme.",
  ctaText: 'Start My Assessment →',
  ctaHref: '/scholarship', // TODO(stub-route)
} as const;

