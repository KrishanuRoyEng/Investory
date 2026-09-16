'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses', page],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/courses', {
        params: { query: { page, pageSize: 20 } }
      });
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await apiFetch.POST('/admin/courses', {
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Course created successfully');
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create course');
    }
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      pricePaise: parseInt(formData.get('pricePaise') as string, 10) * 100, // convert ₹ to paise
      format: formData.get('format') as any,
      level: formData.get('level') as any,
      language: formData.get('language') as string,
      status: formData.get('status') as any,
      thumbnailUrl: formData.get('thumbnailUrl') as string || undefined,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Courses</h1>
          <p className="mt-2 text-foreground/60">Manage the course catalogue.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors"
        >
          Create Course
        </button>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Create New Course</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Title</label>
                  <input required name="title" type="text" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Slug</label>
                  <input required name="slug" type="text" pattern="^[a-z0-9-]+$" title="Lowercase, numbers, hyphens" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <textarea required name="description" rows={3} className="w-full bg-background border border-border rounded p-2 text-foreground"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Price (₹)</label>
                  <input required name="pricePaise" type="number" min="0" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Format</label>
                  <select name="format" className="w-full bg-background border border-border rounded p-2 text-foreground">
                    <option value="SELF_PACED">Self Paced</option>
                    <option value="LIVE">Live</option>
                    <option value="BUNDLE">Bundle</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Level</label>
                  <select name="level" className="w-full bg-background border border-border rounded p-2 text-foreground">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Language</label>
                  <input required name="language" type="text" defaultValue="English" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Status</label>
                  <select name="status" className="w-full bg-background border border-border rounded p-2 text-foreground">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Thumbnail URL</label>
                  <input name="thumbnailUrl" type="url" className="w-full bg-background border border-border rounded p-2 text-foreground" placeholder="https://..." />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded font-medium disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Create Course'}
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
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/40">Loading courses...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/40">No courses found.</td>
                </tr>
              ) : (
                data?.data?.map((course: any) => (
                  <tr key={course.id} className="hover:bg-surface/80/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{course.title}</div>
                      <div className="text-xs text-foreground/40 mt-1">{course.slug}</div>
                    </td>
                    <td className="px-6 py-4">{course.format.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-medium text-primary">₹{(course.pricePaise / 100).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/courses/${course.id}`}
                        className="text-primary/80 hover:text-rose-300 font-medium text-sm"
                      >
                        Edit / Curriculum
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.meta && data.meta.total > data.meta.pageSize && (
          <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-surface/50">
            <span className="text-sm text-foreground/60">Showing page {data.meta.page}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-surface/80 text-foreground/80 rounded hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * data.meta.pageSize >= data.meta.total}
                className="px-3 py-1 bg-surface/80 text-foreground/80 rounded hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
