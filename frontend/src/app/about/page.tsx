import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import {
  Compass,
  BookOpen,
  Award,
  ShieldCheck,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us & Company Overview | INVESONE',
  description:
    'Learn about INVESONE LLP — an online financial education platform committed to structured, live learning, NISM-certified mentorship, and disciplined capital-market education.',
};

export default function AboutPage() {
  return (
    <div data-theme="landing" className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <LandingNav />

      {/* ══ HERO BANNER ══ */}
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
            <span className="text-[var(--lp-gold-bright)]">About Us</span>
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
              Company Overview &amp; Mission
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Welcome to <span style={{ color: 'var(--lp-gold-bright)' }}>INVESONE</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-white/90 mb-4">
              Be the One.
            </p>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
              At INVESONE, we believe that understanding the financial markets is more valuable than simply participating in them. Our vision is to make capital-market education accessible, practical, and meaningful for everyone who wishes to learn about trading, investing, and the forces that shape financial markets.
            </p>
          </div>

          {/* Accreditation Highlight Badge */}
          <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(212,148,30,0.2)] border border-[rgba(212,148,30,0.4)] flex items-center justify-center shrink-0 text-[var(--lp-gold-bright)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">
                NISM-Certified Trainers &amp; Mentors
              </p>
              <p className="text-sm text-white/70">
                Market education and mentorship, built on certified expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto space-y-16">

          {/* Executive Overview Box */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-blue)] block mb-2">
                Executive Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Capital-Market Education Accessible, Structured, and Meaningful
              </h2>
              <div className="prose text-gray-700 leading-relaxed space-y-4 text-base">
                <p>
                  <strong>INVESONE LLP</strong> is an online financial education platform committed to making capital-market education accessible, structured, and meaningful. Through live, instructor-led learning and a research-oriented educational approach, we aim to help individuals develop a deeper understanding of trading, investing, market psychology, and risk awareness.
                </p>
                <p>
                  Our mission is to empower learners with knowledge, encourage independent thinking, and promote a more informed and disciplined approach to understanding financial markets.
                </p>
                <p className="font-semibold text-gray-900">
                  The financial markets are constantly evolving. Economic developments, market movements, financial instruments, and technological advancements continue to change how people study and participate in them. In such an environment, learning should not be limited to understanding terminology or following market trends. It should involve asking the right questions, examining evidence, understanding risk, and developing the ability to evaluate information independently.
                </p>
                <p>
                  Whether you are a student exploring the world of finance, a beginner taking your first steps towards understanding the markets, a working professional looking to expand your knowledge, or an experienced market participant seeking to strengthen your analytical approach, INVESONE aims to provide a learning pathway suited to your stage of development.
                </p>
              </div>
            </div>
          </section>

          {/* Core Pillars Grid */}
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--lp-gold-bright)] block mb-2">
                Our Educational Pillars
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f172a]">
                How We Approach Capital Markets
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Moving beyond isolated theory towards empirical understanding, disciplined risk awareness, and independent decision making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Pillar 1 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[var(--brand-blue)] flex items-center justify-center mb-6 border border-blue-100">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Learning Beyond Theory
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We believe that meaningful financial education goes beyond memorising concepts. It involves understanding how those concepts relate to real-world market behaviour and financial decision-making.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Our educational programmes cover a range of subjects, from the fundamentals of financial markets, trading, and investing to technical analysis, fundamental analysis, derivatives, market research, and trading psychology. Through structured learning pathways, we aim to help learners progress from foundational knowledge towards more advanced concepts at a pace appropriate to their learning goals.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our approach combines live, instructor-led online classes with interactive discussions, supporting learning materials, practical illustrations, and opportunities to clarify doubts. We encourage learners to engage actively with the subject, understand the reasoning behind different analytical approaches, and develop a systematic framework for learning about the markets.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Guided by Experience, Grounded in Research
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We believe that the quality of education depends not only on what is taught, but also on how it is explained and understood.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    At INVESONE, we place importance on educators who can communicate financial-market concepts clearly, connect theory with practical market observations, and help learners understand the context behind what they study. Our research-oriented approach encourages critical thinking, evidence-based analysis, and an appreciation of the complexities and uncertainties inherent in financial markets.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We also recognise that every learner begins with a different level of knowledge. That is why we value structured progression, individual guidance in selecting appropriate learning programmes, meaningful interaction, and an environment where questions are welcomed. Our objective is not simply to deliver information. It is to make the learning process more engaging, systematic, and relevant to the learner's journey.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Knowledge, Discipline, and Independent Thinking
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Financial markets can be challenging, particularly when decisions are influenced by uncertainty, emotions, or unrealistic expectations. Understanding market concepts is important, but so is recognising the role of risk awareness, patience, and discipline.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We believe financial education should encourage individuals to think critically rather than depend on tips, predictions, or shortcuts. By incorporating market psychology, analytical frameworks, and risk awareness into our educational philosophy, we aim to help learners appreciate not only how markets function, but also the importance of the decisions and behaviours surrounding them.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We do not view learning as a promise of financial success. We view it as a continuing process of developing knowledge, refining judgement, understanding limitations, and becoming a more informed participant in the financial world.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-3">
                    Building a Broader Learning Ecosystem
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Our ambition extends beyond individual courses. We aspire to build a comprehensive capital-markets learning ecosystem that supports individuals at different stages of their educational and professional journeys.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Through continuous improvement in our programmes, learning methodologies, educational resources, and learner engagement, we aim to create an environment where curiosity leads to deeper understanding and learning becomes an ongoing pursuit.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    As INVESONE grows, our long-term vision is to explore opportunities to broaden our contribution to the financial-services ecosystem, including additional activities where appropriate authorisations, registrations, and regulatory requirements are fulfilled. Our commitment to responsible education, transparency, and respect for applicable regulations will remain central to this journey.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ══ THE INVESONE INVITATION BANNER ══ */}
          <section className="bg-gradient-to-r from-[#0a1628] to-[#122344] rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--lp-gold-bright)] block mb-3">
                Begin Your Journey
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight">
                Learn with curiosity. Think with clarity. Approach the markets with understanding.
              </h2>
              <p className="text-sm sm:text-base text-white/70 mb-8 leading-relaxed">
                We believe that a stronger understanding of financial markets begins with better education. And better education begins with the willingness to learn, question, analyse, and grow.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Explore Our Courses
                </Link>
                <Link
                  href="/financial-literacy"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Our Mission &amp; Financial Literacy
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/50">
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
