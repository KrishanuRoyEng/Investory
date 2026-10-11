import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';
import { UserCheck, Clock, Mail, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Grievance Officer and Policy | INVESONE',
  description: 'Grievance Redressal Policy and contact details for the designated Grievance Officer at INVESONE LLP in accordance with Indian Consumer Protection laws.',
};

export default function GrievancePolicyPage() {
  return (
    <div data-theme="landing" className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <LandingNav />

      {/* Main Container */}
      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[var(--brand-blue)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800">Grievance Officer and Policy</span>
          </nav>

          {/* White Card Document */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-12 md:p-16">
            
            {/* Header */}
            <div className="text-center mb-10 pb-6 border-b border-gray-100">
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0f172a]">
                GRIEVANCE REDRESSAL POLICY
              </h1>
              <div className="w-16 h-1 bg-[var(--lp-gold)] mx-auto mt-3 mb-4 rounded-full" />
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                INVESONE LLP
              </p>
              <p className="text-xs text-gray-500">
                Effective Date: 11 October 2026 &nbsp;·&nbsp; Last Updated: 11 October 2026
              </p>
            </div>

            {/* Document Body */}
            <div className="space-y-8 text-sm leading-relaxed text-gray-700">

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">1. Purpose</h2>
                <p className="mb-3">
                  INVESONE LLP is committed to providing fair, transparent and accessible support to learners, prospective learners and customers who engage with its educational services.
                </p>
                <p className="mb-3">
                  This Grievance Redressal Policy explains how complaints concerning the company's courses, enrolment, payments, course access, educational services and customer support may be submitted and addressed.
                </p>
                <p>
                  This Policy shall be interpreted in accordance with applicable Indian laws, including the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, as amended, and other applicable legal requirements.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">2. Scope</h2>
                <p className="mb-3">
                  This Policy applies to grievances relating to educational services offered by INVESONE LLP through its website and authorised online or other communication channels.
                </p>
                <p className="mb-2 font-medium text-gray-800">Grievances may concern:</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Course enrolment, registration and scheduling.</li>
                  <li>Payments, fees, receipts and billing-related issues.</li>
                  <li>Access to courses, recordings and learning materials.</li>
                  <li>Course delivery and customer support.</li>
                  <li>Information provided about courses, fees, features and applicable refund terms.</li>
                  <li>Alleged unfair practices or other concerns relating to the company's services.</li>
                </ul>
                <p>
                  Each grievance will be assessed according to its nature, the relevant course terms and applicable law. Nothing in this Policy limits a person's statutory rights.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">3. How to Submit a Grievance</h2>
                <p className="mb-3">
                  A grievance may be submitted by email to:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3 space-y-1 text-xs">
                  <p><strong>Email:</strong> <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline font-medium">invesone.social@gmail.com</a></p>
                  <p><strong>Suggested subject line:</strong> Grievance – INVESONE LLP</p>
                </div>
                <p className="mb-2 font-medium text-gray-800">
                  To assist with the review, complainants are encouraged to provide the following information, where applicable:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Full name and preferred contact details.</li>
                  <li>Course name or enrolment reference.</li>
                  <li>A clear description of the issue and relevant dates.</li>
                  <li>Payment or transaction reference, if applicable.</li>
                  <li>Supporting documents or screenshots, where available.</li>
                  <li>The resolution being requested.</li>
                </ul>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium mb-3">
                  Security Reminder: Please do not include passwords, card security codes or unnecessary sensitive personal information in a complaint.
                </div>
                <p>
                  If further information is reasonably necessary to investigate a grievance, INVESONE LLP may request clarification. A complaint will be handled in accordance with applicable legal requirements even where the complainant has not supplied every suggested detail.
                </p>
              </section>

              {/* Highlighted Grievance Officer Card */}
              <section className="bg-gradient-to-br from-blue-50/50 to-indigo-50/40 border border-blue-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-blue)] text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0f172a]">4. Grievance Officer</h2>
                    <p className="text-xs text-gray-600">Designated under the Consumer Protection (E-Commerce) Rules, 2020</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-5">
                  INVESONE LLP has designated the following person to receive and coordinate the resolution of grievances, subject to applicable legal requirements:
                </p>

                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-0.5">Name of the Officer:</span>
                    <strong className="text-sm text-gray-900 block">Rakhi Das</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Designation:</span>
                    <span className="font-semibold text-gray-800">Grievance Officer</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Organisation:</span>
                    <span className="font-semibold text-gray-800">INVESONE LLP</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">Email Address:</span>
                    <a href="mailto:invesone.social@gmail.com" className="font-semibold text-[var(--brand-blue)] hover:underline">
                      invesone.social@gmail.com
                    </a>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-500 block mb-0.5">Official Website:</span>
                    <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--brand-blue)] hover:underline">
                      https://invesone.com/
                    </a>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                  The Grievance Officer will coordinate the review of complaints, communicate with complainants and work with the relevant personnel to facilitate appropriate resolution. The company will ensure that the Grievance Officer's details are displayed and updated as required by applicable law.
                </p>
              </section>

              {/* Timelines Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[var(--lp-gold-bright)]" />
                  <h2 className="text-lg font-bold text-[#0f172a]">5. Acknowledgement and Resolution Timelines</h2>
                </div>
                <p className="mb-3">
                  INVESONE LLP will comply with the timelines prescribed by applicable law. Where the Consumer Protection (E-Commerce) Rules, 2020 apply:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Acknowledgement</p>
                    <p className="text-sm font-semibold text-gray-900">Within 48 hours of receipt</p>
                    <p className="text-xs text-gray-600 mt-1">A consumer complaint shall be acknowledged within 48 hours.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Redressal</p>
                    <p className="text-sm font-semibold text-gray-900">Within 1 month from receipt</p>
                    <p className="text-xs text-gray-600 mt-1">The complaint shall be redressed within one month from the date of receipt.</p>
                  </div>
                </div>
                <p className="mb-3">
                  <strong>Complaint record:</strong> From the date the relevant amended requirement becomes applicable, the complainant shall be provided with a copy of the complaint as recorded by the Grievance Officer, as required by law.
                </p>
                <p>
                  The company will endeavour to resolve complaints as promptly as reasonably possible. Where additional investigation is required, the complainant may be informed of the progress and relevant next steps, without extending any statutory deadline unlawfully.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">6. Review and Resolution</h2>
                <p className="mb-2 font-medium text-gray-800">Upon receiving a grievance, INVESONE LLP may:</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Review the complaint and the information supplied.</li>
                  <li>Request relevant clarification or supporting documents, where reasonably necessary.</li>
                  <li>Consult the personnel or authorised service providers concerned.</li>
                  <li>Assess the complaint against applicable course terms, published policies and legal requirements.</li>
                  <li>Communicate the outcome or proposed resolution to the complainant.</li>
                </ul>
                <p className="mb-3">
                  Depending on the circumstances, a resolution may include clarification, correction of an administrative error, restoration of eligible course access, review of a payment issue, consideration of a refund under the applicable terms and law, or another appropriate corrective measure.
                </p>
                <p>
                  Each grievance shall be assessed on its merits. Submission of a complaint does not automatically entitle the complainant to a refund or any particular outcome; however, all applicable contractual and statutory rights will be respected.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">7. Escalation</h2>
                <p className="mb-3">
                  If a complainant is dissatisfied with the response received, they may request further review by replying to the existing grievance email or writing to:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3 space-y-1 text-xs">
                  <p><strong>Email:</strong> <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline font-medium">invesone.social@gmail.com</a></p>
                  <p><strong>Suggested subject line:</strong> Escalation – Grievance – INVESONE LLP</p>
                </div>
                <p className="mb-3">
                  The complainant should include the original complaint reference, if available, and explain the reason for requesting further review.
                </p>
                <p className="mb-3">
                  The Grievance Officer may refer the matter to the relevant designated partner or other authorised personnel where appropriate.
                </p>
                <p>
                  Internal escalation does not prevent a complainant from exercising any statutory right or pursuing any remedy available under applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">8. Fairness and Confidentiality</h2>
                <p className="mb-3">
                  INVESONE LLP will endeavour to handle grievances objectively, respectfully and fairly.
                </p>
                <p className="mb-3">
                  Information received during grievance handling will be accessed and used only as reasonably necessary to investigate, respond to and resolve the complaint, comply with legal obligations, protect legal rights or address legitimate security and fraud-prevention concerns.
                </p>
                <p className="mb-3">
                  Personal information will be handled in accordance with applicable data-protection laws and the company's Privacy Policy.
                </p>
                <p>
                  The company will take reasonable steps to restrict access to grievance records to authorised personnel who require such access for legitimate purposes.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">9. Grievance Records and Service Improvement</h2>
                <p className="mb-3">
                  INVESONE LLP may maintain records of complaints, acknowledgements, relevant communications, supporting documents, actions taken and resolutions, as required by applicable law and its legitimate operational needs.
                </p>
                <p className="mb-3">
                  The company may review grievance records periodically to identify recurring concerns and improve its educational services, administrative procedures and customer support.
                </p>
                <p>
                  Records will be retained and disposed of in accordance with applicable legal requirements and appropriate retention practices.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">10. External Consumer Remedies</h2>
                <p>
                  Nothing in this Policy limits any right or remedy available to a complainant under applicable law. A complainant may approach an appropriate consumer authority or forum where available, in accordance with applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">11. Changes to This Policy</h2>
                <p className="mb-3">
                  INVESONE LLP may update this Policy to reflect changes in its services, grievance-handling procedures or applicable law.
                </p>
                <p className="mb-3">
                  The updated Policy will be published on the company's website, with the revised effective date where appropriate.
                </p>
                <p>
                  No provision of this Policy shall override a mandatory legal requirement or remove a right that cannot lawfully be excluded.
                </p>
              </section>

              <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">12. Contact</h2>
                <p className="mb-3">
                  For grievances or questions concerning this Policy, please contact:
                </p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs text-gray-800">
                  <p className="font-bold text-sm text-[#0f172a]">INVESONE LLP</p>
                  <p>Website: <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] hover:underline">https://invesone.com/</a></p>
                  <p>Grievance Officer: <strong>Rakhi Das</strong></p>
                  <p>Email: <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">invesone.social@gmail.com</a></p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  This Policy is intended to provide a clear and accessible process for grievance redressal and shall be read subject to applicable law.
                </p>
              </section>

              {/* Sign-off */}
              <div className="pt-8 border-t border-gray-200 text-center font-semibold text-gray-800">
                <p className="text-base font-extrabold text-[#0f172a]">INVESONE LLP</p>
                <p className="text-sm text-[var(--lp-gold-bright)] mt-1">Be the One.</p>
              </div>

            </div>
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
