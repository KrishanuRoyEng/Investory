import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Download, Users } from 'lucide-react';
import { components } from '@/lib/api/v1';
import { ASSETS } from '@/content/assets';

type Course = components['schemas']['Course'];

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const currentPrice = course.pricePaise !== undefined ? Math.floor(course.pricePaise / 100) : null;
  const wasPriceDisplay = course.compareAtPricePaise && currentPrice !== null && course.compareAtPricePaise > course.pricePaise
    ? Math.floor(course.compareAtPricePaise / 100) 
    : null;

  const hasBrochure = !!course.brochureUrl;
  const brochurePath = course.brochureUrl || '#';
  
  // Decide whether the view details is primary
  const brochurePrimary = false; // Based on landing design

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow h-full">
      
      {/* Banner */}
      <div className="relative h-32 flex items-center px-6 overflow-hidden bg-[var(--lp-navy-deepest)]">
        {course.bannerTag && (
          <div className="absolute top-4 left-4 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {course.bannerTag.replace('_', ' ')}
          </div>
        )}
        
        <div className="w-2/3 mt-6 relative z-10">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{course.title}</h3>
          {course.instructorName && (
            <p className="text-white/70 text-[10px] mt-1">{course.instructorName}</p>
          )}
        </div>

        <div className="absolute right-0 bottom-0 w-1/3 h-full flex items-end justify-end">
          {course.slug === 'master-trader-programme' ? (
            <div className="relative w-24 h-32">
              <Image src="/brand/master-trader-programme.jpg" alt="Master Trader Programme" fill className="object-cover object-top" />
            </div>
          ) : course.slug === 'mastery-derivatives-risk-management' ? (
            <div className="relative w-24 h-32">
              <Image src="/brand/mastery-derivatives.jpg" alt="Mastery in Derivatives" fill className="object-cover object-top" />
            </div>
          ) : course.cutoutImageUrl ? (
            <div className="relative w-24 h-32">
               <Image src={course.cutoutImageUrl} alt="Instructor" fill className="object-cover object-bottom" />
            </div>
          ) : (
             <div className="w-24 h-24 bg-white/10 rounded-tl-full flex items-center justify-center">
               <Users className="w-8 h-8 text-white/30" />
             </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
        {course.instructorName ? (
          <p className="text-xs text-gray-500 mb-3 sm:mb-4">by {course.instructorName}</p>
        ) : (
          <div className="h-3 sm:h-4 mb-3 sm:mb-4" />
        )}
        
        <p className="text-xs sm:text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
          {course.skills?.length ? course.skills.join(' • ') : course.description}
        </p>
        
        <p className="text-xs font-semibold text-[var(--brand-blue)] mb-4 sm:mb-6 flex items-center gap-1.5">
          <Users className="w-4 h-4" /> {course.displayLearnerCount || 0} Learners
        </p>
        
        <div className="h-px w-full bg-gray-100 mb-3 sm:mb-4"></div>
        
        <div className="flex items-center mb-4 sm:mb-6 min-h-[32px]">
          {currentPrice !== null ? (
            <>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">₹{currentPrice.toLocaleString()}</span>
              {wasPriceDisplay && (
                <span className="text-xs sm:text-sm line-through text-gray-400 ml-2">₹{wasPriceDisplay.toLocaleString()}</span>
              )}
            </>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-gray-400">Currently Unavailable</span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-auto">
          <Link 
            href={`/courses/${course.slug}`}
            className={`w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors
              ${!brochurePrimary ? 'bg-[var(--lp-navy-deepest)] text-white hover:bg-[var(--lp-navy-light)]' : 'border border-gray-300 text-gray-700 hover:border-gray-400'}`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View Details
          </Link>

          <a 
            href={hasBrochure ? brochurePath : '#'}
            className={`w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors
              ${brochurePrimary ? 'bg-[var(--brand-blue)] text-white hover:bg-blue-600' : 'border border-gray-300 text-gray-700 hover:border-gray-400'}
              ${!hasBrochure ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!hasBrochure ? 'Brochure coming soon' : ''}
            target={hasBrochure ? '_blank' : undefined}
            rel={hasBrochure ? 'noopener noreferrer' : undefined}
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Brochure
          </a>
        </div>
      </div>
    </div>
  );
}
