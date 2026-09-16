'use client';

import Link from 'next/link';

export default function DashboardDoubtsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Doubts</h1>
        <p className="mt-2 text-foreground/60">Questions you've asked during live sessions.</p>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface/80 mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Doubt tracking coming soon</h3>
          <p className="text-foreground/60 mb-6">
            Currently, you can view and submit your doubts directly within the details page of any active Live Class or Webinar.
          </p>
          <Link href="/dashboard/sessions" className="px-6 py-2 bg-surface/80 hover:bg-slate-700 text-foreground font-medium rounded-lg transition-colors">
            Go to My Sessions
          </Link>
        </div>
      </div>
    </div>
  );
}
