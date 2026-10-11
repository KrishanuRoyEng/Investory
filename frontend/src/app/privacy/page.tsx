import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | INVESONE',
  description: 'Privacy Policy explaining how INVESONE LLP collects, uses, protects, and handles personal information across our website and educational services.',
};

export default function PrivacyPage() {
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
            <span className="text-gray-800">Privacy Policy</span>
          </nav>

          {/* White Card Document */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-12 md:p-16">
            
            {/* Header */}
            <div className="text-center mb-10 pb-6 border-b border-gray-100">
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0f172a]">
                PRIVACY POLICY
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
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">1. Introduction</h2>
                <p className="mb-3">
                  At INVESONE LLP (“INVESONE”, “we”, “our” or “us”), we believe that responsible financial education begins with knowledge, transparency and trust. We extend these principles to the way we collect and handle personal information.
                </p>
                <p className="mb-3">
                  This Privacy Policy explains how we collect, use, disclose, retain and protect personal information when you visit our website, submit an enquiry, request information about our courses, communicate with our team or participate in our educational activities.
                </p>
                <p className="mb-3">
                  Our aim is to collect information for appropriate purposes, handle it responsibly and respect the privacy choices of individuals who interact with us.
                </p>
                <p>
                  Please read this Policy carefully before submitting personal information through our website, forms or communication channels.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">2. About INVESONE LLP</h2>
                <p className="mb-3">
                  INVESONE LLP is an India-based limited liability partnership providing educational services relating to trading, investing and capital markets.
                </p>
                <p className="mb-3">
                  We operate primarily through online channels, with a focus on helping individuals develop financial knowledge, analytical thinking, risk awareness and disciplined decision-making.
                </p>
                <p className="mb-3">
                  This Privacy Policy applies to our website at{' '}
                  <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] font-medium hover:underline">
                    https://invesone.com/
                  </a>{' '}
                  and to relevant personal information collected through our enquiry forms, email, telephone, WhatsApp and other communication or educational platforms used by us.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3 space-y-1 text-xs">
                  <p><strong className="text-gray-900">Legal entity:</strong> INVESONE LLP</p>
                  <p><strong className="text-gray-900">Website:</strong> <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] hover:underline">https://invesone.com/</a></p>
                  <p><strong className="text-gray-900">Privacy contact:</strong> <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">invesone.social@gmail.com</a></p>
                </div>
                <p>
                  Our services and website features may evolve over time. This Policy describes our intended data-handling practices and should be read in conjunction with any additional privacy notice presented when you use a particular service or feature.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">3. Personal Information We Collect</h2>
                <p className="mb-4">
                  The information we collect depends on how you interact with INVESONE. You may browse publicly available website content without providing personal information unless a particular feature or activity requires it.
                </p>

                <div className="space-y-4 pl-1">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">3.1 Information You Provide</h3>
                    <p className="mb-2">When you submit an enquiry, request course information or communicate with us, we may collect:</p>
                    <ul className="list-disc pl-5 space-y-1.5 mb-2">
                      <li><strong>Name:</strong> To identify and address you appropriately.</li>
                      <li><strong>Mobile number:</strong> To respond to enquiries and communicate about courses or enrolment.</li>
                      <li><strong>Email address:</strong> To provide requested information and relevant course-related communications.</li>
                      <li><strong>Course interests and enquiry details:</strong> To understand your learning requirements and respond appropriately.</li>
                    </ul>
                    <p>
                      If you enrol in a course, we may collect additional information reasonably necessary for enrolment, course administration, payment verification, learner support and compliance with applicable legal obligations. Where additional information is requested, we will explain its purpose at the relevant point of collection where required.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">3.2 Payment-Related Information</h3>
                    <p className="mb-2">
                      Payments for our educational services may be made through bank transfer, UPI or other payment methods that we may introduce.
                    </p>
                    <p className="mb-2">
                      Depending on the payment method, we may collect or maintain transaction references, payment amounts, payment dates, payer details and other information reasonably necessary to verify payments and maintain business records.
                    </p>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                      Notice: We do not require your UPI PIN, bank password, card PIN or one-time password (OTP) to verify a payment. Please do not share these credentials with us.
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">3.3 Technical Information</h3>
                    <p className="mb-2">
                      When you visit our website, certain technical information may be processed by the website infrastructure or third-party services supporting its operation. Depending on the configuration of those services, this may include IP addresses, browser and device information, referral details and website activity.
                    </p>
                    <p>
                      The specific analytics tools, cookies, advertising technologies and tracking services used on our website may change. We will provide appropriate information about relevant technologies and choices where required by applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">3.4 Educational and Learning Information</h3>
                    <p className="mb-2">
                      Where applicable, we may process information necessary to administer educational activities, such as enrolment details, session participation, learner communications, assignments, assessments and feedback.
                    </p>
                    <p>
                      The information collected will depend on the educational programme and the platforms used to deliver it. We do not represent that every course or website feature collects all the information listed in this section. If we introduce new learning-management features or learner accounts, we will provide relevant information about the personal data involved and its intended use.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">4. Purposes for Which We Use Personal Information</h2>
                <p className="mb-3">
                  We may use personal information, as relevant to your interaction with us, for the following purposes:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li><strong>Responding to enquiries:</strong> To answer questions about our courses, fees, course structure, learning formats and enrolment.</li>
                  <li><strong>Providing educational information:</strong> To explain our educational offerings and share information relevant to your stated learning interests.</li>
                  <li><strong>Enrolment and administration:</strong> To process enrolment requests, communicate instructions, verify payments and maintain appropriate records.</li>
                  <li><strong>Educational delivery:</strong> To coordinate online sessions, share learning materials and facilitate programme-related communication.</li>
                  <li><strong>Learner support:</strong> To address questions, feedback, complaints or issues relating to our services.</li>
                  <li><strong>Service improvement:</strong> To understand recurring enquiries and improve the clarity, accessibility and relevance of our educational offerings.</li>
                  <li><strong>Promotional communication:</strong> To communicate information about courses, webinars, educational events and related offerings, subject to applicable law and your communication preferences.</li>
                  <li><strong>Security and misuse prevention:</strong> To investigate suspected fraud, unauthorised activity or misuse of our website and communication channels.</li>
                  <li><strong>Legal and administrative purposes:</strong> To maintain appropriate business records and comply with applicable legal, tax, accounting and other lawful obligations.</li>
                </ul>
                <p>
                  We will handle personal information in accordance with applicable law and will provide any additional notice or obtain any consent required for the relevant processing.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">5. Consent and Communication Preferences</h2>
                <p className="mb-4">
                  We aim to explain why information is requested and to obtain consent wherever required by applicable law.
                </p>

                <div className="space-y-4 pl-1">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">5.1 Enquiry-Related Communication</h3>
                    <p>
                      When you submit an enquiry or request course information, we may contact you through telephone, WhatsApp or email to respond to your request and provide relevant course or enrolment details.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">5.2 Promotional Communication</h3>
                    <p className="mb-2">
                      We may communicate information about our courses, webinars, educational events and related offerings where permitted by law and consistent with your preferences.
                    </p>
                    <p className="mb-2">
                      Where separate consent is required for promotional communications, we will seek it separately from any consent or information necessary to respond to your enquiry or provide a requested service.
                    </p>
                    <p className="mb-2">
                      You may opt out of promotional communications by emailing{' '}
                      <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">
                        invesone.social@gmail.com
                      </a>{' '}
                      or informing us through the relevant communication channel.
                    </p>
                    <p>
                      Opting out of promotions will not necessarily stop essential communications concerning an existing enrolment, payment verification, a service you have requested or a legal obligation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">5.3 Withdrawal of Consent</h3>
                    <p className="mb-2">
                      Where processing is based on your consent, you may withdraw that consent by contacting us at{' '}
                      <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">
                        invesone.social@gmail.com
                      </a>.
                    </p>
                    <p className="mb-2">
                      Withdrawal does not affect the lawfulness of processing carried out before withdrawal. We will explain any material consequences where relevant. Certain information may still need to be retained or processed where permitted or required by law.
                    </p>
                    <p>
                      You may choose not to provide requested information. However, if the information is necessary to respond to your enquiry or provide a requested service, we may be unable to complete that activity.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">6. Sharing of Personal Information</h2>
                <p className="mb-3 font-medium text-gray-900">
                  INVESONE does not intend to sell personal information to third parties for their own independent marketing purposes.
                </p>
                <p className="mb-3">
                  We may share relevant personal information in the following circumstances:
                </p>

                <div className="space-y-4 pl-1">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">6.1 Service Providers and Platforms</h3>
                    <p className="mb-2">
                      We may use third-party services to support our educational and operational activities, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li><strong>Google Forms:</strong> For enquiry forms and information collection, where used.</li>
                      <li><strong>Email and telecommunications services:</strong> For responding to enquiries and communicating with learners.</li>
                      <li><strong>WhatsApp:</strong> For relevant enquiry follow-ups and course-related communications.</li>
                      <li><strong>Zoom and Google Meet:</strong> For online educational sessions, where used.</li>
                      <li><strong>Meta platforms:</strong> For advertising, lead generation and related communication activities, where used.</li>
                    </ul>
                    <p>
                      The information processed by each provider will depend on the service, its configuration and the activity concerned. We do not represent that every provider receives all information collected by INVESONE. Third-party providers may process information under their own terms, privacy policies and technical arrangements. Where appropriate, we will take reasonable steps to ensure that information shared on our behalf is limited to what is relevant to the activity.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">6.2 Professional Advisers and Operational Support</h3>
                    <p>
                      We may share relevant information with accountants, legal advisers, professional consultants and other service providers where reasonably necessary for business administration, legal compliance or the delivery of a requested service.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">6.3 Legal Requirements and Protection of Rights</h3>
                    <p>
                      We may disclose information when required by applicable law, valid legal process or a lawful direction from a competent authority. We may also disclose relevant information where reasonably necessary to investigate suspected fraud, address misuse, protect legal rights or safeguard our operations, subject to applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">6.4 Business Restructuring</h3>
                    <p>
                      If INVESONE undergoes a lawful restructuring, merger, transfer or similar transaction, relevant personal information may be transferred where legally permitted and subject to applicable requirements.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">7. Third-Party Websites and Services</h2>
                <p className="mb-3">
                  Our website or communications may contain links to external websites, applications, payment services or educational platforms.
                </p>
                <p className="mb-3">
                  These services may be operated independently of INVESONE and may have their own privacy policies, terms and security practices. We do not control the independent data-handling practices of third parties.
                </p>
                <p>
                  We encourage you to review the applicable terms and privacy policies before submitting personal information directly to an external service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">8. Cookies, Analytics and Advertising Technologies</h2>
                <p className="mb-3">
                  Our website or third-party services supporting it may use cookies and similar technologies to enable website functions, remember preferences, measure usage or support advertising.
                </p>
                <p className="mb-3">
                  The technologies used and their purposes will depend on the website's configuration and the services in operation. Where required by applicable law, we will provide appropriate notice and obtain consent before using technologies that require consent.
                </p>
                <p>
                  You may also manage cookies through your browser settings. Disabling certain cookies may affect some website functions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">9. Children and Individuals Under 18</h2>
                <p className="mb-3">
                  INVESONE recognises that individuals below 18 years of age may be interested in financial education. The collection and processing of children's personal data are subject to applicable legal requirements.
                </p>
                <p className="mb-3">
                  Individuals below 18 should not independently proceed with paid enrolment or submit personal information for that purpose without an appropriate process being established.
                </p>
                <p className="mb-3">
                  A parent or lawful guardian may contact{' '}
                  <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">
                    invesone.social@gmail.com
                  </a>{' '}
                  to discuss the appropriate process before providing a minor's personal information.
                </p>
                <p>
                  Where applicable law requires verifiable parental or guardian consent or imposes additional restrictions on processing children's personal data or targeted advertising to children, we will comply with those requirements. If you believe that a minor's personal information has been submitted to us without appropriate authorisation, please contact us so that we can review the matter and take appropriate action.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">10. Data Retention</h2>
                <p className="mb-3">
                  We seek to retain personal information only for as long as reasonably necessary for the purpose for which it was collected, subject to applicable legal and operational requirements. For example:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Enquiry information may be retained for a reasonable period to respond to enquiries and manage relevant follow-ups.</li>
                  <li>Enrolment and payment records may be retained for applicable accounting, tax, legal and dispute-related purposes.</li>
                  <li>Communication preferences may be retained to record and respect requests to opt out of promotional communications.</li>
                  <li>Learner-related information may be retained as reasonably necessary for educational administration, support and applicable legal obligations.</li>
                </ul>
                <p>
                  When personal information is no longer required, we will take appropriate steps to delete it or otherwise dispose of it, subject to applicable law and legitimate retention requirements. Where information is held by third-party providers or in backups, deletion may be subject to their technical capabilities and applicable retention arrangements.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">11. Data Security</h2>
                <p className="mb-3">
                  We recognise the importance of handling personal information responsibly and seek to implement reasonable safeguards appropriate to the nature of the information and our operations.
                </p>
                <p className="mb-3">
                  These safeguards are intended to protect personal information against unauthorised access, disclosure, alteration, loss or misuse. The specific safeguards used will depend on the systems and services involved. No method of electronic transmission or storage can be guaranteed to be completely secure, and we cannot promise absolute security.
                </p>
                <p>
                  If you suspect that personal information has been misused in connection with INVESONE, please contact us promptly at{' '}
                  <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] font-medium hover:underline">
                    invesone.social@gmail.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">12. Your Privacy Rights and Requests</h2>
                <p className="mb-3">Subject to applicable law, you may contact us to:</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Request information about personal information we hold or process about you.</li>
                  <li>Request correction or updating of inaccurate or incomplete information.</li>
                  <li>Request deletion of personal information where applicable.</li>
                  <li>Withdraw consent where processing is based on consent.</li>
                  <li>Opt out of promotional communications.</li>
                  <li>Raise a question, concern or grievance regarding the handling of your personal information.</li>
                </ul>
                <p className="mb-3">
                  We may need to verify your identity or authority before acting on a request. We may also retain information or limit a request where permitted or required by law. We will handle requests in accordance with applicable legal procedures and time limits.
                </p>
                <p>
                  To submit a privacy request, email{' '}
                  <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] font-medium hover:underline">
                    invesone.social@gmail.com
                  </a>{' '}
                  with the subject line “Privacy Request – INVESONE LLP”. Please provide sufficient information for us to identify the relevant interaction, but do not include passwords, OTPs or other authentication credentials.
                </p>
              </section>

              <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">13. Grievance Redressal and Privacy Contact</h2>
                <p className="mb-3">
                  For questions, requests or complaints relating to this Policy or the handling of personal information, please contact:
                </p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 mb-3 space-y-1 text-xs text-gray-800">
                  <p className="font-bold text-sm text-[#0f172a]">INVESONE LLP</p>
                  <p>Email: <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">invesone.social@gmail.com</a></p>
                  <p>Subject line: Privacy Request – INVESONE LLP</p>
                </div>
                <p className="mb-3">
                  INVESONE operates primarily through online channels. You may use the email address above for privacy-related correspondence.
                </p>
                <p className="mb-3">
                  Please describe your concern and provide sufficient details for us to review it. We will handle the matter in accordance with applicable law.
                </p>
                <p className="text-xs text-gray-500">
                  This contact is provided for privacy-related communication. It should not be interpreted as a representation that INVESONE has appointed a statutory Data Protection Officer or any other regulatory office-holder unless separately confirmed.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">14. Cross-Border Processing</h2>
                <p className="mb-3">
                  Some third-party services used for online meetings, communications, website infrastructure or advertising may process personal information outside India, depending on their technical arrangements and applicable service terms.
                </p>
                <p>
                  Where cross-border processing or transfers occur, INVESONE will take account of applicable Indian legal requirements and any relevant restrictions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">15. Changes to This Privacy Policy</h2>
                <p className="mb-3">
                  We may revise this Policy as our website, educational offerings, technology, communication practices or legal obligations evolve.
                </p>
                <p className="mb-3">
                  The latest version will be published on our website with an updated revision date. Where required by applicable law, we will provide notice of material changes or obtain consent for new or materially changed purposes of processing.
                </p>
                <p>
                  We encourage visitors and learners to review this Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">16. Governing Law</h2>
                <p className="mb-3">
                  This Policy is governed by the laws of India, subject to applicable legal requirements.
                </p>
                <p>
                  Nothing in this Policy is intended to exclude or restrict any right or remedy that cannot lawfully be excluded or restricted.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">17. Our Commitment</h2>
                <p className="mb-3">
                  At INVESONE, we believe that education should empower individuals to make more informed decisions. Respect for personal information is part of that responsibility.
                </p>
                <p className="mb-3">
                  We aim to communicate clearly, collect information for appropriate purposes and handle it responsibly. As our operations develop, we will review our privacy practices and update this Policy where necessary.
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
