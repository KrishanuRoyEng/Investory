import { RoleGuard } from '@/components/layouts/RoleGuard';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground/80">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
