import './landing.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingNav } from '@/components/layouts/LandingNav';
import { HeroCarousel } from '@/components/landing/HeroCarousel';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import { siteConfig } from '@/content/siteConfig';
import { ASSETS } from '@/content/assets';
import {
  HERO,
  HERO_STATS,
  JOURNEY_CARDS,
  PROMO_CARD,
  SPOTLIGHT,
  COURSE_GRID,
  FEATURED_COURSES,
  MENTORSHIP_BANNER,
  SCHOLARSHIP_BANNER,
} from '@/content/landing';
import {
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Target,
  GraduationCap,
  Users,
  Star,
  Clock,
  Eye,
  Download,
  CalendarClock,
  Award,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  TrendingUp,
  Target,
  GraduationCap,
  Users,
  Star,
  Clock,
  Eye,
  Download,
  CalendarClock,
  Award,
};

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
};

export const dynamic = 'force-dynamic';

const DEFAULT_PRICES: Record<string, number> = {
  'master-trader-programme': 8999,
  'masterclass-indicators-strategies': 14999,
  'mastery-derivatives-risk-management': 17999,
};

async function fetchCoursePrice(slug: string): Promise<number | null> {
  const fallback = DEFAULT_PRICES[slug] ?? null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${baseUrl}/courses/${slug}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return fallback;
    const body = await res.json();
    const course = body.data || body;
    if (course.status !== 'PUBLISHED') return fallback;
    return Math.floor(course.pricePaise / 100);
  } catch (err) {
    return fallback;
  }
}

