'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuthStore } from '@/lib/store/auth.store';
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

  const { data: rolesData } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/roles');
      if (error) throw error;
      return (data as any)?.data || [];
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role, staffRoleId }: { userId: string, role: string, staffRoleId?: string }) => {
      const { data, error } = await apiFetch.PUT('/admin/users/{id}', {
        params: { path: { id: userId } },
        body: { role, staffRoleId } as any
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
    <RoleGuard allowedRoles={['ADMIN', 'SUPERADMIN', 'STAFF']}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Users</h1>
            <p className="mt-2 text-foreground/60">Manage learners, instructors, and admins.</p>
          </div>
          <button
            onClick={() => {
              const token = useAuthStore.getState().accessToken;
              window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/export/users?access_token=${token}`, '_blank');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-foreground font-medium rounded-lg transition-colors border border-border"
          >
            Export to Excel
          </button>
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
                      <td className="px-6 py-4 flex flex-col gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            updateRoleMutation.mutate({ userId: user.id, role: newRole });
                          }}
                          disabled={updateRoleMutation.isPending}
                          className="bg-background border border-border/80 text-foreground/80 text-xs rounded focus:ring-primary/50 focus:border-primary/50 block p-1.5 w-full"
                        >
                          <option value="LEARNER">Learner</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                          <option value="STAFF">Staff</option>
                        </select>

                        {user.role === 'STAFF' && rolesData && (
                          <select
                            value={user.staffRoleId || ''}
                            onChange={(e) => {
                              updateRoleMutation.mutate({ userId: user.id, role: 'STAFF', staffRoleId: e.target.value });
                            }}
                            disabled={updateRoleMutation.isPending}
                            className="bg-primary/5 border border-primary/30 text-primary text-xs rounded focus:ring-primary/50 focus:border-primary/50 block p-1.5 w-full mt-1"
                          >
                            <option value="" disabled>Select Staff Role</option>
                            {rolesData.map((r: any) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        )}
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
