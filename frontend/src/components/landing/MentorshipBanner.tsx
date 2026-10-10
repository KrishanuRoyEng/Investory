import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Target, GraduationCap, TrendingUp, Star, Clock, Eye, Download, CalendarClock, Award } from 'lucide-react';
import { MENTORSHIP_BANNER } from '@/content/landing';
import { ASSETS } from '@/content/assets';

const ICONS: Record<string, React.ElementType> = {
  TrendingUp, Target, GraduationCap, Users, Star, Clock, Eye, Download, CalendarClock, Award
};

export function MentorshipBanner() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {ASSETS.mentorshipBanner.filled ? (
        <div className="rounded-2xl overflow-hidden relative min-h-[480px]">
          <Image src={ASSETS.mentorshipBanner.path} alt={ASSETS.mentorshipBanner.alt} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 p-10 lg:p-16 flex flex-col justify-center">
            {/* Text overlays */}
          </div>
        </div>
      ) : (
        <div className="lp-mentorship-banner rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden w-full">
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
  );
}
