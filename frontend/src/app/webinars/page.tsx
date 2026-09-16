'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SiteHeader } from '@/components/layouts/SiteHeader';

export default function PublicWebinarsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-webinars'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/webinars');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground/80 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">Live Webinars</h1>
          <p className="mt-4 max-w-2xl text-xl text-foreground/60">
            Join industry experts for large-scale interactive sessions and market insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-foreground/60">Loading upcoming webinars...</div>
          ) : data?.data?.length === 0 ? (
            <div className="col-span-full bg-surface border border-border rounded-md p-12 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">No Scheduled Webinars</h3>
              <p className="text-foreground/60">Check back later for new events.</p>
            </div>
          ) : (
            data?.data?.map((webinar: any) => (
              <div key={webinar.id} className="bg-surface border border-border rounded-md p-6 flex flex-col hover:border-border/80 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-foreground">{webinar.title}</h3>
                  <StatusBadge status={webinar.status} />
                </div>
                {webinar.description && (
                  <p className="text-sm text-foreground/60 mb-6 line-clamp-3">
                    {webinar.description}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-border space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/40">Schedule</span>
                    <span className="text-foreground/80 font-medium">{new Date(webinar.schedule).toLocaleString()}</span>
                  </div>
                  <Link 
                    href={`/webinars/${webinar.id}`}
                    className="block w-full text-center px-4 py-2 bg-primary/90 hover:bg-primary text-foreground rounded-lg font-medium transition-colors"
                  >
                    {webinar.status === 'COMPLETED' ? 'View Details' : 'Join / Register'}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
