'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Reset to page 1 on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?${createQueryString('q', query)}`);
  };

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-border p-6 rounded-lg mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-grow relative">
          <label htmlFor="search" className="sr-only">Search courses</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or topic..."
            className="w-full bg-background/50 border border-border/80/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-4">
          <select
            aria-label="Filter by level"
            value={searchParams.get('level') || ''}
            onChange={(e) => router.push(`?${createQueryString('level', e.target.value)}`)}
            className="bg-background/50 border border-border/80/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <select
            aria-label="Filter by format"
            value={searchParams.get('format') || ''}
            onChange={(e) => router.push(`?${createQueryString('format', e.target.value)}`)}
            className="bg-background/50 border border-border/80/50 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
          >
            <option value="">All Formats</option>
            <option value="SELF_PACED">Self Paced</option>
            <option value="LIVE">Live</option>
            <option value="BUNDLE">Bundle</option>
          </select>
          
          <button 
            type="submit" 
            className="md:hidden bg-emerald-600 text-foreground px-4 py-2.5 rounded-lg font-medium"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
