'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface CarouselItem {
  label: string;
  title: string;
  instructorName: string;
  href: string;
}

export function HeroCarousel({ items }: { items: CarouselItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[5/4] max-w-[540px] bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group ml-auto border border-gray-800">
      {/* Abstract dark grid background to match reference */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
        <div className="text-white">
          <p className="text-sm font-bold opacity-90 leading-tight">We Believe</p>
          <p className="text-sm font-bold opacity-90 leading-tight">There is a <span className="text-green-500">Trader</span></p>
          <p className="text-sm font-bold opacity-90 leading-tight">in Everyone</p>
        </div>
        <div className="px-2 py-1 border border-white/20 rounded text-xs font-bold text-white bg-black/40">
          Invesone
        </div>
      </div>

      <div className="relative z-10 w-full px-10 text-center flex flex-col items-start text-left mt-8">
        <span className="inline-block px-4 py-1.5 text-xs font-bold rounded-full mb-6 text-gray-300 border border-gray-600 bg-gray-800/50">
          • {currentItem.label}
        </span>
        <h3 className="font-extrabold text-3xl md:text-4xl leading-tight text-white mb-2 max-w-[80%]">
          {currentItem.title}
        </h3>
        <p className="text-xl md:text-2xl text-gray-400 italic mb-10">In Every Condition.</p>
        
        <div className="space-y-3 mb-10 text-gray-300 text-sm font-medium">
          <p className="flex items-center gap-2"><span className="text-blue-400">⚙</span> Equity & Swing Trading</p>
          <p className="flex items-center gap-2"><span className="text-purple-400">⚡</span> Options Trading</p>
          <p className="flex items-center gap-2"><span className="text-orange-400">🏅</span> Commodities</p>
          <p className="flex items-center gap-2"><span className="text-pink-400">🤖</span> Algo Trading</p>
        </div>

        <Link
          href={currentItem.href}
          className="inline-block px-6 py-2.5 rounded-lg text-white font-bold text-sm bg-gradient-to-b from-[#d95c41] to-[#b93822] border border-[#ff8e73] hover:opacity-90 transition-opacity shadow-lg"
        >
          Fill Form to get program details
        </Link>
      </div>

      <div className="absolute bottom-0 right-0 w-[60%] h-[65%] flex items-end justify-end pointer-events-none z-10">
        {/* Placeholder for Vivek Bajaj instructor cutout */}
        <div className="relative w-full h-full">
           <div className="absolute bottom-0 right-10 w-48 h-64 bg-white/5 rounded-t-full flex items-center justify-center border border-white/10 border-b-0">
             <span className="text-white/30 font-bold">{currentItem.instructorName}</span>
           </div>
        </div>
        <div className="absolute bottom-4 right-10 text-center z-20">
           <p className="text-white font-bold text-lg leading-tight">{currentItem.instructorName}</p>
           <p className="text-xs text-gray-400">30+ years of Market Experience</p>
        </div>
      </div>

      {/* Carousel Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-black z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded bg-white flex items-center justify-center text-black z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 border-2 border-blue-500"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
