/**
 * siteConfig.ts — Single source of truth for site-level metadata.
 *
 * BRAND NAME: "Invesone" — confirmed by client 2026-10-10.
 * Previously "INVESTONE" / "Investory" / "INVESONE" / "InvesOne" in various files.
 * Audit other pages/components for stale spellings.
 *
 * SOCIAL URLS: Only real ones supplied by client should be listed here.
 * None have been supplied yet — all social fields are null/TODO.
 * See docs/open-stubs.md §L-SOCIAL.
 */

export const siteConfig = {
  /** Brand name — single canonical spelling, confirmed 2026-10-10 */
  name: 'Invesone',
  tagline: 'Be the one.',

  /**
   * Base URL — pulled from env at runtime.
   * Set NEXT_PUBLIC_SITE_URL in .env / Vercel / Render.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://invesone.com',

  /**
   * Default meta description (158 chars — within 160-char limit).
   * Confirmed char count: 158.
   */
  description:
    'Learn share market trading, investing and NISM exam prep through mentor-led courses, live classes and personal mentorship from experienced professionals.',

  /**
   * Default OG title (55 chars — within 60-char limit).
   * Confirmed char count: 55.
   */
  defaultTitle: 'Invesone — Master the Stock Market',

  titleTemplate: '%s | Invesone',

  /**
   * Social URLs — TODO(stub-social): None supplied yet.
   * Populate when client provides real handles.
   * See docs/open-stubs.md §L-SOCIAL.
   */
  social: {
    youtube: 'https://www.youtube.com/@Invesone.Social',
    instagram: 'https://www.instagram.com/invesone/',
    facebook: 'https://www.facebook.com/profile.php?id=61594770928800',
    linkedin: 'https://www.linkedin.com/company/invesone/',
    twitter: 'https://x.com/invesone',
  },

  email: 'invesone.social@gmail.com',
  phone: '+91 8420202193',

  /** OG image — from /public/brand/ slot */
  ogImage: '/brand/og-image.png',

  /** Favicon path */
  favicon: '/icon.png',
} as const;

export type SiteConfig = typeof siteConfig;