export default async function LandingPage() {
  const scholarshipEnabled = process.env.NEXT_PUBLIC_SCHOLARSHIP_ENABLED === 'true';

  // Fetch prices in parallel
  const [promoPrice, spotlightPrice] = await Promise.all([
    fetchCoursePrice('master-trader-programme'),
    fetchCoursePrice('master-trader-programme'),
  ]);

  const featuredCoursePrices = await Promise.all(
    FEATURED_COURSES.map(c => c.slug ? fetchCoursePrice(c.slug) : Promise.resolve(null))
  );

  return (
    <div data-theme="landing" className="min-h-screen" style={{ background: 'var(--lp-navy-deepest)', color: 'var(--lp-white)' }}>
      <LandingNav />

      <main>
        {/* ══ HERO ══ */}
        <section
          className="relative pt-4 lg:pt-6"
          style={{ background: 'var(--lp-navy-deepest)' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(212,148,30,0.06)' }} />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(15,30,61,0.8)' }} />
          </div>

          <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center mb-0 lg:-mb-4">

              {/* Left */}
              <div>
                <h1 className="font-extrabold leading-[1.1] tracking-tight mb-6 text-[clamp(2.5rem,5vw,3.75rem)]" style={{ color: 'var(--lp-white)' }}>
                  {HERO.h1Line1}<br />
                  <span style={{ color: 'var(--lp-gold-bright)' }}>{HERO.h1Line2}</span>
                </h1>
                <p className="text-base lg:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: 'var(--lp-white-70)' }}>
                  {HERO.subheadline}
                </p>
                <p className="text-sm md:text-base font-medium mb-4" style={{ color: 'var(--lp-white-90)' }}>
                  {HERO.leadIn}
                </p>
                <div className="flex flex-col gap-3">
                  {JOURNEY_CARDS.map((card) => {
                    const IconComp = ICONS[card.icon];
                    return (
                      <Link
                        key={card.title}
                        href={card.href}
                        className="group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(90deg, #f0f4f8 0%, #e6eff7 100%)',
                          border: '1px solid #d9e2ec',
                        }}
                      >
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-white shadow-sm border border-blue-100">
                          {IconComp && <IconComp className="w-6 h-6 text-[var(--brand-blue)]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm leading-tight text-gray-900">{card.title}</p>
                          <p className="text-xs leading-relaxed mt-0.5 text-gray-600">{card.sub}</p>
                        </div>
                        <span className="text-xs font-semibold shrink-0 ml-4 text-[var(--brand-blue)]">
                          Explore ↓
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right — promo carousel */}
              <div className="flex flex-col items-center xl:items-end justify-center h-full w-full">
                <HeroCarousel items={[{
                  label: "Master Trader Programme",
                  title: "Trade with Clarity & Discipline",
                  instructorName: "INVESONE Faculty",
                  href: "/courses/master-trader-programme"
                }]} />
              </div>

            </div>
          </div>

          {/* ══ STATS BAR ══ */}
          <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-8 translate-y-1/2">
            <div className="bg-[#1a2340] rounded-2xl border border-[#2a365c] py-5 px-6 lg:px-12 flex justify-between md:justify-around items-center text-center shadow-2xl">
              {HERO_STATS.map((s, i) => (
                <div key={i} className="flex flex-col items-center sm:flex-row gap-3">
                  <div className="text-left hidden sm:block">
                    <span className="text-xl md:text-2xl font-bold text-white block">{s.value}</span>
                    <span className="text-[10px] md:text-xs text-gray-400 block">{s.label}</span>
                  </div>
                  <div className="text-center sm:hidden">
                    <span className="text-lg font-bold text-white block">{s.value}</span>
                    <span className="text-[10px] text-gray-400 block">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SPOTLIGHT ══ */}
        <section className="py-20 px-4 lg:px-8 bg-gray-50 text-gray-900" style={{ color: '#111827' }}>
          <div className="max-w-[1400px] mx-auto">
            <Link href={SPOTLIGHT.eyebrowHref} className="inline-block text-sm font-semibold text-[var(--brand-blue)] hover:underline mb-6">
              {SPOTLIGHT.eyebrowLink}
            </Link>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative min-h-[320px] md:min-h-0 bg-[#0a1628] flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/brand/master-trader-programme.jpg" 
                    alt="Master Trader Programme - INVESONE" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                
                <div className="p-10 lg:p-14 flex flex-col justify-center">
                  <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-snug">
                    {SPOTLIGHT.title}
                  </h2>
                  <p className="text-sm lg:text-base mb-8 leading-relaxed text-gray-600">
                    {SPOTLIGHT.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    {SPOTLIGHT.chips.map((chip, i) => {
                      const IconComp = ICONS[chip.icon];
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                            {IconComp && <IconComp className="w-4 h-4" />}
                          </div>
                          <span className="text-sm font-medium">{chip.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{SPOTLIGHT.skillsLabel}</p>
                    <div className="flex flex-wrap gap-2">
                      {SPOTLIGHT.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {spotlightPrice !== null ? (
                        <>
                          <span className="text-2xl font-extrabold text-[var(--lp-navy-deepest)]">₹{spotlightPrice.toLocaleString()}</span>
                          {SPOTLIGHT.wasPrice && SPOTLIGHT.wasPrice > spotlightPrice * 100 && (
                            <>
                              <span className="text-sm line-through text-gray-400 ml-2">₹{Math.floor(SPOTLIGHT.wasPrice / 100).toLocaleString()}</span>
                              <p className="text-xs font-bold text-green-600 mt-1">
                                You save ₹{Math.floor((SPOTLIGHT.wasPrice - spotlightPrice * 100) / 100).toLocaleString()}
                              </p>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">Currently Unavailable</span>
                      )}
                    </div>
                    <Link href={SPOTLIGHT.ctaHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--lp-navy-deepest)] text-white text-sm font-bold hover:bg-[var(--lp-navy-light)] transition-colors">
                      {SPOTLIGHT.ctaText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ COURSE GRID ══ */}
        <section className="py-20 px-4 lg:px-8 bg-gray-50 text-gray-900">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-blue)]">{COURSE_GRID.eyebrow}</span>
                <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 leading-snug whitespace-pre-line text-[var(--lp-navy-deepest)]">
                  {COURSE_GRID.heading}
                </h2>
                <p className="text-gray-600 mt-2 max-w-lg">{COURSE_GRID.subheading}</p>
              </div>
              <Link href={COURSE_GRID.viewAllHref} className="flex items-center gap-2 text-sm font-semibold shrink-0 text-[var(--brand-blue)] hover:underline">
                {COURSE_GRID.viewAllText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_COURSES.map((course, idx) => {
                const isCardC = !course.cardTitle;
                if (isCardC) {
                  return (
                    <div key={idx} className="bg-gray-100 rounded-2xl border border-gray-200 border-dashed flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
                      <p className="text-sm text-gray-500 font-medium mb-2">Slot Available for Future Course</p>
                      <p className="text-xs text-gray-400">Content pending.</p>
                    </div>
                  );
                }

                const currentPrice = featuredCoursePrices[idx];
                const wasPriceDisplay = course.wasPrice && currentPrice !== null && course.wasPrice > (currentPrice * 100) 
                  ? Math.floor(course.wasPrice / 100) : null;

                const hasBrochure = ASSETS.brochures[course.brochureKey]?.filled;
                const brochurePath = ASSETS.brochures[course.brochureKey]?.path;

                return (
                  <div key={course.slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Banner */}
                    <div className="relative h-32 flex items-center px-6 overflow-hidden bg-[var(--lp-navy-deepest)]">
                      <div className="absolute top-4 left-4 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {course.bannerTag}
                      </div>
                      
                      <div className="w-2/3 mt-6 relative z-10">
                        <h3 className="text-white font-bold text-lg leading-tight">{course.bannerTitle}</h3>
                        <p className="text-white/70 text-[10px] mt-1">{course.instructorName}, {course.instructorCredential}</p>
                      </div>

                      <div className="absolute right-0 bottom-0 w-1/3 h-full flex items-end justify-end">
                        {course.slug === 'mastery-derivatives-risk-management' ? (
                          <div className="relative w-24 h-32">
                            <Image src="/brand/mastery-derivatives.jpg" alt="Mastery in Derivatives" fill className="object-cover object-top" />
                          </div>
                        ) : course.slug === 'master-trader-programme' ? (
                          <div className="relative w-24 h-32">
                            <Image src="/brand/master-trader-programme.jpg" alt="Master Trader Programme" fill className="object-cover object-top" />
                          </div>
                        ) : ASSETS.instructorCutoutJayanta.filled ? (
                          <div className="relative w-24 h-32">
                             <Image src={ASSETS.instructorCutoutJayanta.path} alt={ASSETS.instructorCutoutJayanta.alt} fill className="object-cover object-bottom" />
                          </div>
                        ) : (
                           <div className="w-24 h-24 bg-white/10 rounded-tl-full flex items-center justify-center">
                             <Users className="w-8 h-8 text-white/30" />
                           </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{course.cardTitle}</h3>
                      <p className="text-xs text-gray-500 mb-4">by {course.instructorName}</p>
                      
                      <p className="text-sm text-gray-600 mb-4 flex-1">
                        {course.skillsText}
                      </p>
                      
                      <p className="text-xs font-semibold text-[var(--brand-blue)] mb-6 flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> {course.learnerCount}
                      </p>
                      
                      <div className="h-px w-full bg-gray-100 mb-4"></div>
                      
                      <div className="flex items-center mb-6">
                        {currentPrice !== null ? (
                          <>
                            <span className="text-2xl font-extrabold text-gray-900">₹{currentPrice.toLocaleString()}</span>
                            {wasPriceDisplay && (
                              <span className="text-sm line-through text-gray-400 ml-2">₹{wasPriceDisplay.toLocaleString()}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">Currently Unavailable</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-auto">
                        <Link 
                          href={course.viewDetailsHref} 
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors
                            ${!course.brochurePrimary ? 'bg-[var(--lp-navy-deepest)] text-white hover:bg-[var(--lp-navy-light)]' : 'border border-gray-300 text-gray-700 hover:border-gray-400'}`}
                        >
                          <Eye className="w-4 h-4" /> {course.viewDetailsLabel}
                        </Link>

                        <a 
                          href={hasBrochure ? brochurePath : '#'}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors
                            ${course.brochurePrimary ? 'bg-[var(--brand-blue)] text-white hover:bg-blue-600' : 'border border-gray-300 text-gray-700 hover:border-gray-400'}
                            ${!hasBrochure ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={!hasBrochure ? 'Brochure coming soon' : ''}
                        >
                          <Download className="w-4 h-4" /> {course.brochureLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ MENTORSHIP BANNER ══ */}
        <section className="py-6 lg:py-8 px-4 lg:px-8" style={{ background: 'var(--lp-navy-deepest)' }}>
          <div className="max-w-[1400px] mx-auto">
            {ASSETS.mentorshipBanner.filled ? (
              <div className="rounded-2xl overflow-hidden relative min-h-[480px]">
                <Image src={ASSETS.mentorshipBanner.path} alt={ASSETS.mentorshipBanner.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 p-10 lg:p-16 flex flex-col justify-center">
                  {/* Text overlays would go here if needed over the full image, but keeping HTML as requested */}
                </div>
              </div>
            ) : (
              <div className="lp-mentorship-banner rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                <div className="p-6 lg:p-8 relative z-10">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--lp-gold-bright)' }}>
                    {MENTORSHIP_BANNER.eyebrow}
                  </span>
                  <h2 className="font-extrabold mb-4 leading-tight text-white text-[clamp(2rem,3.5vw,2.5rem)]">
                    {MENTORSHIP_BANNER.heading}
                  </h2>
                  <p className="text-base mb-8 leading-relaxed max-w-lg" style={{ color: 'var(--lp-white-70)' }}>
                    {MENTORSHIP_BANNER.subtext}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {MENTORSHIP_BANNER.stats.map((s, i) => {
                      const IconComp = ICONS[s.icon];
                      return (
                        <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex flex-col gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[var(--lp-gold-bright)]">
                            {IconComp && <IconComp className="w-4 h-4" />}
                          </div>
                          <p className="text-xl font-extrabold text-white">{s.val}</p>
                          <p className="text-xs text-[var(--lp-white-50)]">{s.label}</p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-bold text-white mb-3">{MENTORSHIP_BANNER.skillsHeading}</p>
                    <div className="flex flex-wrap gap-2">
                      {MENTORSHIP_BANNER.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium border border-[rgba(255,255,255,0.1)] text-[var(--lp-white-90)] bg-[rgba(0,0,0,0.2)]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={MENTORSHIP_BANNER.ctaHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[var(--lp-navy-deepest)] text-sm font-bold hover:bg-gray-100 transition-colors">
                    {MENTORSHIP_BANNER.ctaText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="relative min-h-[400px] lg:min-h-0 flex items-end justify-center lg:justify-end px-10 pt-10">
                  {ASSETS.instructorCutoutJayanta.filled ? (
                    <div className="relative w-[300px] h-[400px] z-10">
                      <Image src={ASSETS.instructorCutoutJayanta.path} alt={ASSETS.instructorCutoutJayanta.alt} fill className="object-cover object-bottom" />
                    </div>
                  ) : (
                    <div className="w-48 h-64 bg-[rgba(255,255,255,0.05)] rounded-t-[100px] flex items-center justify-center relative z-10 border border-[rgba(255,255,255,0.1)] border-b-0">
                      <Users className="w-16 h-16 text-[rgba(255,255,255,0.2)]" />
                      <span className="absolute bottom-4 text-xs text-[rgba(255,255,255,0.3)]">Placeholder</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 text-right">
                    <p className="text-xl font-bold text-white shadow-sm">{MENTORSHIP_BANNER.mentorName}</p>
                    <p className="text-sm text-[var(--lp-gold-bright)] font-medium shadow-sm">{MENTORSHIP_BANNER.mentorTitle}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══ SCHOLARSHIP BANNER ══ */}
        {scholarshipEnabled && (
          <section className="py-20 px-4 lg:px-8 bg-gray-50 text-gray-900 border-t border-gray-200">
            <div className="max-w-[1400px] mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-8 lg:p-12 gap-8">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-[var(--brand-blue)] flex items-center justify-center shrink-0 border border-indigo-100">
                  {ASSETS.scholarshipBanner.filled ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image src={ASSETS.scholarshipBanner.path} alt={ASSETS.scholarshipBanner.alt} fill className="object-cover" />
                    </div>
                  ) : (
                    <Award className="w-10 h-10" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                    {SCHOLARSHIP_BANNER.heading}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 max-w-2xl">
                    {SCHOLARSHIP_BANNER.subtext}
                  </p>
                </div>
                
                <Link href={SCHOLARSHIP_BANNER.ctaHref} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shrink-0 whitespace-nowrap w-full md:w-auto">
                  {SCHOLARSHIP_BANNER.ctaText}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ══ SOCIAL MEDIA ══ */}
        <section className="py-20 px-4 lg:px-8 bg-gray-50 flex flex-col items-center justify-center border-t border-gray-200">
          <h2 className="text-3xl font-extrabold text-[#0a1628] mb-2 text-center">Join us on social media</h2>
          <p className="text-gray-500 mb-10 text-center">Stay updated with markets, courses & expert insights</p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <a href="https://www.facebook.com/profile.php?id=61594770928800" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2 px-6 pr-10 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0">
                <Facebook className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0a1628] text-sm leading-tight">Facebook</span>
                <span className="text-xs text-gray-500">@Invesone</span>
              </div>
            </a>

            <a href="https://www.instagram.com/invesone/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2 px-6 pr-10 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0a1628] text-sm leading-tight">Instagram</span>
                <span className="text-xs text-gray-500">@invesone</span>
              </div>
            </a>

            <a href="https://www.linkedin.com/company/invesone/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2 px-6 pr-10 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shrink-0">
                <Linkedin className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0a1628] text-sm leading-tight">LinkedIn</span>
                <span className="text-xs text-gray-500">@invesone</span>
              </div>
            </a>

            <a href="https://www.youtube.com/@Invesone.Social" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2 px-6 pr-10 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77 1.56.42 7.81.42 7.81.42s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77.42-1.56.42-4.81.42-4.81s0-3.25-.42-4.81z"
                    fill="#FFFFFF"
                  />
                  <polygon points="10,15 15.4,12 10,9" fill="#FF0000" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0a1628] text-sm leading-tight">YouTube</span>
                <span className="text-xs text-gray-500">Subscribe For Free</span>
              </div>
            </a>
            
            <a href="https://invesone.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2 px-6 pr-10 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#0a1628] text-sm leading-tight">Website</span>
                <span className="text-xs text-gray-500">invesone.com</span>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-semibold text-gray-600">
            <a href="mailto:invesone.social@gmail.com" className="flex items-center gap-2 hover:text-[#0a1628] transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                <Mail className="w-4 h-4" />
              </div>
              invesone.social@gmail.com
            </a>
            <a href="tel:8420202193" className="flex items-center gap-2 hover:text-[#0a1628] transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                <Phone className="w-4 h-4" />
              </div>
              +91 8420202193
            </a>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
