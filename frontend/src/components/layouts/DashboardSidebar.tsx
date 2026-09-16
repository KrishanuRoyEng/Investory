'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { logout } from '@/lib/store/auth.store';
import { ArrowLeft, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/courses', label: 'My Courses' },
    { href: '/dashboard/sessions', label: 'My Sessions' },
    { href: '/dashboard/doubts', label: 'My Doubts' },
    { href: '/dashboard/orders', label: 'Order History' },
    { href: '/dashboard/certificates', label: 'Certificates' },
    { href: '/dashboard/profile', label: 'Profile Settings' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border sticky top-0 z-40">
        <h2 className="text-lg font-bold text-foreground tracking-wide">
          Invest<span className="text-primary">ory</span>
        </h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-foreground/80 hover:text-foreground"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border text-foreground/80 flex flex-col transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-foreground tracking-wide">
            Invest<span className="text-primary">ory</span>
          </h2>
        </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary/80' 
                  : 'hover:bg-surface/80 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border flex flex-col gap-4">
        <div className="flex items-center justify-between px-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-surface/80 transition-colors border border-transparent hover:border-border/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        <div>
          <div className="px-3 py-2 text-sm text-foreground/60 mb-2 truncate">
            {user?.name}
            <div className="text-xs text-foreground/40">{user?.email}</div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center px-3 py-2 border border-border/80 rounded-md text-sm font-medium text-foreground/80 hover:bg-surface/80 hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
