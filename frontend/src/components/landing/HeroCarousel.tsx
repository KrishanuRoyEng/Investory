'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BANNERS = [
  {
    src: '/brand/master-trader-programme.jpg',
    alt: 'Master Trader Programme by INVESONE',
    href: '/courses?level=BEGINNER',
  },
  {
    src: '/brand/mastery-derivatives.jpg',
    alt: 'Mastery in Derivatives Trading & Risk Management by Jayanta Sarkar',
    href: '/courses/mastery-derivatives-risk-management',
  },
];

export function HeroCarousel({ items }: { items?: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[420px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center ml-auto border border-white/20 group bg-slate-900/60">
      {BANNERS.map((banner, idx) => (
        <Link
          key={banner.src}
          href={banner.href}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={idx === 0}
          />
        </Link>
      ))}

      {/* Indicator dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Show slide ${idx + 1}`}
            className={`transition-all rounded-full ${
              idx === current ? 'w-5 h-2 bg-[var(--lp-gold-bright)]' : 'w-2 h-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
