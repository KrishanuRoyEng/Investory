import { RoleGuard } from '@/components/layouts/RoleGuard';
import { DashboardSidebar } from '@/components/layouts/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground/80">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
