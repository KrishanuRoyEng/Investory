'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { AgoraPlayer } from '@/components/video/AgoraPlayer';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/layouts/SiteHeader';

export default function WebinarDetailPage({ params }: { params: { id: string } }) {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const ticketId = searchParams?.get('ticketId');
  const [joined, setJoined] = useState(false);
  
  // Fetch details (public)
  const { data: detailsData, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['webinar-details', params.id],
    queryFn: async () => {
      // In a real app this would have a public detail endpoint.
      // We'll just fetch all and find it, or use the join data to get details if possible.
      // For this demo, let's just attempt to fetch join directly if we have a ticket or are logged in.
      // If not logged in and no ticket, we render a prompt to register/login.
      return { id: params.id, title: "Webinar" };
    }
  });

  const { data: joinData, isLoading: isJoinLoading, error: joinError, refetch: joinRefetch } = useQuery({
    queryKey: ['webinar-join', params.id, ticketId],
    queryFn: async () => {
      let data, error;
      if (ticketId) {
        // Guest join path via ticketId
        const res = await apiFetch.GET('/webinars/{id}/join', {
          params: { path: { id: params.id }, query: { ticketId } }
        });
        data = res.data;
        error = res.error;
      } else if (user) {
        // Authenticated learner join path
        const res = await apiFetch.GET('/webinars/{id}/join', {
          params: { path: { id: params.id } }
        });
        data = res.data;
        error = res.error;
      } else {
        throw new Error('Not authenticated and no ticket provided.');
      }
      
      if (error) throw error;
      return data;
    },
    enabled: joined && (!!ticketId || !!user),
    retry: false
  });

  const handleJoinClick = () => {
    setJoined(true);
  };

  const role = user?.role === 'INSTRUCTOR' ? 'host' : 'audience';
  const { appId, channel, rtcToken, uid } = joinData?.data || {};

  return (
    <div className="min-h-screen bg-background text-foreground/80 flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/webinars" className="text-foreground/60 hover:text-foreground transition-colors">
            ← Back to Webinars
          </Link>
          {joined && joinData?.data && (
            <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary/80 rounded-full border border-rose-500/20">
              {role === 'host' ? 'Hosting' : 'Viewing'} {ticketId ? 'as Guest' : `as ${user?.name}`}
            </div>
          )}
        </div>

        {!joined ? (
          <div className="bg-surface border border-border rounded-md p-8 max-w-2xl mx-auto text-center mt-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Join Webinar</h1>
            <p className="text-foreground/60 mb-8">
              {ticketId 
                ? "You have a valid guest ticket. Click below to enter the webinar."
                : user 
                  ? "You are signed in. Click below to join the webinar."
                  : "Please sign in to join, or use the guest link provided in your email."}
            </p>
            
            {(ticketId || user) ? (
              <button 
                onClick={handleJoinClick}
                className="px-8 py-3 bg-primary/90 hover:bg-primary text-foreground font-bold rounded-lg transition-colors text-lg"
              >
                Enter Webinar
              </button>
            ) : (
              <Link 
                href={`/login?redirect=/webinars/${params.id}`}
                className="inline-block px-8 py-3 bg-surface/80 hover:bg-slate-700 text-foreground font-bold rounded-lg transition-colors text-lg"
              >
                Sign In to Join
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {isJoinLoading ? (
                <div className="aspect-video bg-surface rounded-md flex items-center justify-center border border-border">
                  <div className="text-foreground/60 flex flex-col items-center">
                    <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    Loading session details...
                  </div>
                </div>
              ) : joinError ? (
                <div className="aspect-video bg-surface rounded-md flex items-center justify-center border border-border p-8 text-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Could not join</h3>
                    <p className="text-foreground/60">
                      {(joinError as any)?.message || "The session might not be active yet, or your access was denied."}
                    </p>
                    <button 
                      onClick={() => setJoined(false)}
                      className="mt-4 px-4 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              ) : appId && channel && rtcToken && uid ? (
                <AgoraPlayer 
                  appId={appId} 
                  channel={channel} 
                  token={rtcToken} 
                  uid={uid} 
                  role={role} 
                />
              ) : (
                <div className="aspect-video bg-surface rounded-md flex items-center justify-center border border-border">
                  <span className="text-foreground/40">Missing connection details</span>
                </div>
              )}
            </div>

            <div className="bg-surface border border-border rounded-md flex flex-col h-[calc(100vh-12rem)] min-h-[400px]">
              <div className="p-4 border-b border-border font-medium text-foreground flex justify-between items-center">
                <span>Q&A / Doubts</span>
                <span className="text-xs px-2 py-1 bg-surface/80 rounded text-foreground/60">Webinar</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
                <div className="text-center text-sm text-foreground/40 italic pb-4">
                  Ask questions here. The speakers will see them.
                </div>
                {/* Doubts list would map here */}
              </div>

              <div className="p-4 border-t border-border">
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); /* Mock submit */ }}>
                  <input 
                    type="text" 
                    placeholder="Ask a question..." 
                    className="flex-1 bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    disabled={!joinData}
                  />
                  <button 
                    type="submit" 
                    disabled={!joinData}
                    className="px-4 py-2 bg-primary/90 hover:bg-primary text-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
