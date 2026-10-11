'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import {
  ChevronDown,
  Search,
  HelpCircle,
  Phone,
  Mail,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  name: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'about',
    name: 'About INVESONE',
    items: [
      {
        q: 'What is INVESONE?',
        a: 'INVESONE LLP is a capital-markets education platform focused on structured learning in areas such as technical analysis, fundamental analysis, trading, investing, derivatives, market psychology, risk management and related market concepts. Our approach combines expert-led instruction, practical application and disciplined decision-making.',
      },
      {
        q: 'Who can learn with INVESONE?',
        a: 'INVESONE offers learning programs for beginners as well as learners seeking intermediate or advanced knowledge. Beginner programs do not require prior stock-market knowledge or experience. Certain advanced or specialized programs may be easier to understand with foundational knowledge or prior market exposure.',
      },
      {
        q: 'Are INVESONE courses suitable for complete beginners?',
        a: 'Yes. Beginner-level programs like the Master Trader Programme are designed for learners with little or no prior knowledge of the stock market. Learners can start with foundational concepts and progressively develop their understanding.',
      },
      {
        q: 'Does INVESONE provide courses only for traders?',
        a: "No. INVESONE's programs cover trading, investing, technical analysis, fundamental analysis, derivatives, market psychology, risk management and other areas of capital-markets education.",
      },
    ],
  },
  {
    id: 'courses',
    name: 'Courses & Learning',
    items: [
      {
        q: 'Are INVESONE courses conducted online or offline?',
        a: 'During the initial phase, INVESONE courses are conducted online through live, instructor-led sessions. Physical classroom programs may be introduced in the future.',
      },
      {
        q: 'What languages are available?',
        a: 'At launch, learning and support are available in English, Hindi and Bengali. Additional regional languages may be introduced as INVESONE expands.',
      },
      {
        q: 'What is the duration of an INVESONE course?',
        a: 'Each course has its own defined standard duration (e.g. 10-day structured programmes, 30-day masterclasses). In exceptional circumstances, a limited extension may be provided when genuine issues affect scheduled completion.',
      },
      {
        q: 'What class schedules are available?',
        a: 'Depending on the course and batch, INVESONE may offer weekday, weekday-evening, weekend-morning and weekend-evening schedules. Available schedules vary by batch.',
      },
      {
        q: 'Can I upgrade my course or purchase a bundle later?',
        a: 'Yes. Learners can upgrade from one course to another or move from an individual course to an applicable course bundle. Amounts already paid will be adjusted against the upgraded program, subject to applicable terms.',
      },
    ],
  },
  {
    id: 'practical',
    name: 'Practical Learning & Recordings',
    items: [
      {
        q: 'What will I receive as part of an INVESONE course?',
        a: 'Depending on the course, learners may receive study notes, booklets, PDFs, assignments, class transcripts, assessments, quizzes, and case studies, along with access to live classes and applicable course recordings.',
      },
      {
        q: 'Will I receive course recordings?',
        a: 'Yes. Learners enrolled in a course receive access to applicable class recordings, including recordings of classes they could not attend live.',
      },
      {
        q: 'How long will I have access to recordings and learning materials?',
        a: 'INVESONE provides access for a substantial period. The exact access validity is specified on each course detail page.',
      },
      {
        q: 'Can I download the recordings or learning materials?',
        a: 'No. Course recordings and learning materials are provided securely through the INVESONE LMS and are not offered as downloadable video files.',
      },
    ],
  },
  {
    id: 'enrollment',
    name: 'Enrolment & Payment',
    items: [
      {
        q: 'Can I enroll directly through the INVESONE website?',
        a: 'Yes. Enrolments and priority admissions can be requested directly through our website.',
      },
      {
        q: 'Will I receive a payment receipt or invoice?',
        a: 'Yes. INVESONE provides an official GST payment receipt or invoice following enrollment and payment verification.',
      },
      {
        q: 'Are scholarships available?',
        a: 'Yes. Partial scholarship decisions are made by management on a case-by-case basis based on background and merit.',
      },
      {
        q: 'Can I change my batch after enrollment?',
        a: 'A batch change may be permitted in genuine circumstances, subject to management approval and batch availability.',
      },
    ],
  },
  {
    id: 'certificates',
    name: 'Certificates & NISM',
    items: [
      {
        q: 'Does INVESONE provide a course-completion certificate?',
        a: 'Yes. Eligible learners who meet the applicable course-completion requirements receive an official INVESONE course-completion certificate at no extra cost.',
      },
      {
        q: 'Can the certificate be verified?',
        a: 'Yes. INVESONE certificates contain a unique Certificate ID and will have an online verification mechanism to help employers and institutions verify authenticity.',
      },
      {
        q: 'Does INVESONE provide NISM preparation?',
        a: 'Yes. INVESONE provides training and exam-preparation pathways for relevant NISM certifications.',
      },
      {
        q: 'Does INVESONE issue NISM certification?',
        a: 'No. INVESONE does not issue NISM certification. Learners must appear for and successfully clear the official NISM examination conducted by NISM to obtain the certification.',
      },
    ],
  },
  {
    id: 'integrity',
    name: 'Educational Integrity & Disclaimer',
    items: [
      {
        q: 'Does INVESONE provide investment or trading advice?',
        a: 'No. INVESONE provides educational training only. We do not provide personalized investment advice, trading advice, tips, portfolio management, or buy/sell recommendations.',
      },
      {
        q: "Can INVESONE's courses guarantee trading or investment success?",
        a: 'No. Education and analytical knowledge cannot eliminate market risk or guarantee financial profits. Results depend on individual discipline, market conditions, and independent decision-making.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_CATEGORIES.map((cat) => {
    const filteredItems = cat.items.filter((item) => {
      const matchesSearch =
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return { ...cat, items: filteredItems };
  }).filter((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return false;
    return cat.items.length > 0;
  });

  return (
    <div data-theme="landing" className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <LandingNav />

      {/* ══ HERO BANNER ══ */}
      <section
        className="relative py-14 lg:py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
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

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-white/50 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--lp-gold-bright)]">FAQs</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Support &amp; Answers
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Frequently Asked <span style={{ color: 'var(--lp-gold-bright)' }}>Questions</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Have questions about our courses, live sessions, certifications or learning approach? Explore answers to common questions below.
          </p>

          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-full bg-white text-gray-900 placeholder-gray-400 text-sm shadow-xl outline-none border border-gray-200 focus:ring-2 focus:ring-[var(--brand-blue)] transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* ══ CATEGORY PILLS ══ */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-[var(--lp-navy-deepest)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Questions
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[var(--lp-navy-deepest)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ══ ACCORDION CONTENT ══ */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">

          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No matching questions found</h3>
              <p className="text-xs text-gray-500 mb-4">Try searching with a different term or clear the filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[var(--brand-blue)] text-white text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <section key={cat.id} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--lp-gold)]" />
                  {cat.name}
                </h2>

                <div className="space-y-4">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.id}-${idx}`;
                    const isOpen = openItems[key];
                    return (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0f172a] hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-[var(--brand-blue)]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}

          {/* Note for Learners */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-bold text-amber-950 mb-2">A Note for Learners</h3>
            <p className="text-sm text-amber-900/80 leading-relaxed">
              INVESONE believes that meaningful market education is built on knowledge, practice, discipline and responsible decision-making—not shortcuts or promises. The purpose of our programs is to help learners understand markets more clearly, develop structured thinking and apply concepts responsibly. Market participation involves risk, and every learner remains responsible for their own financial decisions.
            </p>
          </div>

          {/* Need More Assistance Banner */}
          <div className="bg-gradient-to-r from-[#0a1628] to-[#122344] rounded-2xl p-8 text-white text-center shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
              Our academic counselors are available to guide you on selecting the right learning path for your goals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <a
                href="mailto:invesone.social@gmail.com"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[var(--lp-gold-bright)]" />
                invesone.social@gmail.com
              </a>
              <a
                href="tel:8420202193"
                className="px-5 py-3 rounded-xl bg-[var(--brand-blue)] hover:bg-blue-600 text-white transition-colors flex items-center gap-2 shadow-md"
              >
                <Phone className="w-4 h-4" />
                +91 8420202193
              </a>
            </div>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
