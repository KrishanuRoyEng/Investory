import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Star,
  Users,
  Video,
  FileQuestion,
  Layers,
  TrendingDown,
  BrainCircuit,
  AlertTriangle,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function BeginnerCourseView() {
  return (
    <div className="bg-[var(--lp-navy-deepest)] text-white min-h-screen">
      
      {/* ══ HERO SECTION ══ */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-[140px]"
            style={{ background: 'rgba(212,148,30,0.1)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: 'rgba(15,30,61,0.9)' }}
          />
        </div>

        <div className="relative max-w-[1300px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-[var(--lp-gold-bright)]">Beginner</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 items-center">
            
            {/* Left Content */}
            <div>
              {/* Top Label */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                BEGINNER-FRIENDLY · 10-DAY STRUCTURED PROGRAMME
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6">
                Master Trader <span style={{ color: 'var(--lp-gold-bright)' }}>Programme</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mb-6 sm:mb-8">
                A structured, mentor-led learning experience that builds your understanding of technical and fundamental analysis—from reading price action and chart patterns to evaluating company financials, with a focus on analytical thinking, risk awareness, and disciplined decision-making.
              </p>

              {/* CTA & Price */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                <Link
                  href="/coming-soon"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#d9383a] to-[#c52b2d] hover:from-[#c52b2d] hover:to-[#b02224] text-white text-sm sm:text-base font-bold transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
                >
                  <span>Enrol Now for ₹8,999</span>
                  <span className="text-xs line-through text-white/60 font-normal">₹14,999</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <div className="text-xs text-white/60 text-center sm:text-left">
                  <p className="font-semibold text-white/90">Batch Admissions Opening Soon</p>
                  <p>10 Days Live · Interactive Mentorship</p>
                </div>
              </div>
            </div>

            {/* Right Card: Official Master Trader Programme Graphic */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[440px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group bg-slate-900/60">
                <Image
                  src="/brand/master-trader-programme.jpg"
                  alt="Master Trader Programme - INVESONE"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="relative z-10 border-y border-white/10 bg-[#0d1729]">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            
            <div className="p-2.5 sm:p-4 border-r border-white/5 last:border-none">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-0.5 sm:mb-1">
                1,500+
              </div>
              <div className="text-[11px] sm:text-sm text-white/60 font-medium">
                Learners*
              </div>
            </div>

            <div className="p-2.5 sm:p-4 border-r border-white/5 last:border-none">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--lp-gold-bright)] mb-0.5 sm:mb-1">
                4.5★
              </div>
              <div className="text-[11px] sm:text-sm text-white/60 font-medium">
                Student Rating*
              </div>
            </div>

            <div className="p-2.5 sm:p-4 border-r border-white/5 last:border-none">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-0.5 sm:mb-1">
                Live
              </div>
              <div className="text-[11px] sm:text-sm text-white/60 font-medium">
                Instructor-Led Learning
              </div>
            </div>

            <div className="p-2.5 sm:p-4">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-400 mb-0.5 sm:mb-1">
                NISM-Certified
              </div>
              <div className="text-[11px] sm:text-sm text-white/60 font-medium">
                Trainers*
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ SECTION 1: THE LEARNING GAP ══ */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-[1300px] mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--lp-gold-bright)] block mb-3">
              THE LEARNING GAP
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              You Want to Understand the Market. So Where Do You Start?
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              The market isn&apos;t short on information. What&apos;s missing is a clear learning path that turns scattered knowledge into structured understanding.
            </p>
          </div>

          {/* 6 Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* 1 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Lost in Information</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Too many videos. Too many indicators. Too many opinions. It&apos;s hard to know what&apos;s worth learning first.
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Knowledge Without Structure</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Knowing individual concepts isn&apos;t enough. Without the bigger picture, it&apos;s difficult to see how the pieces fit together.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Understanding Isn&apos;t Application</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Recognising a pattern is one thing. Interpreting price action, market context and risk is another.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Too Many Unanswered Questions</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                When doubts go unresolved, learning slows down and confidence can be difficult to build.
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 font-bold">
                5
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Emotions Enter the Equation</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Fear, greed and hesitation can cloud judgement. Understanding market psychology is part of learning to make more informed decisions.
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 font-bold">
                6
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Risk Comes Before Reward</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Before looking for opportunities, beginners need to understand potential losses, position sizing and risk management.
              </p>
            </div>

          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-400/20 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Less confusion. More clarity. A better foundation.
            </h4>
            <p className="text-sm sm:text-base text-white/70">
              INVESONE helps you build market knowledge through structured, instructor-led financial education.
            </p>
          </div>

        </div>
      </section>

      {/* ══ SECTION 2: YOUR LEARNING OUTCOMES ══ */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b1324] border-t border-white/5">
        <div className="max-w-[1300px] mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--lp-gold-bright)] block mb-3">
              YOUR LEARNING OUTCOMES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Understand the Market. Build Your Approach.
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Build market knowledge, analytical thinking and risk awareness through structured, instructor-led learning.
            </p>
          </div>

          {/* 6 Outcome Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            
            {/* 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 01</span>
                <h3 className="text-xl font-bold text-white mb-3">1. Read the Market</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Understand price action, trends and market behaviour.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 02</span>
                <h3 className="text-xl font-bold text-white mb-3">2. Analyse with Context</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Explore chart patterns, indicators and potential setups.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 03</span>
                <h3 className="text-xl font-bold text-white mb-3">3. Put Risk First</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Learn position sizing, stop-loss concepts and potential loss management.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 04</span>
                <h3 className="text-xl font-bold text-white mb-3">4. Build a Process</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Connect analysis, planning and discipline in a structured approach.
                </p>
              </div>
            </div>

            {/* 5 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 05</span>
                <h3 className="text-xl font-bold text-white mb-3">5. Understand Business Value</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Explore company fundamentals and the financial information behind investment analysis.
                </p>
              </div>
            </div>

            {/* 6 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
              <div>
                <span className="text-xs font-bold text-[var(--lp-gold-bright)] block mb-2">OUTCOME 06</span>
                <h3 className="text-xl font-bold text-white mb-3">6. Master Your Mindset</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Recognise how emotions and behavioural biases can influence market decisions.
                </p>
              </div>
            </div>

          </div>

          {/* Closing Banner */}
          <div className="bg-gradient-to-r from-[#0f1f3d] to-[#162a52] border border-white/15 rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--lp-gold-bright)] block mb-3">
                BEGIN YOUR LEARNING JOURNEY
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                Learn with purpose. Think with clarity. Be the One.
              </h3>
              <p className="text-sm sm:text-base text-white/70 mb-8 leading-relaxed">
                Step into live, structured capital-market education designed to turn confusion into independent understanding.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/coming-soon"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d9383a] to-[#c52b2d] hover:from-[#c52b2d] hover:to-[#b02224] text-white text-base font-bold transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3"
                >
                  <span>Enrol Now for ₹8,999</span>
                  <span className="text-xs line-through text-white/60 font-normal">₹14,999</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/courses?level=ADVANCED"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors border border-white/20"
                >
                  View All Advanced Courses
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/40">
                INVESONE LLP — Master Trader Programme
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
