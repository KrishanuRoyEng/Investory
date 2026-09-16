'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DashboardOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: async () => {
      const { data, error } = await apiFetch.GET('/dashboard/orders');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Order History</h1>
        <p className="mt-2 text-foreground/60">View your past purchases and invoices.</p>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground/60">
            <thead className="bg-surface/80/50 text-foreground/80 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/40">Loading orders...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/40">No orders found.</td></tr>
              ) : (
                data?.data?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-surface/80/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground/40">{order.id}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-primary">₹{(order.totalPaise / 100).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {order.invoiceUrl ? (
                        <a 
                          href={order.invoiceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary/80 hover:text-rose-300 font-medium"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">N/A</span>
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
