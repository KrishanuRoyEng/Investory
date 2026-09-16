'use client';

import { useAuthStore } from '@/lib/store/auth.store';

export default function DashboardProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Profile Settings</h1>
        <p className="mt-2 text-foreground/60">Manage your account details and security.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-surface border border-border rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/60 mb-1">Full Name</label>
              <div className="p-3 bg-background border border-border rounded-md text-foreground">
                {user?.name || 'StockLearn User'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/60 mb-1">Email Address</label>
              <div className="p-3 bg-background border border-border rounded-md text-foreground">
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/60 mb-1">Account Role</label>
              <div className="p-3 bg-background border border-border rounded-md text-foreground/60 font-mono text-sm">
                {user?.role}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button disabled className="px-4 py-2 bg-surface/80 text-foreground/40 rounded font-medium cursor-not-allowed">
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-md p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
          <p className="text-sm text-foreground/60 mb-4">
            If you need to change your password, please use the forgot password flow on the login page for now.
          </p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.assign('/login?forgot=true');
              }
            }}
            className="px-4 py-2 bg-surface/80 hover:bg-slate-700 text-foreground rounded font-medium transition-colors"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
