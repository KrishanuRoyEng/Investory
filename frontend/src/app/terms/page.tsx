import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import '@/app/landing.css';

export const metadata: Metadata = {
  title: 'Terms of Service | INVESONE',
  description: 'Terms of Service governing your access to and use of INVESONE LLP educational courses, live classes, webinars, and services.',
};

export default function TermsPage() {
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
            <span className="text-gray-800">Terms of Service</span>
          </nav>

          {/* White Card Document */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-12 md:p-16">
            
            {/* Header */}
            <div className="text-center mb-10 pb-6 border-b border-gray-100">
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0f172a]">
                TERMS OF SERVICE
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
                  Welcome to INVESONE LLP (“INVESONE”, “we”, “us” or “our”).
                </p>
                <p className="mb-3">
                  These Terms of Service (“Terms”) govern your access to and use of our website,{' '}
                  <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] font-medium hover:underline">
                    https://invesone.com/
                  </a>
                  , and the educational courses, live classes, webinars, learning materials and related services offered by INVESONE.
                </p>
                <p className="mb-3">
                  Please read these Terms carefully before enrolling in a course or using a paid service. By accepting these Terms during enrolment, confirming your acceptance through an authorised communication channel, or proceeding with enrolment after receiving these Terms, you agree to be bound by them, subject to applicable law.
                </p>
                <p className="mb-3">
                  Where enrolment is handled through a counsellor, email, telephone, WhatsApp or another authorised channel, the applicable course information, payment terms and these Terms will be communicated through that process. An enquiry alone does not constitute enrolment or acceptance of a paid course.
                </p>
                <p className="mb-3">
                  Additional conditions may apply to a particular course, programme, webinar or offer. These conditions will be communicated where relevant before payment. If a course-specific condition conflicts with these Terms, the specific condition will apply only to the extent that it clearly addresses the matter and is consistent with applicable law.
                </p>
                <p>
                  If you do not agree to these Terms, you should not proceed with the relevant enrolment or use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">2. About INVESONE</h2>
                <p className="mb-3">
                  INVESONE LLP is an education-focused business offering learning opportunities in stock markets, investing, trading, capital markets and related subjects.
                </p>
                <p className="mb-3">
                  Our objective is to make financial-market education more understandable and accessible while helping learners develop knowledge, analytical thinking, risk awareness and disciplined decision-making.
                </p>
                <p className="mb-2 font-medium text-gray-800">Depending on the programme, our services may include:</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Live instructor-led online courses.</li>
                  <li>Educational webinars, workshops, seminars and classes.</li>
                  <li>Learning materials, presentations, notes, assignments and exercises.</li>
                  <li>Recordings of selected classes, where included in the relevant course.</li>
                  <li>Assessments, doubt-solving sessions and faculty interactions, where offered.</li>
                  <li>Other educational resources made available through our website or authorised third-party platforms.</li>
                </ul>
                <p>
                  The specific services included in an enrolment will be those communicated for the relevant course or programme.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">3. Educational Purpose and Financial Disclaimer</h2>
                <p className="mb-3">
                  INVESONE provides educational services. Our content is intended to help learners understand financial markets, investment concepts, trading methods, technical and fundamental analysis, derivatives, market psychology and related topics.
                </p>
                <p className="mb-3">
                  Unless separately offered through an appropriately authorised service and expressly agreed in writing, our educational services do not constitute personalised investment advice, portfolio management, brokerage, trade execution, management of client funds or any other regulated financial service.
                </p>
                <p className="mb-3">
                  Any discussion of securities, financial instruments, companies, market movements, strategies, charts or trading setups is for educational purposes. It must not automatically be treated as a recommendation to buy, sell or hold any security or financial instrument.
                </p>
                <p className="mb-3">
                  Examples, demonstrations, case studies and hypothetical scenarios are illustrative and may not reflect actual market conditions or outcomes. Information may become outdated as market conditions, regulations or industry practices change.
                </p>
                <p className="mb-3">
                  You remain responsible for your own financial decisions. If you require advice tailored to your financial circumstances, you should consult an appropriately qualified and authorised professional.
                </p>
                <p>
                  Nothing in these Terms represents that INVESONE is endorsed by, affiliated with or approved by SEBI, NISM or another regulator or institution unless such status is expressly and accurately stated.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">4. Eligibility and Learners Under 18</h2>
                <p className="mb-3">
                  Our courses may be suitable for learners with different levels of experience, subject to the prerequisites communicated for the relevant programme.
                </p>
                <p className="mb-3">
                  Learners under the age of 18 may participate only through an appropriate parent or legal guardian arrangement, with the consent and involvement required by applicable law. A parent or legal guardian must review and accept the relevant terms and authorise enrolment and payment where necessary.
                </p>
                <p className="mb-3">
                  INVESONE may request reasonable confirmation of age or guardian consent. We may decline or suspend enrolment if required consent or safeguards are not provided.
                </p>
                <p>
                  By enrolling, you confirm that the information supplied by you or your parent or legal guardian is accurate and complete. You must not impersonate another person, provide misleading information or use another learner’s credentials without authorisation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">5. Website Access and Availability</h2>
                <p className="mb-3">
                  We endeavour to keep our website and educational services reasonably accessible. However, we do not guarantee uninterrupted or error-free access at all times.
                </p>
                <p className="mb-3">
                  Access may be affected by maintenance, technical problems, internet connectivity, third-party platform outages, security concerns or circumstances beyond our reasonable control.
                </p>
                <p className="mb-3">
                  We may update or modify website features, course materials or services where reasonably necessary. Where a material change affects a paid course, we will endeavour to communicate the change and address its impact in accordance with the applicable course terms and law.
                </p>
                <p>
                  You are responsible for maintaining suitable internet connectivity, compatible devices and any software reasonably required to access online services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">6. Enquiries, Enrolment and Course Information</h2>
                <p className="mb-3">
                  Enquiries and enrolments may be handled through our counsellors, email, WhatsApp, telephone or other authorised communication channels.
                </p>
                <p className="mb-2 font-medium text-gray-800">
                  Before payment, you should review the information provided for your course, including, where applicable:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Course name, scope and learning objectives.</li>
                  <li>Fees and applicable taxes.</li>
                  <li>Delivery method and proposed schedule.</li>
                  <li>Course duration and access period.</li>
                  <li>Availability and duration of recording access.</li>
                  <li>Prerequisites, attendance expectations and completion requirements.</li>
                  <li>Certificate eligibility, if offered.</li>
                  <li>Cancellation and refund conditions.</li>
                </ul>
                <p className="mb-3">
                  An enquiry, discussion with a counsellor or expression of interest does not guarantee enrolment. Enrolment is subject to course availability, any applicable eligibility requirements, confirmation by INVESONE and the agreed payment arrangement.
                </p>
                <p>
                  Please retain your enrolment confirmation, payment receipt and relevant course communications. If you believe you have paid but have not received confirmation, contact us using the details in Section 25.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">7. Fees, Payments and Taxes</h2>
                <p className="mb-3">
                  Course fees, payment methods and payment instructions will be communicated through the relevant course information, invoice, written offer or authorised enrolment communication.
                </p>
                <p className="mb-3">
                  Payments may be accepted through bank transfer, UPI or another payment method authorised by INVESONE.
                </p>
                <p className="mb-3">
                  Before making payment, verify the payment recipient and instructions. Do not transfer money to an individual or account claiming to represent INVESONE unless the arrangement has been confirmed through an authorised communication channel.
                </p>
                <p className="mb-3">
                  Applicable taxes will be charged or identified as required by law. The relevant course communication or invoice will state the payable amount and any applicable payment conditions.
                </p>
                <p className="mb-3">
                  Discounts, promotional offers and early-enrolment benefits may be subject to eligibility requirements and validity periods communicated to you. An offer is not guaranteed to remain available after its stated validity period.
                </p>
                <p>
                  Any price reduction or promotional pricing will be communicated in accordance with applicable law. Nothing in this section permits misleading price representations or unfair commercial practices.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">8. Course Delivery and Scheduling</h2>
                <p className="mb-3">
                  Our courses are primarily intended to be delivered online through live classes, webinars or other formats specified for the relevant programme.
                </p>
                <p className="mb-3">
                  Course schedules may be arranged individually, depending on the programme, faculty availability, learner requirements and operational considerations. The schedule communicated during enrolment will apply unless a change is agreed or subsequently notified.
                </p>
                <p className="mb-3">
                  We will make reasonable efforts to communicate material schedule changes in advance where practicable. A class may need to be postponed, rescheduled or delivered through an alternative format or instructor because of illness, technical problems, operational requirements or circumstances beyond our reasonable control.
                </p>
                <p className="mb-3">
                  Where a live session is rescheduled, we will endeavour to provide a reasonable alternative arrangement. Material changes to the promised course scope or delivery will be addressed in accordance with the applicable course terms and law.
                </p>
                <p>
                  Learners are responsible for attending sessions at the communicated times and meeting any reasonable attendance or participation requirements disclosed for their course.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">9. Recordings and Access to Learning Materials</h2>
                <p className="mb-3">
                  Recordings of live classes may be provided for selected courses. Whether recordings are included, which sessions are recorded and how long recordings remain accessible will be communicated for the relevant course.
                </p>
                <p className="mb-3">
                  Recording access is not automatic for every programme and is not necessarily permanent. Access may expire at the end of the stated course-specific access period.
                </p>
                <p className="mb-2 font-medium text-gray-800">
                  Unless INVESONE expressly authorises otherwise in writing, you must not:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Download, copy, reproduce or redistribute course recordings.</li>
                  <li>Share recordings, access links, login credentials or restricted course materials with another person.</li>
                  <li>Upload recordings or restricted materials to social media, public websites, file-sharing services or other distribution channels.</li>
                  <li>Record live sessions through screen-recording software, cameras or other devices without prior written permission.</li>
                  <li>Sell, sublicense, commercially exploit or make restricted materials available to third parties.</li>
                  <li>Circumvent access controls or technical restrictions designed to protect course content.</li>
                </ul>
                <p className="mb-3">
                  These restrictions apply to course recordings, presentations, notes, assignments and other protected learning materials, subject to express permission granted by INVESONE and rights that cannot lawfully be restricted.
                </p>
                <p className="mb-3">
                  Where downloadable resources are expressly provided, they may be used only for the permitted personal educational purposes. Any permission to access a resource does not transfer ownership of that resource.
                </p>
                <p>
                  Unauthorised recording, reproduction or distribution may result in suspension or termination of access and further action where appropriate and legally permissible.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">10. Certificates and Completion Requirements</h2>
                <p className="mb-3">
                  INVESONE may issue its own participation or course-completion certificates for selected programmes.
                </p>
                <p className="mb-3">
                  Where a certificate is offered, eligibility may depend on attendance, participation, assignments, assessments or other completion criteria communicated for the relevant course.
                </p>
                <p className="mb-3">
                  An INVESONE certificate indicates participation or completion according to the stated programme requirements. It is not, by itself, a professional licence, university degree, government qualification or regulatory authorisation.
                </p>
                <p className="mb-3">
                  Unless expressly confirmed in writing, enrolment does not include a certificate issued by NISM, SEBI or another external institution or regulator.
                </p>
                <p>
                  Participation in examination-preparation content does not guarantee examination success or entitlement to an external qualification or certificate.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">11. No Guaranteed Financial or Career Outcomes</h2>
                <p className="mb-3">
                  Financial markets involve risk. Education and analytical knowledge cannot eliminate market risk or guarantee a particular result.
                </p>
                <p className="mb-3">
                  INVESONE does not guarantee profits, returns, income, recovery of losses, successful trading or investment performance, examination results, employment, placement, promotion or career advancement.
                </p>
                <p className="mb-3">
                  Learners may achieve different outcomes depending on their experience, understanding, decisions, circumstances and market conditions.
                </p>
                <p>
                  You should not make a financial decision solely because a concept, strategy or instrument was discussed in a course. You are responsible for independently evaluating information and the risks associated with any action you choose to take.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">12. Intellectual Property</h2>
                <p className="mb-3">
                  Unless otherwise stated, the INVESONE name, logo, website content, original course materials, presentations, graphics, recordings and other materials created or supplied by INVESONE are owned by INVESONE or used under appropriate permission or licence.
                </p>
                <p className="mb-3">
                  Access to a course or website does not transfer ownership of intellectual property to you.
                </p>
                <p className="mb-3">
                  Subject to these Terms, enrolled learners receive a limited, non-exclusive, non-transferable and revocable permission to access the relevant materials for personal educational purposes during the applicable access period.
                </p>
                <p className="mb-3">
                  You must not reproduce, modify, publish, distribute, commercially exploit or create derivative works from protected materials without prior written permission, except where permitted by applicable law.
                </p>
                <p>
                  Nothing in this section restricts rights or exceptions that cannot lawfully be excluded.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">13. Acceptable Conduct</h2>
                <p className="mb-2 font-medium text-gray-800">
                  Learners are expected to behave respectfully and responsibly during classes, webinars, discussions and interactions with INVESONE representatives and other participants. You must not:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>Harass, threaten, abuse or unlawfully discriminate against another person.</li>
                  <li>Deliberately disrupt classes or interfere with other learners’ participation.</li>
                  <li>Share another learner’s personal information without appropriate permission.</li>
                  <li>Use our services for unlawful, fraudulent or misleading purposes.</li>
                  <li>Misuse course materials, access credentials or technical facilities.</li>
                  <li>Attempt unauthorised access to our website, systems or restricted learning areas.</li>
                  <li>Falsely claim to represent, work for or be officially affiliated with INVESONE.</li>
                </ul>
                <p>
                  We may take reasonable and proportionate action where conduct materially affects safety, privacy, lawful operations, course integrity or the learning experience of others.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">14. Suspension or Termination of Access</h2>
                <p className="mb-2 font-medium text-gray-800">
                  INVESONE may suspend or terminate access to a course, learning material or service where reasonably necessary, including where:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>A learner materially breaches these Terms or the applicable course conditions.</li>
                  <li>Recordings or restricted course materials are shared without authorisation.</li>
                  <li>There is serious misconduct, harassment, disruption or misuse of the service.</li>
                  <li>Unauthorised access, fraud or a material security risk is reasonably suspected.</li>
                  <li>Payment is overdue or a payment reversal requires investigation.</li>
                  <li>Suspension or termination is required by law or a competent authority.</li>
                </ul>
                <p className="mb-3">
                  Where reasonably practicable, we will communicate the reason for suspension and provide an opportunity to clarify or remedy the issue. Immediate action may be necessary to address serious misconduct, security concerns, suspected unlawful activity or urgent risks to other learners.
                </p>
                <p className="mb-3">
                  Any action will be proportionate to the circumstances and subject to applicable law. Suspension or termination does not automatically determine refund eligibility or remove statutory rights. Any refund or other remedy will be assessed under the applicable course terms and law.
                </p>
                <p>
                  Learners may contact us if they believe access has been suspended in error.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">15. Cancellation, Withdrawal and Refunds</h2>
                <p className="mb-3">
                  Refund eligibility will be assessed on a case-by-case basis, taking into account the course-specific terms disclosed before payment, the timing and reason for the request, the extent of services already delivered, the access provided and applicable law.
                </p>
                <p className="mb-3">
                  Different courses may have different cancellation and refund conditions. These conditions should be communicated before payment so that learners can make an informed decision.
                </p>
                <p className="mb-3">
                  Requests should be sent to{' '}
                  <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] font-medium hover:underline">
                    invesone.social@gmail.com
                  </a>{' '}
                  with the learner’s name, course details, payment reference and a brief explanation. We may request reasonable additional information to verify the enrolment and assess the request.
                </p>
                <p className="mb-3">
                  We will review requests fairly and communicate our decision within a reasonable period. If a refund is approved, we will communicate the amount and expected processing arrangements. The actual processing time may depend on the payment method and financial institution.
                </p>
                <p className="mb-3">
                  Course-specific conditions may address withdrawal after classes begin, missed sessions, rescheduling, duplicate payments, technical difficulties and other relevant circumstances.
                </p>
                <p>
                  No provision of these Terms is intended to exclude or restrict a cancellation right, refund, remedy or consumer protection that is mandatory under applicable law. Nothing in this section authorises INVESONE to retain money where a refund is legally required.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">16. Third-Party Platforms and Services</h2>
                <p className="mb-3">
                  INVESONE may use third-party services to support its website, communications, payment processing and educational delivery. These may include video-conferencing platforms, email services, messaging applications, payment providers, hosting services and other technology providers.
                </p>
                <p className="mb-3">
                  Your use of a third-party platform may be subject to that provider’s terms and privacy policy.
                </p>
                <p className="mb-3">
                  We do not control every aspect of third-party services, including their availability, technical performance or independent data practices. This does not remove any responsibility that applicable law places on INVESONE for its own services or conduct.
                </p>
                <p>
                  Learners should use third-party platforms responsibly and avoid sharing unnecessary sensitive information during classes or communications.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">17. Privacy and Personal Information</h2>
                <p className="mb-3">
                  INVESONE may process personal information for purposes such as responding to enquiries, managing enrolments, verifying payments, providing educational services, communicating course updates, maintaining records, addressing complaints and meeting legal obligations.
                </p>
                <p className="mb-3">
                  Our Privacy Policy, available through our website, explains our handling of personal information in greater detail.
                </p>
                <p className="mb-3">
                  Depending on the service used, information may be processed through email, messaging applications, video-conferencing platforms, payment services and other service providers.
                </p>
                <p>
                  We will handle personal information in accordance with applicable law and the privacy commitments that apply to the relevant processing. Learners may use the contact channel specified in our Privacy Policy to raise privacy-related requests.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">18. Communications and Promotional Messages</h2>
                <p className="mb-3">
                  We may contact you about an enquiry, enrolment, payment, course schedule, access instructions, support request or other matter relating to a service you have requested.
                </p>
                <p className="mb-3">
                  Where appropriate and permitted by law, we may also communicate information about courses, webinars, educational resources or offers.
                </p>
                <p className="mb-3">
                  You may request to stop receiving promotional communications by following available opt-out instructions or contacting us. Essential service-related or legally required communications may continue where necessary.
                </p>
                <p>
                  We will handle communication preferences and consent in accordance with applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">19. External Links and Third-Party Content</h2>
                <p className="mb-3">
                  Our website or educational materials may contain links to external websites, articles, platforms or resources for convenience or educational reference.
                </p>
                <p className="mb-3">
                  Such links do not necessarily imply endorsement by INVESONE. We do not control all third-party content, services, terms or privacy practices.
                </p>
                <p>
                  You should independently assess external information and review the applicable terms before using third-party services or relying on external content.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">20. Disclaimers and Limitation of Liability</h2>
                <p className="mb-3">
                  We endeavour to provide educational services and materials with reasonable care. However, educational information may contain errors, omissions or content that becomes outdated as markets, laws, technology and industry practices change.
                </p>
                <p className="mb-3">
                  To the extent permitted by law, we do not guarantee that our website or every item of educational content will be uninterrupted, error-free, suitable for every individual purpose or available at all times.
                </p>
                <p className="mb-3">
                  Subject to applicable law, INVESONE is not responsible for financial losses arising solely from independent financial decisions made by a learner, market movements or a learner’s treatment of general educational content as personalised financial advice.
                </p>
                <p className="mb-3">
                  To the extent permitted by law, INVESONE will not be liable for indirect or consequential losses that could not reasonably have been anticipated in the circumstances.
                </p>
                <p>
                  Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by law, including liability that cannot lawfully be excluded and rights or remedies available to consumers under applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">21. Responsibility for Unlawful Conduct</h2>
                <p className="mb-3">
                  To the extent permitted by law, you may be responsible for losses or reasonable costs directly resulting from your unlawful conduct, deliberate misuse of the services, infringement of another person’s rights or material breach of these Terms, where those losses are legally recoverable from you.
                </p>
                <p>
                  This provision does not require you to indemnify INVESONE for its own unlawful conduct or for liabilities that cannot lawfully be transferred to you.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">22. International Enrolment</h2>
                <p className="mb-3">
                  INVESONE is initially focused on providing educational services from India. We may consider enrolments from outside India on a case-by-case basis.
                </p>
                <p className="mb-3">
                  International enrolment is subject to confirmation by INVESONE, course availability, payment arrangements, technical access and applicable legal requirements. Access to our website from another country does not guarantee that every course is available there.
                </p>
                <p className="mb-3">
                  Before accepting an international enrolment, INVESONE may assess relevant legal, tax, payment and operational considerations. We may decline an enrolment where we reasonably determine that the service cannot lawfully or practically be provided.
                </p>
                <p>
                  Fees, taxes, currency conversion and other relevant payment arrangements will be communicated before enrolment where applicable. Nothing in this section transfers to learners a legal obligation that applicable law places on INVESONE.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">23. Changes to These Terms</h2>
                <p className="mb-3">
                  We may revise these Terms to reflect changes in our services, operations, technology, business practices or legal obligations.
                </p>
                <p className="mb-3">
                  The updated version will be published on our website with a revised “Last Updated” date. Where a change materially affects an existing learner’s paid course, we will take reasonable steps to communicate the change where required or appropriate.
                </p>
                <p className="mb-3">
                  Changes will not retrospectively remove rights that have already accrued or override mandatory legal protections.
                </p>
                <p>
                  Where fresh acceptance is required by law, we will seek that acceptance. Continued use of a service after revised Terms take effect will be subject to the revised Terms only to the extent legally permissible.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">24. Governing Law and Dispute Resolution</h2>
                <p className="mb-3">
                  These Terms are governed by the laws of India, subject to applicable legal principles and mandatory consumer protections.
                </p>
                <p className="mb-3">
                  If you have a concern, complaint or dispute relating to our services, we encourage you to contact us first so that we can attempt to resolve the matter fairly and informally.
                </p>
                <p className="mb-3">
                  If the matter cannot be resolved through direct communication, either party may pursue remedies available under applicable law before a competent court, consumer commission, tribunal or other appropriate forum.
                </p>
                <p>
                  Nothing in these Terms requires a learner to waive a statutory consumer remedy or submit to a dispute-resolution arrangement that is invalid or unenforceable under applicable law.
                </p>
              </section>

              <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">25. Contact and Complaints</h2>
                <p className="mb-3">
                  For course enquiries, enrolment-related questions, service concerns, cancellation or refund requests, and general communications, contact:
                </p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4 space-y-1.5 text-xs text-gray-800">
                  <p className="font-bold text-sm text-[#0f172a]">INVESONE LLP</p>
                  <p>Website: <a href="https://invesone.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] hover:underline">https://invesone.com/</a></p>
                  <p>Email: <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] hover:underline">invesone.social@gmail.com</a></p>
                  <p>Formal Business &amp; Compliance Correspondence: <a href="mailto:invesone.info@gmail.com" className="text-[var(--brand-blue)] hover:underline">invesone.info@gmail.com</a></p>
                </div>
                <p className="mb-3">
                  For privacy-related requests, contact{' '}
                  <a href="mailto:invesone.social@gmail.com" className="text-[var(--brand-blue)] font-medium hover:underline">
                    invesone.social@gmail.com
                  </a>{' '}
                  and identify your communication as a privacy matter.
                </p>
                <p className="mb-3">
                  Please include relevant details, such as your name, course name and payment reference where applicable, so that your enquiry can be identified and addressed.
                </p>
                <p>
                  Where applicable law requires a designated grievance officer or additional customer-care disclosures, INVESONE will publish the required name, designation and contact details in the appropriate website disclosure area and operate the complaint-handling process in accordance with the applicable requirements.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#0f172a] mb-3">26. General Provisions</h2>
                <ul className="space-y-2.5">
                  <li>
                    <strong className="text-gray-900">Entire agreement:</strong> These Terms, together with the applicable course-specific terms, Privacy Policy and any other expressly applicable policies, govern the relevant services.
                  </li>
                  <li>
                    <strong className="text-gray-900">Severability:</strong> If a provision is found to be invalid or unenforceable, the remaining provisions will continue to apply to the extent legally permissible.
                  </li>
                  <li>
                    <strong className="text-gray-900">No waiver:</strong> A failure or delay in enforcing a provision does not automatically waive the right to enforce it later.
                  </li>
                  <li>
                    <strong className="text-gray-900">Transfer of enrolment:</strong> You may not transfer your enrolment or course access to another person without prior written permission from INVESONE.
                  </li>
                  <li>
                    <strong className="text-gray-900">Force majeure:</strong> INVESONE will not be responsible for delays or interruptions caused by circumstances beyond its reasonable control, to the extent recognised by applicable law. Where such circumstances materially affect a paid service, reasonable arrangements will be considered under the applicable course terms and law.
                  </li>
                  <li>
                    <strong className="text-gray-900">Relationship:</strong> These Terms do not create an employment, partnership, agency, investment-advisory or fiduciary relationship between INVESONE and a learner.
                  </li>
                  <li>
                    <strong className="text-gray-900">Mandatory rights:</strong> Nothing in these Terms is intended to exclude, waive or restrict a right or obligation that cannot lawfully be excluded, waived or restricted.
                  </li>
                </ul>
              </section>

              {/* Sign-off */}
              <div className="pt-8 border-t border-gray-200 text-center font-semibold text-gray-800">
                <p className="text-base font-extrabold text-[#0f172a]">INVESONE LLP</p>
                <p className="text-sm text-[var(--lp-gold-bright)] mt-1">Be the One</p>
              </div>

            </div>
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
