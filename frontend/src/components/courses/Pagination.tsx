'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
}

export function Pagination({ currentPage, pageSize, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => router.push(`?${createQueryString('page', String(currentPage - 1))}`)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg bg-surface/50 border border-border text-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface/80 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="px-4 py-2 text-sm font-medium text-foreground/80 bg-surface/30 rounded-lg border border-border/50">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => router.push(`?${createQueryString('page', String(currentPage + 1))}`)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg bg-surface/50 border border-border text-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface/80 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
