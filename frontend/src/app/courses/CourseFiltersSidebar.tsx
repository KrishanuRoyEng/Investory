'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface Category {
  slug: string;
  name: string;
  publishedCount?: number;
}

interface CourseFiltersSidebarProps {
  categories: Category[];
}

export function CourseFiltersSidebar({ categories }: CourseFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  const toggleCategory = (slug: string) => {
    const currentCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
    let newCategories = [];
    if (currentCategories.includes(slug)) {
      newCategories = currentCategories.filter(c => c !== slug);
    } else {
      newCategories = [...currentCategories, slug];
    }
    router.push(`?${createQueryString('category', newCategories.join(','))}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?${createQueryString('q', query)}`);
  };

  const clearFilters = () => {
    router.push('?');
  };

  const activeCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const level = searchParams.get('level') || '';
  const format = searchParams.get('format') || '';
  const hasActiveFilters = activeCategories.length > 0 || level || format || searchParams.get('q');

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold mb-6 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-4 h-4" /> Filters
      </button>

      {/* Sidebar Content */}
      <div className={`fixed inset-0 z-50 bg-black/50 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
      
      <div className={`fixed lg:static inset-y-0 right-0 z-50 w-[300px] lg:w-full max-h-screen overflow-y-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none p-6 lg:p-0 transition-transform duration-300 ease-in-out lg:transform-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between lg:hidden mb-8">
          <h2 className="text-xl font-extrabold text-[var(--lp-navy-deepest)]">Filters</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-8 relative">
          <label htmlFor="search" className="sr-only">Search courses</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent transition-all shadow-sm"
          />
        </form>

        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[var(--brand-blue)] checked:border-[var(--brand-blue)] transition-colors cursor-pointer"
                      checked={activeCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1">{cat.name}</span>
                  {cat.publishedCount !== undefined && (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.publishedCount}</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Level */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Level</h3>
            <div className="flex flex-col gap-2">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((l) => (
                <label key={l} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="radio" 
                      name="level"
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[var(--brand-blue)] transition-colors cursor-pointer"
                      checked={level === l}
                      onChange={() => router.push(`?${createQueryString('level', l)}`)}
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)] scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 capitalize">{l.toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Format */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Format</h3>
            <div className="flex flex-col gap-2">
              {['SELF_PACED', 'LIVE', 'BUNDLE'].map((f) => (
                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="radio" 
                      name="format"
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[var(--brand-blue)] transition-colors cursor-pointer"
                      checked={format === f}
                      onChange={() => router.push(`?${createQueryString('format', f)}`)}
                    />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)] scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex-1 capitalize">{f.replace('_', ' ').toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="w-full mt-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </>
  );
}
