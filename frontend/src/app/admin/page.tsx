'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';

export default function AdminOverviewPage() {
  const user = useAuthStore((state) => state.user);

  // We could fetch actual analytics here, but since the backend doesn't have a 
  // dedicated dashboard stats endpoint yet, we'll render a welcome screen.
  // We can fetch recent courses or sessions as a quick overview.
  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses', 1],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/courses', {
        params: { query: { page: 1, pageSize: 5 } }
      });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-foreground/60">Here's what's happening on StockLearn today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-md p-6">
          <h3 className="text-sm font-medium text-foreground/60">Total Courses</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">{coursesData?.meta?.total || 0}</p>
        </div>
        {/* Placeholder cards for other stats */}
        <div className="bg-surface border border-border rounded-md p-6">
          <h3 className="text-sm font-medium text-foreground/60">Active Learners</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">--</p>
        </div>
        <div className="bg-surface border border-border rounded-md p-6">
          <h3 className="text-sm font-medium text-foreground/60">Today's Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">--</p>
        </div>
        <div className="bg-surface border border-border rounded-md p-6">
          <h3 className="text-sm font-medium text-foreground/60">Upcoming Sessions</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">--</p>
        </div>
      </div>
    </div>
  );
}
