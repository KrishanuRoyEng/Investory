'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Course Enquiry — Master Trader Programme',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    // Construct mailto link as fallback/routing to social email
    const subject = encodeURIComponent(`[INVESONE Enquiry] ${formData.topic} - ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    );
    
    // Attempt opening user's mail client to invesone.social@gmail.com
    window.open(`mailto:invesone.social@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

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
            <span className="text-[var(--lp-gold-bright)]">Talk To Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Talk To Us &amp; Course Admissions
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Connect With Our <span style={{ color: 'var(--lp-gold-bright)' }}>Academic Mentors</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Have questions about our Master Trader Programme, live batches, fees, or study curriculum? We are here to guide you at every step of your financial education journey.
          </p>
        </div>
      </section>

      {/* ══ MAIN CONTACT CONTENT ══ */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
            
            {/* Left: Contact Info Cards */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--lp-gold)]" />
                  Direct Channels
                </h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[var(--brand-blue)] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        Email Us
                      </span>
                      <a
                        href="mailto:invesone.social@gmail.com"
                        className="text-sm font-bold text-gray-900 hover:text-[var(--brand-blue)] transition-colors"
                      >
                        invesone.social@gmail.com
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Average response within 2-4 hours</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        Phone &amp; WhatsApp
                      </span>
                      <a
                        href="tel:8420202193"
                        className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        +91 8420202193
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Direct line for student counseling</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        Support Hours
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        Monday – Saturday
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">9:00 AM – 7:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Strip */}
              <div className="bg-gradient-to-br from-slate-900 to-[#122344] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-white/10">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(212,148,30,0.2)] border border-[rgba(212,148,30,0.4)] flex items-center justify-center text-[var(--lp-gold-bright)] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">NISM-Certified Mentorship</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      All consultations are handled by certified market trainers focused on disciplined education, not stock tips or false promises.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Contact Enquiry Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#0f172a] mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your enquiry has been routed to <strong>invesone.social@gmail.com</strong>. One of our counselors will contact you at <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        topic: 'Course Enquiry — Master Trader Programme',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0f172a] mb-2">Send an Enquiry</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6">
                    Fill out the form below and our team will get in touch with you.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all text-gray-900 bg-gray-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all text-gray-900 bg-gray-50/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="rahul@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all text-gray-900 bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Topic / Course of Interest
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all text-gray-900 bg-gray-50/50"
                      >
                        <option value="Master Trader Programme (Beginner 10-Day)">Master Trader Programme (Beginner 10-Day)</option>
                        <option value="Technical Analysis Masterclass">Technical Analysis Masterclass</option>
                        <option value="Mastery in Derivatives & Options">Mastery in Derivatives &amp; Options</option>
                        <option value="NISM Exam Preparation">NISM Exam Preparation</option>
                        <option value="Personal Trading Mentorship">Personal Trading Mentorship</option>
                        <option value="Fee & Installment Enquiry">Fee &amp; Installment Enquiry</option>
                        <option value="General Question / Other">General Question / Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Your Message / Questions
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your background in markets or what you'd like to learn..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all text-gray-900 bg-gray-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[var(--brand-blue)] hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Message to invesone.social@gmail.com
                    </button>

                    <p className="text-[11px] text-gray-400 text-center mt-2">
                      Your details are kept private under our Privacy Policy. We never share your data.
                    </p>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
