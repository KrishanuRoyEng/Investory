'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DashboardOverviewPage() {
  const user = useAuthStore((state) => state.user);

  const { data: coursesData } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/dashboard/courses');
      if (error) throw error;
      return data;
    }
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['dashboard-sessions'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/dashboard/sessions');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-foreground/60">Here's your learning overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Courses */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Your Courses</h2>
              <Link href="/dashboard/courses" className="text-sm text-primary/80 hover:text-rose-300">View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coursesData?.data?.slice(0, 4).map((enrollment: any) => (
                <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`} className="block group">
                  <div className="bg-surface border border-border rounded-md p-5 hover:border-border/80 transition-colors h-full flex flex-col">
                    <h3 className="font-semibold text-foreground group-hover:text-primary/80 transition-colors">{enrollment.course.title}</h3>
                    <div className="mt-2 text-sm text-foreground/40 line-clamp-2 mb-4">
                      {enrollment.course.description}
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs text-foreground/60 mb-1">
                        <span>Progress</span>
                        <span>{enrollment.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-surface/80 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${enrollment.progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {(!coursesData?.data || coursesData.data.length === 0) && (
                <div className="col-span-2 bg-surface border border-border border-dashed rounded-md p-8 text-center">
                  <p className="text-foreground/60">You haven't enrolled in any courses yet.</p>
                  <Link href="/courses" className="inline-block mt-4 px-4 py-2 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors">
                    Browse Catalogue
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Upcoming Sessions */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Upcoming Sessions</h2>
              <Link href="/dashboard/sessions" className="text-sm text-primary/80 hover:text-rose-300">View all</Link>
            </div>
            <div className="bg-surface border border-border rounded-md overflow-hidden divide-y divide-slate-800">
              {sessionsData?.data?.slice(0, 3).map((reg: any) => (
                <div key={reg.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-foreground">{reg.title}</h3>
                    <StatusBadge status={reg.status} />
                  </div>
                  <div className="text-sm text-foreground/60 mb-3">
                    {new Date(reg.schedule).toLocaleString()}
                  </div>
                  <Link 
                    href={reg.type === 'CLASS' ? `/live/${reg.id}` : `/webinars/${reg.id}`}
                    className="block w-full text-center px-4 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
              {(!sessionsData?.data || sessionsData.data.length === 0) && (
                <div className="p-6 text-center text-foreground/60 text-sm">
                  No upcoming sessions.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
