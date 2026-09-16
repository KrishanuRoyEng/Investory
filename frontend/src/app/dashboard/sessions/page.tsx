'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DashboardSessionsPage() {
  const { data, isLoading } = useQuery({
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
        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Sessions</h1>
        <p className="mt-2 text-foreground/60">Your upcoming and past live classes and webinars.</p>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/60">
            <thead className="bg-surface/80/50 text-foreground/80 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/40">Loading sessions...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/40">No registered sessions.</td></tr>
              ) : (
                data?.data?.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-surface/80/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{reg.liveSession.title}</td>
                    <td className="px-6 py-4">{reg.liveSession.type}</td>
                    <td className="px-6 py-4">{new Date(reg.liveSession.schedule).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={reg.liveSession.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={reg.liveSession.type === 'CLASS' ? `/live/${reg.liveSession.id}` : `/webinars/${reg.liveSession.id}`}
                        className="text-primary/80 hover:text-rose-300 font-medium"
                      >
                        {reg.liveSession.status === 'COMPLETED' ? 'View Details' : 'Join / Details'}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
