import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { SCHOLARSHIP_BANNER } from '@/content/landing';
import { ASSETS } from '@/content/assets';

export function ScholarshipBanner() {
  const scholarshipEnabled = process.env.NEXT_PUBLIC_SCHOLARSHIP_ENABLED === 'true';

  if (!scholarshipEnabled) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full">
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
  );
}
