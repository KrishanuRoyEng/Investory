'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import Link from 'next/link';

export default function DashboardCoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/dashboard/courses');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Courses</h1>
        <p className="mt-2 text-foreground/60">Continue where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-foreground/60">Loading courses...</div>
        ) : data?.data?.length === 0 ? (
          <div className="col-span-full bg-surface border border-border border-dashed rounded-md p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No Courses Yet</h3>
            <p className="text-foreground/60 mb-6">You haven't enrolled in any courses. Browse our catalogue to start learning.</p>
            <Link href="/courses" className="px-6 py-3 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors">
              Explore Courses
            </Link>
          </div>
        ) : (
          data?.data?.map((enrollment: any) => (
            <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`} className="block group">
              <div className="bg-surface border border-border rounded-md p-6 hover:border-border/80 transition-colors h-full flex flex-col">
                {enrollment.course.thumbnailUrl && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-surface/80">
                    <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                {!enrollment.course.thumbnailUrl && (
                  <div className="aspect-video w-full rounded-lg mb-4 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <span className="text-slate-600 font-medium">StockLearn</span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary/80 transition-colors">{enrollment.course.title}</h3>
                <div className="mt-2 text-sm text-foreground/40 line-clamp-2 mb-6">
                  {enrollment.course.description}
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground/80">Progress</span>
                    <span className="text-primary/80">{enrollment.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-surface/80 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${enrollment.progressPercent}%` }}></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm text-foreground/40">
                    <span>Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
