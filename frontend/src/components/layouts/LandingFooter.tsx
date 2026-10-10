import Link from 'next/link';
import { Youtube, Twitter, Instagram, Linkedin } from 'lucide-react';

import { ASSETS } from '@/content/assets';
import { BRAND_NAME, FOOTER_COLS } from '@/content/landing';
import { siteConfig } from '@/content/siteConfig';
import Image from 'next/image';

const SOCIAL_ICONS = [
  { icon: <Youtube className="w-4 h-4" />, href: siteConfig.social.youtube || '#', label: 'YouTube' },
  { icon: <Instagram className="w-4 h-4" />, href: siteConfig.social.instagram || '#', label: 'Instagram' },
  { icon: <Twitter className="w-4 h-4" />, href: siteConfig.social.twitter || '#', label: 'Twitter' },
  { icon: <Linkedin className="w-4 h-4" />, href: siteConfig.social.linkedin || '#', label: 'LinkedIn' },
];

export function LandingFooter() {
  return (
    <footer
      className="py-16 px-4 lg:px-8"
      style={{
        background: 'var(--lp-navy-deepest)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 shrink-0 mr-2 mb-4">
              {ASSETS.logoDark.filled ? (
                <Image src={ASSETS.logoDark.path} alt={ASSETS.logoDark.alt} width={ASSETS.logoDark.width} height={ASSETS.logoDark.height} />
              ) : (
                <div className="relative w-36 sm:w-44 aspect-[1020/539] flex items-center justify-center">
                  <Image src={ASSETS.logoSourceTight.path} alt={ASSETS.logoSourceTight.alt} fill className="object-contain object-left" />
                </div>
              )}
              <span className="hidden sm:inline-block text-[10px] leading-tight tracking-widest font-medium" style={{ color: 'var(--lp-white-50)' }}>
                {siteConfig.tagline}
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'var(--lp-white-50)' }}>
              Building disciplined, informed market participants through expert-led courses, live mentorship and continuous learning.
            </p>
            {/* Social icons — hover handled by lp-footer-social-icon CSS class */}
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((s) => (
                <a key={s.label} href={s.href} className="lp-footer-social-icon" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.label}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--lp-gold)' }}>
                {col.label}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {/* lp-footer-link CSS class handles color + hover */}
                    <Link href={link.href} className="lp-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--lp-white-50)',
          }}
        >
          <p>© {new Date().getFullYear()} {BRAND_NAME} Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
