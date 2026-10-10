'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Phone, Menu, X, Dot } from 'lucide-react';
import Image from 'next/image';
import { ASSETS } from '@/content/assets';
import { BRAND_NAME, NAV_COURSES_DROPDOWN, NAV_LINKS, NAV_SEARCH_PLACEHOLDER } from '@/content/landing';



export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const res = await fetch(`${baseUrl}/live-sessions?status=IN_PROGRESS`);
        if (res.ok) {
          const data = await res.json();
          const items = data.data || [];
          if (items.length > 0) {
            setIsLive(true);
          }
        }
      } catch (err) {
        // fail gracefully
      }
    };
    checkLiveStatus();
  }, []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sticky scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Poll live status — only show Live badge when something is actually IN_PROGRESS
  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/live-sessions`
        );
        const json = await res.json();
        const sessions = json?.data?.sessions || json?.data || [];
        const hasLive = Array.isArray(sessions) && sessions.some(
          (s: any) => s.status === 'IN_PROGRESS'
        );
        setIsLive(hasLive);
      } catch {
        // silently fail — live badge is optional
      }
    };
    checkLive();
    const interval = setInterval(checkLive, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-[#1a0f00] text-[#ff9900] text-xs md:text-sm font-semibold py-2 px-4 text-center">
        Are you trading wrong? <span className="text-white">What separates consistent traders from the rest?</span> <a href="#" className="underline hover:text-white transition-colors ml-1">Fill the Form To Know More</a>
      </div>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 bg-white shadow-sm border-b border-gray-200`}
        style={{
          height: 'var(--lp-nav-height)',
        }}
      >
      <div className="max-w-[1400px] mx-auto h-full flex items-center px-4 lg:px-8 gap-4">

        {/* 1. Logo + tagline */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-2">
          <div className="relative h-8 sm:h-10 w-auto aspect-[1020/539] flex items-center justify-center">
            {ASSETS.logoDark.filled ? (
              <Image src={ASSETS.logoDark.path} alt={ASSETS.logoDark.alt} fill className="object-contain object-left" />
            ) : (
              <Image src={ASSETS.logoSourceTight.path} alt={ASSETS.logoSourceTight.alt} fill className="object-contain object-left" />
            )}
          </div>
          <span className="hidden sm:inline-block text-[10px] leading-tight tracking-widest font-medium text-gray-500 uppercase">
            Be the one.
          </span>
        </Link>

        {/* 2. Search bar — ~10-15% narrower to fit 5 nav items */}
        <div className="hidden lg:flex flex-1 max-w-[280px] relative ml-2 mr-4">
          <input
            type="search"
            placeholder={NAV_SEARCH_PLACEHOLDER}
            className="w-full text-xs py-2 pl-4 pr-10 rounded-full outline-none transition-all bg-white border border-gray-300 text-gray-900 focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)]"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1">

          {/* 3. Courses dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCoursesOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold text-gray-800 hover:text-[var(--brand-blue)] transition-colors"
            >
              Courses
              <ChevronDown className={`w-3.5 h-3.5 transition-transform opacity-70 ${coursesOpen ? 'rotate-180' : ''}`} />
            </button>

            {coursesOpen && (
              <div
                className="lp-dropdown absolute top-full left-0 mt-2 w-52 rounded-xl overflow-hidden z-50 bg-white border border-gray-100 shadow-xl"
              >
                {NAV_COURSES_DROPDOWN.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setCoursesOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--brand-blue)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map(link => (
            <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
          ))}

          {/* 7. Live Events with conditional badge */}
          <div className="relative flex flex-col items-center">
            {isLive && (
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[9px] font-bold rounded-full flex items-center gap-0.5 whitespace-nowrap"
                style={{
                  border: '1px solid var(--lp-gold)',
                  color: 'var(--lp-gold-bright)',
                  background: 'rgba(212,148,30,0.1)',
                }}
              >
                <span className="lp-live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--lp-gold)' }} />
                Live
              </span>
            )}
            <NavLink href="/live">Live Events</NavLink>
          </div>

        </div>

        {/* Right side: divider + contact + auth */}
        <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">

          {/* 8. Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* 9. Speak with Us */}
          <a
            href="tel:+918000000000"
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-blue)] hover:text-blue-700 transition-colors mr-2"
          >
            <Phone className="w-4 h-4" />
            Talk To Us
          </a>

          {/* 10. Login */}
          <Link
            href="/login"
            className="px-5 py-2 rounded text-sm font-semibold border border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>

          {/* 11. Sign up */}
          <Link
            href="/signup"
            className="px-5 py-2 rounded text-sm font-semibold bg-[var(--brand-blue)] text-white hover:bg-blue-600 transition-colors shadow-sm"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto p-2 rounded-md text-gray-800"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden overflow-hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile search */}
            <div className="relative mb-4">
              <input
                type="search"
                placeholder="Search for technical analysis, options etc..."
                className="w-full text-sm py-2.5 pl-4 pr-10 rounded-lg outline-none bg-gray-50 border border-gray-300 text-gray-900"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <MobileNavSection label="Courses">
              {NAV_COURSES_DROPDOWN.map(item => (
                <MobileNavLink key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </MobileNavLink>
              ))}
            </MobileNavSection>
            {NAV_LINKS.map(link => (
              <MobileNavLink key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </MobileNavLink>
            ))}
            <MobileNavLink href="/live" onClick={() => setMobileOpen(false)}>
              Live Workshop {isLive && (
                <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-600">Live</span>
              )}
            </MobileNavLink>
            <MobileNavLink href="tel:+918000000000" onClick={() => setMobileOpen(false)}>📞 Talk To Us</MobileNavLink>

            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-lg text-center text-sm font-semibold border border-[var(--brand-blue)] text-[var(--brand-blue)]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-lg text-center text-sm font-semibold bg-[var(--brand-blue)] text-white"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-md text-sm font-semibold text-gray-800 hover:text-[var(--brand-blue)] transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:text-[var(--brand-blue)] hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavSection({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pl-4">{children}</div>}
    </div>
  );
}
