'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { AgoraPlayer } from '@/components/video/AgoraPlayer';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';

export default function LiveClassPage({ params }: { params: { id: string } }) {
  const user = useAuthStore((state) => state.user);
  
  const { data: joinData, isLoading: isJoinLoading, error: joinError } = useQuery({
    queryKey: ['live-class-join', params.id],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/live-sessions/{id}/join', {
        params: { path: { id: params.id } }
      });
      if (error) throw error;
      return data;
    },
    retry: false
  });

  if (isJoinLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground/60">Loading session...</div>
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background p-8">
        <div className="bg-surface border border-border p-8 rounded-md max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-foreground/60 mb-6">
            {(joinError as any)?.message || "You cannot join this session right now. Ensure you are enrolled and the session is within its active time window."}
          </p>
          <Link href="/dashboard" className="px-6 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded font-medium transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const role = user?.role === 'INSTRUCTOR' ? 'host' : 'audience';
  const { appId, channel, rtcToken, uid } = joinData?.data || {};

  return (
    <div className="min-h-screen bg-background text-foreground/80 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard/sessions" className="text-foreground/60 hover:text-foreground transition-colors">
            ← Back to Sessions
          </Link>
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary/80 rounded-full border border-rose-500/20">
            {role === 'host' ? 'Hosting' : 'Viewing'} as {user?.name}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {appId && channel && rtcToken && uid ? (
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
              <span className="text-xs px-2 py-1 bg-surface/80 rounded text-foreground/60">Live</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
              <div className="text-center text-sm text-foreground/40 italic pb-4">
                Ask questions here. The instructor will see them.
              </div>
              {/* Doubts list would map here */}
            </div>

            <div className="p-4 border-t border-border">
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); /* Mock submit */ }}>
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  className="flex-1 bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                />
                <button type="submit" className="px-4 py-2 bg-primary/90 hover:bg-primary text-foreground rounded-lg text-sm font-medium transition-colors">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
