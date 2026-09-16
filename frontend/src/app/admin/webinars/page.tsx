'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

export default function AdminWebinarsPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [recordingSessionId, setRecordingSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-webinars', page],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/webinars', {
        params: { query: { page, pageSize: 20 } }
      });
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await apiFetch.POST('/admin/webinars', {
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Webinar created');
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-webinars'] });
    },
    onError: (error: any) => toast.error(error?.message || 'Failed to create')
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action, url }: { id: string, action: 'start' | 'end' | 'recording', url?: string }) => {
      if (action === 'start') {
        const { error } = await apiFetch.POST('/admin/webinars/{id}/start', { params: { path: { id } } });
        if (error) throw error;
      } else if (action === 'end') {
        const { error } = await apiFetch.POST('/admin/webinars/{id}/end', { params: { path: { id } } });
        if (error) throw error;
      } else if (action === 'recording' && url) {
        const { error } = await apiFetch.POST('/admin/webinars/{id}/recording', { 
          params: { path: { id } },
          body: { url }
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Action successful');
      setRecordingSessionId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-webinars'] });
    },
    onError: (error: any) => toast.error(error?.message || 'Action failed')
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      schedule: new Date(formData.get('schedule') as string).toISOString(),
      capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string, 10) : undefined,
    });
  };

  const handleRecordingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (recordingSessionId) {
      actionMutation.mutate({ id: recordingSessionId, action: 'recording', url: formData.get('url') as string });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Webinars</h1>
          <p className="mt-2 text-foreground/60">Manage public or gated large-scale events.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors"
        >
          Schedule Webinar
        </button>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Schedule Webinar</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Title</label>
                <input required name="title" type="text" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <textarea name="description" rows={3} className="w-full bg-background border border-border rounded p-2 text-foreground"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Schedule (Date & Time)</label>
                <input required name="schedule" type="datetime-local" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Capacity (Optional)</label>
                <input name="capacity" type="number" min="1" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded font-medium disabled:opacity-50">
                  {createMutation.isPending ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {recordingSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-md p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Attach Recording</h2>
            <form onSubmit={handleRecordingSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Video URL</label>
                <input required name="url" type="url" className="w-full bg-background border border-border rounded p-2 text-foreground" placeholder="https://..." />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setRecordingSessionId(null)} className="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button>
                <button type="submit" disabled={actionMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded font-medium disabled:opacity-50">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/60">
            <thead className="bg-surface/80/50 text-foreground/80 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground/40">Loading webinars...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground/40">No webinars found.</td></tr>
              ) : (
                data?.data?.map((webinar: any) => (
                  <tr key={webinar.id} className="hover:bg-surface/80/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{webinar.title}</td>
                    <td className="px-6 py-4">{new Date(webinar.schedule).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={webinar.status} /></td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {webinar.status === 'SCHEDULED' && (
                        <button 
                          onClick={() => actionMutation.mutate({ id: webinar.id, action: 'start' })}
                          className="text-primary hover:text-emerald-300 font-medium"
                        >
                          Start
                        </button>
                      )}
                      {webinar.status === 'IN_PROGRESS' && (
                        <button 
                          onClick={() => actionMutation.mutate({ id: webinar.id, action: 'end' })}
                          className="text-primary/80 hover:text-rose-300 font-medium"
                        >
                          End
                        </button>
                      )}
                      {webinar.status === 'COMPLETED' && !webinar.recordingUrl && (
                        <button 
                          onClick={() => setRecordingSessionId(webinar.id)}
                          className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Add Recording
                        </button>
                      )}
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
