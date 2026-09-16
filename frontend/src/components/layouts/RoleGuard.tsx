'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, Role } from '@/lib/store/auth.store';
import { apiFetch } from '@/lib/api/client';

export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const { status, user, setAuth, setStatus, clearAuth } = useAuthStore();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    
    // Bootstrap: Try to refresh token if we are starting fresh
    if (status === 'idle') {
      hasBootstrapped.current = true;
      setStatus('loading');
      
      apiFetch.POST('/auth/refresh')
        .then(({ data, error }) => {
          if (data?.data?.accessToken && data?.data?.user) {
            // @ts-ignore - mapping backend user role to frontend role
            setAuth(data.data.accessToken, data.data.user);
          } else {
            clearAuth();
            router.replace('/login');
          }
        })
        .catch(() => {
          clearAuth();
          router.replace('/login');
        });
    }
  }, [status, setStatus, setAuth, clearAuth, router]);

  useEffect(() => {
    // If we are already bootstrapped but unauthenticated (e.g. token expired and refresh failed)
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 text-foreground">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
