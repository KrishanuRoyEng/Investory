'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

export default function AdminCourseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');
  const queryClient = useQueryClient();

  // For this demo, we'll fetch the public course endpoint using slug, but wait, we need the course by ID for admin.
  // The API doesn't have a GET /admin/courses/:id yet, but we can fetch all courses and find it,
  // or use the public slug endpoint if we know the slug. Let's just fetch all courses and filter since we have it cached.
  // Actually, wait, let's just fetch all admin courses and find it.
  
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['admin-courses', 1], // Simplified for demo assuming it's on page 1
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/courses', {
        params: { query: { page: 1, pageSize: 100 } }
      });
      if (error) throw error;
      return data;
    }
  });

  const course = coursesData?.data?.find((c: any) => c.id === params.id);

  // Fetch full curriculum via slug endpoint (even if drafted, it might 404, but we'll try)
  const { data: fullCourse } = useQuery({
    queryKey: ['course-curriculum', course?.slug],
    queryFn: async () => {
      if (!course?.slug) return null;
      const { data, error } = await apiFetch.GET('/courses/{slug}', {
        params: { path: { slug: course.slug } }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!course?.slug
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await apiFetch.PUT('/admin/courses/{id}', {
        params: { path: { id: params.id } },
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Course updated');
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update course');
    }
  });

  const addModuleMutation = useMutation({
    mutationFn: async (formData: { title: string, order: number }) => {
      const { data, error } = await apiFetch.POST('/admin/courses/{id}/modules', {
        params: { path: { id: params.id } },
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Module added');
      queryClient.invalidateQueries({ queryKey: ['course-curriculum'] });
    }
  });

  const addLessonMutation = useMutation({
    mutationFn: async ({ moduleId, formData }: { moduleId: string, formData: any }) => {
      const { data, error } = await apiFetch.POST('/admin/courses/modules/{moduleId}/lessons', {
        params: { path: { moduleId } },
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Lesson added');
      queryClient.invalidateQueries({ queryKey: ['course-curriculum'] });
    }
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      pricePaise: parseInt(formData.get('pricePaise') as string, 10) * 100,
      format: formData.get('format') as any,
      level: formData.get('level') as any,
      status: formData.get('status') as any,
    });
  };

  const handleAddModule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addModuleMutation.mutate({
      title: formData.get('title') as string,
      order: parseInt(formData.get('order') as string, 10)
    });
    e.currentTarget.reset();
  };

  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>, moduleId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addLessonMutation.mutate({
      moduleId,
      formData: {
        title: formData.get('title') as string,
        order: parseInt(formData.get('order') as string, 10),
        durationSec: parseInt(formData.get('durationSec') as string, 10),
        videoUrl: formData.get('videoUrl') as string
      }
    });
    e.currentTarget.reset();
  };

  if (isLoading) return <div className="p-8 text-foreground/60">Loading...</div>;
  if (!course) return <div className="p-8 text-red-400">Course not found.</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{course.title}</h1>
          <StatusBadge status={course.status} />
        </div>
        <p className="mt-2 text-foreground/60">Manage course details and curriculum.</p>
      </div>

      <div className="flex gap-4 border-b border-border mb-6">
        <button 
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-rose-500 text-primary/80' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('curriculum')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-rose-500 text-primary/80' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
        >
          Curriculum
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="bg-surface border border-border rounded-md p-6 max-w-3xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground/80">Title</label>
              <input required name="title" defaultValue={course.title} type="text" className="w-full bg-background border border-border rounded p-2 text-foreground" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground/80">Description</label>
              <textarea required name="description" defaultValue={course.description} rows={4} className="w-full bg-background border border-border rounded p-2 text-foreground"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Price (₹)</label>
                <input required name="pricePaise" defaultValue={course.pricePaise / 100} type="number" min="0" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Status</label>
                <select name="status" defaultValue={course.status} className="w-full bg-background border border-border rounded p-2 text-foreground">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Format</label>
                <select name="format" defaultValue={course.format} className="w-full bg-background border border-border rounded p-2 text-foreground">
                  <option value="SELF_PACED">Self Paced</option>
                  <option value="LIVE">Live</option>
                  <option value="BUNDLE">Bundle</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80">Level</label>
                <select name="level" defaultValue={course.level} className="w-full bg-background border border-border rounded p-2 text-foreground">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={updateMutation.isPending} className="px-6 py-2 bg-primary/90 hover:bg-primary text-foreground rounded font-medium disabled:opacity-50">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div className="space-y-6 max-w-4xl">
          {fullCourse?.data?.modules?.map((mod: any) => (
            <div key={mod.id} className="bg-surface border border-border rounded-md overflow-hidden">
              <div className="bg-surface/80/50 px-6 py-4 flex justify-between items-center border-b border-border">
                <h3 className="font-semibold text-foreground">Module {mod.order}: {mod.title}</h3>
              </div>
              <div className="p-6">
                {mod.lessons?.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {mod.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex justify-between items-center p-3 bg-background border border-border rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{lesson.order}. {lesson.title}</span>
                          <span className="text-xs text-foreground/40">{Math.floor(lesson.durationSec / 60)}m {lesson.durationSec % 60}s</span>
                        </div>
                        <button className="text-foreground/40 hover:text-foreground text-sm">Edit</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/40 mb-6">No lessons in this module yet.</p>
                )}

                <div className="mt-4 pt-4 border-t border-border border-dashed">
                  <h4 className="text-sm font-medium text-foreground/60 mb-3">Add Lesson</h4>
                  <form onSubmit={(e) => handleAddLesson(e, mod.id)} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <input required name="title" placeholder="Lesson Title" type="text" className="w-full bg-background border border-border rounded p-2 text-sm text-foreground" />
                    </div>
                    <div className="w-20">
                      <input required name="order" placeholder="Order" type="number" min="1" className="w-full bg-background border border-border rounded p-2 text-sm text-foreground" />
                    </div>
                    <div className="w-24">
                      <input required name="durationSec" placeholder="Secs" type="number" min="1" className="w-full bg-background border border-border rounded p-2 text-sm text-foreground" />
                    </div>
                    <div className="flex-1">
                      <input required name="videoUrl" placeholder="Video URL" type="url" className="w-full bg-background border border-border rounded p-2 text-sm text-foreground" />
                    </div>
                    <button type="submit" disabled={addLessonMutation.isPending} className="px-4 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded text-sm font-medium">
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-surface border border-border border-dashed rounded-md p-6">
            <h3 className="font-semibold text-foreground mb-4">Add New Module</h3>
            <form onSubmit={handleAddModule} className="flex gap-3">
              <div className="flex-1">
                <input required name="title" placeholder="Module Title" type="text" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <div className="w-24">
                <input required name="order" placeholder="Order" type="number" min="1" className="w-full bg-background border border-border rounded p-2 text-foreground" />
              </div>
              <button type="submit" disabled={addModuleMutation.isPending} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded font-medium">
                Add Module
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
