'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const { user, status } = useAuthStore();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-2xl border border-border bg-background/60 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Invest<span className="text-primary">ory</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Link 
              href="/courses" 
              className={`px-3 py-2 rounded-md transition-colors ${pathname?.startsWith('/courses') ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'}`}
            >
              Courses
            </Link>
            <Link 
              href="/webinars" 
              className={`px-3 py-2 rounded-md transition-colors ${pathname?.startsWith('/webinars') ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'}`}
            >
              Webinars
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {status === 'authenticated' ? (
            <Link 
              href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="px-4 py-2 text-sm font-medium text-foreground bg-surface hover:bg-surface/80 rounded-xl transition-colors border border-border shadow-sm"
            >
              {user?.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden md:block px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
