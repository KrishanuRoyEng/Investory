'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import { Sparkles, ArrowRight, Bell, CheckCircle2 } from 'lucide-react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div data-theme="landing" className="min-h-screen bg-[var(--lp-navy-deepest)] text-white flex flex-col font-sans">
      <LandingNav />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[140px]"
            style={{ background: 'rgba(212,148,30,0.12)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[160px]"
            style={{ background: 'rgba(15,30,61,0.95)' }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto text-center z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Admissions Opening Soon
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            We&apos;re Preparing Something <span style={{ color: 'var(--lp-gold-bright)' }}>Extraordinary</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-10">
            Admissions and enrolment for this programme are opening shortly. Our faculty is finalizing batch schedules, live interactive rooms, and mentorship materials.
          </p>

          {/* Notification Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl max-w-lg mx-auto mb-10">
            {submitted ? (
              <div className="flex flex-col items-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">You&apos;re on the priority list!</h3>
                <p className="text-xs text-white/60 text-center">
                  We&apos;ll notify you via email as soon as registrations go live.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-white/90 mb-4 flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4 text-[var(--lp-gold-bright)]" />
                  Get notified when admissions open
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 shrink-0"
                  >
                    Notify Me
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Return Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15"
            >
              Browse Course Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3 text-white/60 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
