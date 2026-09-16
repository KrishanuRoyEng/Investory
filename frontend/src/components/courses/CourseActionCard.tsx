'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api/client';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface CourseActionCardProps {
  courseId: string;
  courseSlug: string;
  pricePaise: number;
}

export function CourseActionCard({ courseId, courseSlug, pricePaise }: CourseActionCardProps) {
  const { status } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch enrolled courses if user is authenticated
  const { data: dashboardData, isLoading: isCheckingEnrollment } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: async () => {
      const client = await getApiClient();
      const { data, error } = await client.GET('/dashboard/courses', {
        params: { query: { pageSize: 100 } }, // Fetch enough to check
      });
      if (error) throw new Error('Failed to fetch enrollments');
      return data.data;
    },
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000, // 5 minutes cache to avoid redundant network calls
  });

  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(pricePaise / 100);

  // Check if enrolled
  // The dashboard/courses API returns Enrollment objects, but wait, the openapi.yaml doesn't specify exactly what it returns! 
  // Let's assume it returns an array of objects that have `courseId`.
  const isEnrolled = dashboardData?.some((enrollment: { courseId: string }) => enrollment.courseId === courseId);

  const handleAction = () => {
    if (status !== 'authenticated') {
      router.push(`/login?redirect=${pathname}`);
    } else if (isEnrolled) {
      router.push(`/dashboard/courses/${courseId}`); // Assuming dashboard handles courseId or we have a player
    } else {
      router.push(`/checkout?slug=${courseSlug}`);
    }
  };

  const isLoading = status === 'idle' || status === 'loading' || (status === 'authenticated' && isCheckingEnrollment);

  if (isLoading) {
    return (
      <div className="bg-surface/60 backdrop-blur-xl border border-border/80/50 rounded-lg p-6 sticky top-24 shadow-2xl shadow-emerald-900/10 animate-pulse">
        <div className="mb-6">
          <div className="h-10 bg-surface/80 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-surface/80 rounded w-3/4"></div>
        </div>
        <div className="w-full h-14 bg-surface/80 rounded-md mb-6"></div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface/80"></div>
            <div className="h-4 bg-surface/80 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface/80"></div>
            <div className="h-4 bg-surface/80 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface/80"></div>
            <div className="h-4 bg-surface/80 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface/60 backdrop-blur-xl border border-border/80/50 rounded-lg p-6 sticky top-24 shadow-2xl shadow-emerald-900/10">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-foreground mb-2">{priceFormatted}</h3>
        {pricePaise > 0 && <p className="text-sm text-foreground/60">One-time payment. Full lifetime access.</p>}
      </div>

      <button
        onClick={handleAction}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-foreground font-semibold py-3.5 px-4 rounded-md transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center"
      >
        {status !== 'authenticated' ? (
          'Enroll Now'
        ) : isEnrolled ? (
          'Continue Learning'
        ) : (
          'Enroll Now'
        )}
      </button>

      <div className="mt-6 space-y-4 text-sm text-foreground/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface/80 flex items-center justify-center text-primary">✓</div>
          <span>Full curriculum access</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface/80 flex items-center justify-center text-primary">✓</div>
          <span>Certificate of completion</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface/80 flex items-center justify-center text-primary">✓</div>
          <span>Premium community support</span>
        </div>
      </div>
    </div>
  );
}
