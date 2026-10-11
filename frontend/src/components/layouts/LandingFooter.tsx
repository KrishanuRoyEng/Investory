'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  Mail,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react';

import { ASSETS } from '@/content/assets';
import { siteConfig } from '@/content/siteConfig';

// Custom X (Twitter) icon SVG
function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Custom YouTube icon SVG (white screen with red play button)
function YouTubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77 1.56.42 7.81.42 7.81.42s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77.42-1.56.42-4.81.42-4.81s0-3.25-.42-4.81z"
        fill="#FFFFFF"
      />
      <polygon points="10,15 15.4,12 10,9" fill="#FF0000" />
    </svg>
  );
}

// Custom Telegram icon SVG
function TelegramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.73-.53.36-1.02.54-1.45.53-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.5 1.07-.77 4.19-1.82 6.99-3.03 8.39-3.62 3.99-1.68 4.82-1.97 5.37-1.98.12 0 .39.03.56.17.15.12.19.28.21.43-.01.12-.02.26-.04.41z" />
    </svg>
  );
}

export function LandingFooter() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer
      className="py-16 px-4 lg:px-8 text-white relative z-20"
      style={{
        background: 'var(--lp-navy-deepest)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          
          {/* Column 1: Brand & Contact (spans 2 cols on desktop) */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 shrink-0 mb-4">
              {ASSETS.logoDark.filled ? (
                <Image
                  src={ASSETS.logoDark.path}
                  alt={ASSETS.logoDark.alt}
                  width={ASSETS.logoDark.width}
                  height={ASSETS.logoDark.height}
                />
              ) : (
                <div className="relative w-36 sm:w-44 aspect-[1020/539] flex items-center justify-center">
                  <Image
                    src={ASSETS.logoSourceTight.path}
                    alt={ASSETS.logoSourceTight.alt}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )}
              <span
                className="hidden sm:inline-block text-[10px] leading-tight tracking-widest font-medium uppercase"
                style={{ color: 'var(--lp-white-50)' }}
              >
                {siteConfig.tagline}
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm mb-4" style={{ color: 'var(--lp-white-70)' }}>
              INVESONE LLP is an online financial education platform committed to making capital-market education accessible, structured, and meaningful.
            </p>

            <div className="space-y-1.5 text-xs text-white/60 mb-6">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--lp-gold-bright)]" />
                <a href="mailto:invesone.social@gmail.com" className="hover:text-white transition-colors">
                  invesone.social@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[var(--lp-gold-bright)]" />
                <a href="tel:8420202193" className="hover:text-white transition-colors">
                  +91 8420202193
                </a>
              </p>
            </div>

            {/* Colored Circular Social Icons */}
            <div className="flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href={siteConfig.social.facebook || 'https://www.facebook.com/profile.php?id=61594770928800'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>

              {/* Instagram */}
              <a
                href={siteConfig.social.instagram || 'https://www.instagram.com/invesone/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* X / Twitter */}
              <a
                href={siteConfig.social.twitter || 'https://x.com/invesone'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border border-white/20 shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>

              {/* LinkedIn */}
              <a
                href={siteConfig.social.linkedin || 'https://www.linkedin.com/company/invesone/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/invesone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={siteConfig.social.youtube || 'https://www.youtube.com/@Invesone.Social'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-transform"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Features / Learn */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--lp-gold)' }}>
              Features
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="lp-footer-link">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="lp-footer-link">
                  Webinars
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="lp-footer-link">
                  Live Workshops
                </Link>
              </li>
              <li>
                <Link href="/courses?format=SELF_PACED" className="lp-footer-link">
                  All-in-One Courses
                </Link>
              </li>
              <li>
                <Link href="/courses?level=BEGINNER" className="lp-footer-link">
                  Beginner Series
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INVESONE / Company with Privacy & Terms Dropdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--lp-gold)' }}>
              INVESONE
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="lp-footer-link">
                  About us
                </Link>
              </li>

              {/* Interactive Dropdown for Privacy & Terms */}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer py-0.5 group"
                  aria-expanded={dropdownOpen}
                >
                  <span>Privacy &amp; Terms</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-white/50 group-hover:text-white ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Modal/Card matching screenshot */}
                {dropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))' }}
                  >
                    <Link
                      href="/terms"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-blue)] transition-colors"
                    >
                      Terms of use
                    </Link>
                    <Link
                      href="/privacy"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-blue)] transition-colors"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/grievance-policy"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-blue)] transition-colors"
                    >
                      Grievance Redressal Policy
                    </Link>
                  </div>
                )}
              </li>

              <li>
                <Link href="/financial-literacy" className="lp-footer-link">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about" className="lp-footer-link">
                  Company Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Join Us */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--lp-gold)' }}>
              Join Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="inline-flex items-center gap-2 lp-footer-link">
                  <span>Career</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500 text-white tracking-wide">
                    We are Hiring!
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="lp-footer-link">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <a href="mailto:invesone.social@gmail.com" className="lp-footer-link">
                  Partner with Us
                </a>
              </li>
              <li>
                <Link href="/contact" className="lp-footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--lp-gold)' }}>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/financial-literacy" className="lp-footer-link">
                  Financial Literacy Hub
                </Link>
              </li>
              <li>
                <Link href="/courses?level=ADVANCED" className="lp-footer-link">
                  NISM Exam Prep
                </Link>
              </li>
              <li>
                <Link href="/faq" className="lp-footer-link">
                  FAQs &amp; Doubts
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="lp-footer-link">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Accreditation & Trust Bar: In place of SEBI-Registered... Use NISM-Certified Trainers & Mentors */}
        <div
          className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--lp-white-70)',
          }}
        >
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-[rgba(212,148,30,0.12)] border border-[rgba(212,148,30,0.3)] flex items-center justify-center shrink-0 text-[var(--lp-gold-bright)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">NISM-Certified Trainers &amp; Mentors</p>
              <p className="text-white/60 text-xs">Market education and mentorship, built on certified expertise</p>
            </div>
          </div>

          <div className="text-center md:text-right text-white/50 text-xs">
            <p>© {new Date().getFullYear()} INVESONE LLP. All rights reserved.</p>
            <p className="text-[11px] text-white/40 mt-0.5">Learn with curiosity. Think with clarity. Approach the markets with understanding.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
