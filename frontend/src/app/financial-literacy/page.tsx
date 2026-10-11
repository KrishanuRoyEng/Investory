import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import {
  GraduationCap,
  Users,
  Search,
  Brain,
  Megaphone,
  BookOpenCheck,
  Globe2,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission: Advancing Financial Literacy | INVESONE',
  description:
    "Discover INVESONE's mission to advance financial literacy through structured capital-market education, live learning, financial-literacy outreach, and disciplined thinking.",
};

export default function FinancialLiteracyPage() {
  return (
    <div data-theme="landing" className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <LandingNav />

      {/* ══ HERO SECTION ══ */}
      <section
        className="relative py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
        style={{ background: 'var(--lp-navy-deepest)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 left-1/4 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: 'rgba(212,148,30,0.08)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
            style={{ background: 'rgba(15,30,61,0.9)' }}
          />
        </div>

        <div className="relative max-w-[1200px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--lp-gold-bright)]">Our Mission: Financial Literacy</span>
          </nav>

          {/* Cover Pic: Who We Are INVESONE */}
          <div className="relative w-full aspect-[1024/307] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-10 bg-slate-900">
            <Image
              src="/brand/who-we-are-banner.png"
              alt="Who We Are INVESONE"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-4">
              Our Mission
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Advancing Financial Literacy
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-white/95 mb-6" style={{ color: 'var(--lp-gold-bright)' }}>
              Understand money. Understand the markets. Make knowledge your strength.
            </p>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              Financial literacy is more than knowing how to save or where to invest. It is about understanding how money works, evaluating financial information, recognising risk, and making informed decisions.
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              Explore Our Courses <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="px-6 py-3.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              Discover INVESONE
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MAIN BODY ══ */}
      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto space-y-16">

          {/* Foundation Narrative Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl space-y-4 text-base text-gray-700 leading-relaxed">
              <p>
                Yet, many people enter the financial world without a strong foundation in financial concepts. Some find financial terminology difficult to understand. Others encounter market information without knowing how to evaluate it. And many are exposed to opinions, predictions, and promises without fully understanding the risks involved.
              </p>
              <p className="text-lg font-semibold text-gray-900">
                We believe that better financial awareness begins with better education.
              </p>
              <p>
                At <strong>INVESONE LLP</strong>, our mission is to make financial-market education accessible, structured, and meaningful, helping individuals develop the knowledge and analytical thinking needed to understand the financial world with greater clarity.
              </p>
            </div>
          </section>

          {/* Why Financial Literacy Matters */}
          <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-8 sm:p-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)] block mb-2">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mb-6">
                Why Financial Literacy Matters
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  Financial decisions influence many aspects of our lives, from managing everyday expenses and planning for the future to understanding financial products and evaluating investment opportunities.
                </p>
                <p>
                  In an increasingly complex financial environment, access to information alone is not enough. People also need the ability to interpret that information, question assumptions, distinguish facts from opinions, and recognise the limitations of their knowledge.
                </p>
                <p>
                  This is particularly important in the capital markets, where uncertainty is unavoidable and decisions made without adequate understanding can carry significant risks.
                </p>
                <p className="p-4 bg-white rounded-xl border border-blue-100 text-gray-900 font-medium">
                  We believe that financial education should encourage curiosity rather than confusion, informed judgement rather than blind imitation, and disciplined learning rather than the pursuit of shortcuts.
                </p>
                <p>
                  For us, financial literacy is not simply about acquiring information. It is about developing the ability to understand and use knowledge responsibly.
                </p>
              </div>
            </div>
          </section>

          {/* 6 Structured Initiatives */}
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--lp-gold-bright)] block mb-2">
                Action Plan
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f172a]">
                How INVESONE Advances Financial Education
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Six dedicated pathways through which we translate our educational mission into reality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* 1. Structured Learning */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[var(--brand-blue)] flex items-center justify-center mb-5 font-bold text-lg border border-blue-100">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Structured Learning in Trading and Investing
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Understanding financial markets requires more than learning isolated concepts. It requires a structured approach that connects foundational knowledge with more advanced ideas.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    INVESONE provides instructor-led online education designed to support learners at different stages of their financial-market learning journey. Our educational focus includes financial-market fundamentals, trading and investing concepts, technical analysis, fundamental analysis, derivatives, market psychology, risk management, and analytical techniques.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Through live classes, guided instruction, interactive discussions, and supporting educational materials, we aim to help learners build their understanding progressively.
                  </p>
                </div>
              </div>

              {/* 2. Learning Through Interaction */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 font-bold text-lg border border-amber-100">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Learning Through Interaction and Guidance
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    We believe learning becomes more meaningful when people can ask questions, explore ideas, and clarify concepts with experienced educators.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Our live online classes and educational webinars provide opportunities for interaction, discussion, and deeper exploration of financial-market topics.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We recognise that every learner has a different starting point. That is why we value structured learning pathways, guidance in selecting appropriate courses, and an educational environment in which questions are welcomed.
                  </p>
                </div>
              </div>

              {/* 3. Research & Independent Thinking */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-bold text-lg border border-emerald-100">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Research, Analysis, and Independent Thinking
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Financial markets are influenced by economic developments, business performance, investor behaviour, and changing market conditions. Understanding these relationships requires curiosity, critical thinking, and the ability to examine information carefully.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    We aim to encourage a research-oriented approach to financial education, helping learners appreciate how financial information can be studied, interpreted, and evaluated.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our underlying principle remains the same: we want people to develop their own understanding rather than depend entirely on the opinions or predictions of others.
                  </p>
                </div>
              </div>

              {/* 4. Market Psychology */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-bold text-lg border border-purple-100">
                    4
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Market Psychology, Risk Awareness, and Discipline
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Understanding markets involves understanding people, including ourselves. Fear, greed, impatience, and overconfidence can influence how individuals interpret information and respond to uncertainty.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Technical knowledge alone does not eliminate these behavioural challenges. At INVESONE, we place importance on market psychology, risk awareness, patience, and disciplined thinking as essential elements of financial-market education.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We do not present education as a guarantee of financial success. Instead, we believe that a stronger understanding of financial concepts and risks can help individuals approach the markets more thoughtfully.
                  </p>
                </div>
              </div>

              {/* 5. Outreach & Seminars */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 font-bold text-lg border border-rose-100">
                    5
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Financial-Literacy Outreach and Educational Seminars
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    We believe financial literacy should extend beyond those who already participate in the financial markets. Students, young adults, working professionals, and members of the wider community can all benefit from greater awareness.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    INVESONE is actively conducting financial-literacy outreach and educational seminars to introduce participants to financial-market concepts, encourage informed questions, and highlight the importance of responsible financial learning.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    These initiatives also provide opportunities to introduce students and young people to educational and career pathways within the capital-markets and financial-services industries.
                  </p>
                </div>
              </div>

              {/* 6. Free Learning Hub */}
              <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 font-bold text-lg border border-teal-100">
                    6
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                    Making Financial Knowledge More Accessible
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    We believe that access to understandable financial education should not be limited to people who can enrol in a formal course.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    With this in mind, we plan to develop a free financial-learning hub on the INVESONE website. The proposed hub will aim to introduce foundational financial concepts through accessible educational resources covering personal finance, mutual funds, stocks, bonds, ETFs, and IPOs.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The free-learning hub and the broader collection of educational publications are planned initiatives being developed progressively as part of our commitment to accessible knowledge.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ══ OUR VISION & THE INVESONE BELIEF ══ */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)] block">
                Looking Ahead
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
                Our Vision: A Broader Learning Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our ambition extends beyond individual courses or isolated learning initiatives. We aspire to build a comprehensive capital-markets learning ecosystem that brings together foundational financial education, specialised market knowledge, professional learning pathways, accessible educational resources, and institutional outreach.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                As INVESONE develops, we intend to continue improving our teaching methodologies, expanding our educational offerings, and exploring responsible ways to make financial learning more accessible to different audiences.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Any future expansion into additional financial-services activities will be pursued only where appropriate authorisations, registrations, and regulatory requirements are satisfied. Throughout this journey, our commitment to responsible education, transparency, and respect for applicable regulations will remain central to how we operate.
              </p>
            </div>
          </section>

          {/* ══ THE INVESONE BELIEF & CTAs ══ */}
          <section className="bg-gradient-to-r from-[#0a1628] to-[#122344] rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--lp-gold-bright)] block mb-3">
                The INVESONE Belief
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 leading-tight">
                Understand the markets. Question assumptions. Learn with discipline.
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-4 leading-relaxed">
                We believe that meaningful participation in financial markets begins with understanding.
              </p>
              <p className="text-sm sm:text-base text-white/70 mb-4 leading-relaxed font-medium">
                Not with rumours. Not with blind imitation. Not with promises of quick success.
              </p>
              <p className="text-sm sm:text-base text-white/80 mb-6 leading-relaxed">
                Because the purpose of financial education is not simply to tell people what to think. It is to help them learn how to think for themselves.
              </p>

              <p className="text-lg font-bold text-[var(--lp-gold-bright)] mb-8">
                Begin your learning journey with INVESONE.
              </p>

              {/* Required Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Explore Our Courses
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Discover INVESONE
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/50">
                INVESONE LLP — Be the One.
              </div>
            </div>
          </section>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
