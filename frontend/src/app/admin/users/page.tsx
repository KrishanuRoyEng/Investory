'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/users', {
        params: { query: { page, pageSize: 20 } }
      });
      if (error) throw error;
      return data;
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN' }) => {
      const { data, error } = await apiFetch.PUT('/admin/users/{id}', {
        params: { path: { id: userId } },
        body: { role }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update role: ${error?.message || 'Unknown error'}`);
    }
  });

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Users</h1>
            <p className="mt-2 text-foreground/60">Manage learners, instructors, and admins.</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/60">
              <thead className="bg-surface/80/50 text-foreground/80 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-foreground/40">
                      Loading users...
                    </td>
                  </tr>
                ) : data?.data?.users?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-foreground/40">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  data?.data?.users?.map((user) => (
                    <tr key={user.id} className="hover:bg-surface/80/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateRoleMutation.mutate({ userId: user.id, role: e.target.value as any })}
                          disabled={updateRoleMutation.isPending}
                          className="bg-background border border-border/80 text-foreground/80 text-xs rounded focus:ring-rose-500 focus:border-rose-500 block p-1.5"
                        >
                          <option value="LEARNER">Learner</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {data?.meta && data.meta.total > data.meta.pageSize && (
            <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-surface/50">
              <span className="text-sm text-foreground/60">
                Showing page {data.meta.page}
              </span>
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
    </RoleGuard>
  );
}
