'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Shield, X, Check } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  'manage_users',
  'manage_courses',
  'manage_payments',
  'manage_schedules',
  'manage_roles',
  'view_analytics'
];

export default function AdminRolesPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', permissions: [] as string[] });

  const { data: roles, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/roles');
      if (error) throw error;
      return (data as any)?.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; permissions: string[] }) => {
      const { data, error } = await apiFetch.POST('/admin/roles', { body: payload });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Role created successfully');
      setIsCreating(false);
      setFormData({ name: '', permissions: [] });
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to create role')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { name: string; permissions: string[] } }) => {
      const { data, error } = await apiFetch.PUT('/admin/roles/{id}', {
        params: { path: { id } },
        body: payload
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Role updated successfully');
      setIsEditing(null);
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update role')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await apiFetch.DELETE('/admin/roles/{id}', {
        params: { path: { id } }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to delete role')
  });

  const handleSave = () => {
    if (!formData.name.trim()) return toast.error('Role name is required');
    if (isEditing) {
      updateMutation.mutate({ id: isEditing, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'STAFF']}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" /> Roles & Permissions
            </h1>
            <p className="mt-2 text-foreground/60">Manage staff roles and their access levels.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const token = useAuthStore.getState().accessToken;
                window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/export/roles?access_token=${token}`, '_blank');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-foreground font-medium rounded-lg transition-colors border border-border"
            >
              Export to Excel
            </button>
            <button
              onClick={() => { setIsCreating(true); setFormData({ name: '', permissions: [] }); setIsEditing(null); }}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Role
            </button>
          </div>
        </div>

        {(isCreating || isEditing) && (
          <div className="bg-surface border border-primary/20 rounded-lg p-6 mb-8 shadow-lg shadow-primary/5">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Role' : 'Create New Role'}</h2>
              <button onClick={() => { setIsCreating(false); setIsEditing(null); }} className="p-1 hover:bg-surface-elevated rounded">
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full md:w-1/2 bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="e.g. Content Manager"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label key={perm} onClick={() => togglePermission(perm)} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(perm) ? 'bg-primary border-primary' : 'border-foreground/30'}`}>
                        {formData.permissions.includes(perm) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{perm.replace('manage_', 'Manage ').replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Create Role'}
                </button>
                <button
                  onClick={() => { setIsCreating(false); setIsEditing(null); }}
                  className="px-6 py-2 border border-border text-foreground/80 rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-foreground/40">Loading roles...</div>
          ) : roles?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-foreground/40 bg-surface rounded-lg border border-border">
              No custom roles created yet.
            </div>
          ) : (
            roles?.map((role: any) => (
              <div key={role.id} className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col hover:border-primary/30 transition-colors group">
                <div className="p-5 border-b border-border/50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{role.name}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{role._count?.users || 0} users assigned</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setFormData({ name: role.name, permissions: role.permissions });
                        setIsEditing(role.id);
                        setIsCreating(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-1.5 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the ${role.name} role?`)) {
                          deleteMutation.mutate(role.id);
                        }
                      }}
                      disabled={role._count?.users > 0}
                      className="p-1.5 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/60"
                      title={role._count?.users > 0 ? "Cannot delete role with assigned users" : "Delete role"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 bg-surface-elevated/30">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm: string) => (
                      <span key={perm} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                        {perm.replace('manage_', '').replace('_', ' ')}
                      </span>
                    ))}
                    {role.permissions.length === 0 && (
                      <span className="text-xs text-foreground/40 italic">No permissions</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
