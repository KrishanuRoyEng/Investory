'use client';

import Image from 'next/image';

interface CarouselItem {
  label: string;
  title: string;
  instructorName: string;
  href: string;
}

export function HeroCarousel({ items }: { items: CarouselItem[] }) {
  // We keep the items prop to not break page.tsx, but render the static banner as requested by the user.
  return (
    <div className="relative w-full aspect-square max-w-[540px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center ml-auto border border-gray-200/20">
      <Image 
        src="/images/hero-banner-1.jpg" 
        alt="Trading & Investing Webinar by Jayanta Sarkar"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
