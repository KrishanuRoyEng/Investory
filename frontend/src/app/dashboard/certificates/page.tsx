'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardCertificatesPage() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [downloading, setDownloading] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-certificates'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/dashboard/certificates');
      if (error) throw error;
      return data;
    }
  });

  const handleDownload = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.info('Certificate is being generated. Please check back later.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Certificates</h1>
        <p className="mt-2 text-foreground/60">View and download your earned certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-foreground/60">Loading certificates...</div>
        ) : data?.data?.length === 0 ? (
          <div className="col-span-full bg-surface border border-border border-dashed rounded-md p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No Certificates Yet</h3>
            <p className="text-foreground/60 mb-6">Complete courses to earn certificates.</p>
            <Link href="/dashboard/courses" className="px-6 py-3 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors">
              Go to My Courses
            </Link>
          </div>
        ) : (
          data?.data?.map((cert: any) => (
            <div key={cert.id} className="bg-surface border border-border rounded-md p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{cert.course.title}</h3>
              <p className="text-sm text-foreground/60 mb-4">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
              
              <button 
                onClick={() => handleDownload(cert.url)}
                disabled={!cert.url}
                className="mt-auto px-4 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded font-medium transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {!cert.url ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {!cert.url ? 'Generating...' : 'View PDF'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
