/**
 * assets.ts — Asset slot manifest.
 *
 * All assets live under /public/brand/.
 * Until real files are provided, placeholders render with a label.
 * Every unfilled slot is also listed in docs/open-stubs.md §L-ASSETS.
 *
 * To swap an asset: replace the file at the listed path.
 * The manifest entry (alt text, dimensions) stays here.
 */

export const ASSETS = {
  /** Navbar/footer logo (light background) */
  logoLight: {
    path: '/brand/logo-light.svg',
    alt: 'Invesone logo',
    width: 140,
    height: 36,
    filled: false, // TODO(asset): not yet provided
  },

  /** Navbar/footer logo (dark background) */
  logoDark: {
    path: '/brand/logo-dark.svg',
    alt: 'Invesone logo',
    width: 140,
    height: 36,
    filled: false, // TODO(asset): not yet provided
  },

  /** Interim tight logo from client */
  logoSourceTight: {
    path: '/brand/logo-source-tight.png',
    alt: 'Invesone logo',
    width: 140,
    height: 36,
    filled: true,
  },

  /** App icon (SVG) */
  icon: {
    path: '/brand/icon.svg',
    alt: 'Invesone icon',
    width: 32,
    height: 32,
    filled: false, // TODO(asset)
  },
  
  /** Apple Touch Icon */
  appleTouchIcon: {
    path: '/brand/apple-touch-icon.png',
    alt: 'Invesone apple touch icon',
    width: 180,
    height: 180,
    filled: false, // TODO(asset)
  },

  /** OG image (1200×630) */
  ogImage: {
    path: '/brand/og-image.png',
    alt: 'Invesone — Master the Stock Market with Mentor-Led Courses',
    width: 1200,
    height: 630,
    filled: false, // TODO(asset): not yet provided
  },

  /** Faculty team photo — spotlight card left side */
  facultyTeam: {
    path: '/brand/faculty-team.jpg',
    alt: 'Invesone faculty — Jayanta Sarkar and team',
    width: 480,
    height: 360,
    filled: false, // TODO(asset): not yet provided
  },

  /** Instructor cutout — transparent PNG/WebP, used in course card banners */
  instructorCutoutJayanta: {
    path: '/brand/instructor-cutout-jayanta.png',
    alt: 'Jayanta Sarkar, Invesone instructor',
    width: 180,
    height: 240,
    filled: false, // TODO(asset): not yet provided
  },

  /** Mentorship section banner */
  mentorshipBanner: {
    path: '/brand/mentorship-banner.jpg',
    alt: 'Invesone personal trading mentorship',
    width: 1200,
    height: 480,
    filled: false, // TODO(asset): not yet provided
  },

  /** Scholarship section banner */
  scholarshipBanner: {
    path: '/brand/scholarship-banner.jpg',
    alt: 'Invesone scholarship programme',
    width: 1200,
    height: 480,
    filled: false, // TODO(asset): not yet provided
  },

  /**
   * Brochure PDFs — keyed by course slug.
   * "filled: false" disables the Download Brochure button and shows tooltip.
   * Replace file at path to activate.
   */
  brochures: {
    'master-trader-programme': {
      path: '/brand/brochure-master-trader-programme.pdf',
      label: 'Master Trader Programme Brochure',
      filled: false, // TODO(asset): not yet provided
    },
    'masterclass-indicators-strategies': {
      path: '/brand/brochure-masterclass-indicators-strategies.pdf',
      label: 'Masterclass of Indicators & Strategies Brochure',
      filled: false, // TODO(asset): not yet provided
    },
    'mastery-derivatives-risk-management': {
      path: '/brand/brochure-mastery-derivatives-risk-management.pdf',
      label: 'Mastery in Derivatives Trading & Risk Management Brochure',
      filled: false, // TODO(asset): not yet provided
    },
  } as Record<string, { path: string; label: string; filled: boolean }>,

  /**
   * Company logos strip — renders ONLY when all filled: true.
   * Add entries as client provides them.
   */
  companyLogos: [] as Array<{
    path: string;
    alt: string;
    width: number;
    height: number;
    filled: boolean;
  }>,
} as const;
