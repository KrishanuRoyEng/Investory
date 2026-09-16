'use client';

import Link from 'next/link';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  return (
    <div className="min-h-screen w-full bg-background flex relative overflow-hidden text-foreground font-sans selection:bg-primary/30">
      
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 w-full max-w-2xl mx-auto lg:mx-0 relative">
        <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors bg-surface/80 p-2 rounded-md border border-border shadow-sm backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-foreground/60 hover:text-foreground bg-surface/80 border border-border shadow-sm backdrop-blur-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96 mt-16 lg:mt-0">
          {children}
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1 z-10">
        <div className="absolute inset-0 bg-surface/40 backdrop-blur-2xl border-l border-border/50 p-20 flex flex-col justify-center bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="max-w-xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
              Master the Markets
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed mb-8">
              Join Investory's elite community of traders. Access live sessions, comprehensive courses, and institutional-grade analytics to elevate your trading journey.
            </p>
            <ul className="space-y-4 text-sm font-medium text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <span>Learn from industry veterans with proven track records.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <span>Access institutional-grade tools and live macro analysis.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <span>Join a network of driven individuals pushing for market mastery.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
