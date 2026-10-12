'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Phone, Mail, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export function LeadGenModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Master Trader Programme (Beginner 10-Day)',
    experience: 'Complete Beginner',
  });

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('invesone_lead_modal_dismissed');
    if (isDismissed) return;

    let timer: NodeJS.Timeout | null = null;
    let triggered = false;

    const handleScroll = () => {
      if (triggered) return;
      if (window.scrollY > 300) {
        triggered = true;
        // Pop up 3.5 seconds after user scrolls down
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Custom event listener to allow manual triggering from anywhere
    const handleManualOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-lead-modal', handleManualOpen);

    // Escape key listener to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        sessionStorage.setItem('invesone_lead_modal_dismissed', 'true');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-lead-modal', handleManualOpen);
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('invesone_lead_modal_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    // Send/route to invesone.social@gmail.com via mailto
    const subject = encodeURIComponent(`[Course Enquiry] ${formData.course} - ${formData.name}`);
    const body = encodeURIComponent(
      `Candidate Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCourse: ${formData.course}\nExperience: ${formData.experience}`
    );
    window.open(`mailto:invesone.social@gmail.com?subject=${subject}&body=${body}`, '_blank');

    setSubmitted(true);
    sessionStorage.setItem('invesone_lead_modal_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0b162c] text-white rounded-2xl sm:rounded-3xl border border-white/15 p-4 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 148, 30, 0.1)',
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--lp-gold)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button — TOP LEFT as explicitly requested */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3 left-3 sm:top-5 sm:left-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10 transition-colors z-30 flex items-center justify-center"
          title="Close (Esc)"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Secondary close button on top-right for convenience */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-30 hidden sm:flex items-center justify-center"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Enquiry Received!</h3>
            <p className="text-sm text-white/70 max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. An academic counselor will contact you at <strong>{formData.phone}</strong> shortly to discuss batch schedules and syllabus.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:bg-blue-600 transition-colors"
            >
              Back to Website
            </button>
          </div>
        ) : (
          <div className="pt-8 sm:pt-2">
            {/* Modal Header */}
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)] mb-2 sm:mb-3">
                <Sparkles className="w-3 h-3" />
                Course Enquiry &amp; Free Counseling
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Take Your First Step in the <span style={{ color: 'var(--lp-gold-bright)' }}>Markets</span>
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/70 mt-1 leading-relaxed">
                Connect directly with our certified mentors. Get full syllabus details, class timings, and discount options.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Course of Interest
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#0f1d38] border border-white/15 text-white text-xs sm:text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                >
                  <option value="Master Trader Programme (Beginner 10-Day)">Master Trader Programme (Beginner 10-Day)</option>
                  <option value="Technical Analysis Masterclass">Technical Analysis Masterclass</option>
                  <option value="Mastery in Derivatives Trading">Mastery in Derivatives Trading</option>
                  <option value="NISM Certification Preparation">NISM Certification Preparation</option>
                  <option value="Personal Trading Mentorship">Personal Trading Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Current Market Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#0f1d38] border border-white/15 text-white text-xs sm:text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] transition-all"
                >
                  <option value="Complete Beginner (Zero knowledge)">Complete Beginner (Zero knowledge)</option>
                  <option value="Some Knowledge (Watched videos / reads charts)">Some Knowledge (Watched videos / reads charts)</option>
                  <option value="Active Trader / Seeking structured discipline">Active Trader / Seeking structured discipline</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-[var(--brand-blue)] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Request Free Counselor Callback <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Confidential
              </span>
              <span>Direct Routing: invesone.social@gmail.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
