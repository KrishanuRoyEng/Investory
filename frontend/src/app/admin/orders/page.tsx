'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RoleGuard } from '@/components/layouts/RoleGuard';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/admin/orders', {
        params: { query: { page, pageSize: 20 } }
      });
      if (error) throw error;
      return data;
    }
  });

  const refundMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await apiFetch.POST('/admin/orders/{id}/refund', {
        params: { path: { id: orderId } }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Refund processed successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to process refund');
    }
  });

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Orders</h1>
            <p className="mt-2 text-foreground/60">View transactions and manage refunds.</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground/60">
              <thead className="bg-surface/80/50 text-foreground/80 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-foreground/40">Loading orders...</td>
                  </tr>
                ) : data?.data?.orders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-foreground/40">No orders found.</td>
                  </tr>
                ) : (
                  data?.data?.orders?.map((order: any) => (
                    <tr key={order.id} className="hover:bg-surface/80/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-foreground/40">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{order.user.name}</div>
                        <div className="text-xs">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-primary">₹{(order.totalPaise / 100).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === 'COMPLETED' ? (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to refund this order?')) {
                                refundMutation.mutate(order.id);
                              }
                            }}
                            disabled={refundMutation.isPending}
                            className="text-amber-500 hover:text-amber-400 font-medium text-sm disabled:opacity-50"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="text-slate-600 text-sm italic">Not refundable</span>
                        )}
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
    </RoleGuard>
  );
}
