'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      // Assuming a GET /admin/coupons endpoint exists, if not we'll render empty or what we can
      const { data, error } = await apiFetch.GET('/admin/coupons' as any); // Type cast for now as backend might lack this list endpoint
      if (error) throw error;
      return data;
    },
    // The backend might not have this endpoint implemented in the OpenAPI spec, so we will fail gracefully
    retry: false
  });

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await apiFetch.POST('/admin/coupons', {
        body: formData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Coupon created successfully');
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create coupon');
    }
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const discountType = formData.get('discountType') as string;
    const rawVal = parseInt(formData.get('discountVal') as string, 10);
    const discountVal = discountType === 'PERCENTAGE' ? rawVal : rawVal * 100; // convert flat amount to paise

    createMutation.mutate({
      code: formData.get('code') as string,
      discountType: discountType as any,
      discountVal,
      validUntil: formData.get('validUntil') ? new Date(formData.get('validUntil') as string).toISOString() : null,
      courseId: formData.get('courseId') as string || undefined,
    });
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Coupons</h1>
            <p className="mt-2 text-foreground/60">Manage discount codes and promotions.</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-primary/90 hover:bg-primary text-foreground font-medium rounded-lg transition-colors"
          >
            Create Coupon
          </button>
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface border border-border rounded-md p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Create New Coupon</h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Code</label>
                  <input required name="code" type="text" className="w-full bg-background border border-border rounded p-2 text-foreground uppercase" placeholder="SUMMER20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground/80">Type</label>
                    <select name="discountType" className="w-full bg-background border border-border rounded p-2 text-foreground">
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground/80">Value</label>
                    <input required name="discountVal" type="number" min="1" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Valid Until</label>
                  <input name="validUntil" type="datetime-local" className="w-full bg-background border border-border rounded p-2 text-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80">Specific Course ID (Optional)</label>
                  <input name="courseId" type="text" className="w-full bg-background border border-border rounded p-2 text-foreground" placeholder="Leave empty for all courses" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded font-medium disabled:opacity-50">
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="p-8 text-center text-foreground/60">
            {isLoading ? 'Loading coupons...' : 'Coupon listing view is not fully implemented in this demo.'}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
