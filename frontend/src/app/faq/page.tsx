import { SiteHeader } from "@/components/layouts/SiteHeader";
import { SiteFooter } from "@/components/layouts/SiteFooter";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-12">
          {/* About INVESONE */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">About INVESONE</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is INVESONE?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE is a capital-markets education platform focused on structured learning in areas such as technical analysis, fundamental analysis, trading, investing, derivatives, market psychology, risk management and related market concepts. Our approach combines expert-led instruction, practical application and disciplined decision-making.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Who can learn with INVESONE?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE offers learning programs for beginners as well as learners seeking intermediate or advanced knowledge. Beginner programs do not require prior stock-market knowledge or experience. Certain advanced or specialized programs may be easier to understand with foundational knowledge or prior market exposure, and learners are advised accordingly before enrollment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Are INVESONE courses suitable for complete beginners?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Beginner-level programs are designed for learners with little or no prior knowledge of the stock market. Learners can start with foundational concepts and progressively develop their understanding.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide courses only for traders?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE's programs may cover trading, investing, technical analysis, fundamental analysis, derivatives, market psychology, risk management and other areas of capital-markets education. The appropriate course depends on the learner's objectives and existing level of knowledge.</p>
              </div>
            </div>
          </section>

          {/* Courses & Learning */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Courses & Learning</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Are INVESONE courses conducted online or offline?</h3>
                <p className="text-foreground/70 leading-relaxed">During the initial phase, INVESONE courses are conducted online through live, instructor-led sessions. Physical classroom programs may be introduced in the future.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What languages are available?</h3>
                <p className="text-foreground/70 leading-relaxed">At launch, learning and support will be available in English, Hindi and Bengali. Additional Indian regional languages may be introduced as INVESONE expands.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What is the duration of an INVESONE course?</h3>
                <p className="text-foreground/70 leading-relaxed">Each course has its own defined standard duration. In exceptional circumstances, a limited extension may be provided when genuine issues affect the scheduled completion of the course.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What class schedules are available?</h3>
                <p className="text-foreground/70 leading-relaxed">Depending on the course and batch, INVESONE may offer weekday, weekday-evening, weekend-morning and weekend-evening schedules. Available schedules vary by batch.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE offer course bundles?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE will offer course bundles and structured learning programs designed to help learners progress through different stages of market education.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I upgrade my course or purchase a bundle later?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learners can upgrade from one course to another or move from an individual course to an applicable course bundle. Amounts already paid will be adjusted against the upgraded program, subject to the applicable terms.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What if a bundle includes a course I have already purchased?</h3>
                <p className="text-foreground/70 leading-relaxed">Applicable amounts already paid for previously purchased courses will be adjusted against the relevant bundle or upgraded program.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I attend a demo class before enrolling?</h3>
                <p className="text-foreground/70 leading-relaxed">Demo classes may be offered for selected courses and batches, depending on management's decision and availability. Demo classes are intended to help prospective learners understand the learning approach before enrollment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I see the complete syllabus before enrolling?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE provides broad information about the course, including its general subject areas, learning objectives and level. Detailed module-by-module curriculum and granular course content are provided to enrolled learners rather than being publicly disclosed in full before enrollment.</p>
              </div>
            </div>
          </section>

          {/* Practical Learning */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Practical Learning</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What will I receive as part of an INVESONE course?</h3>
                <p className="text-foreground/70 leading-relaxed">Depending on the course, learners may receive study notes, books or booklets, PDFs, assignments, class transcripts, assessments, quizzes, tests and case studies, along with access to live classes and applicable course recordings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE include practical learning?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learning may include situation-based analysis, pattern analysis, trade-decision exercises, risk-and-return considerations, profit-booking and loss-acceptance exercises, portfolio exercises, quizzes, tests and real-market case studies.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Will I receive course recordings?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learners enrolled in a course receive access to applicable class recordings, including recordings of classes they could not attend live.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Do I need to attend the live class to access the recording?</h3>
                <p className="text-foreground/70 leading-relaxed">No. Access to applicable course recordings and learning materials is not dependent on live-class attendance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How long will I have access to recordings and learning materials?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE intends to provide access for a substantial period. The exact access validity may vary according to the applicable course or program and will be communicated when finalized.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I download the recordings or learning materials?</h3>
                <p className="text-foreground/70 leading-relaxed">No. Course recordings and learning materials are provided through the INVESONE LMS or website and are not offered as downloadable files.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I access my course from multiple devices?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learners can access their enrolled course content through multiple devices, including desktops, laptops, tablets and mobile devices.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What happens if I have a technical problem?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE provides technical support for issues relating to LMS access, course recordings, learning materials and live-class access.</p>
              </div>
            </div>
          </section>

          {/* Enrollment & Payment */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Enrollment & Payment</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I enroll directly through the INVESONE website?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learners can select an available course and complete online enrollment and payment through the INVESONE website.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is enrollment confirmed immediately after payment?</h3>
                <p className="text-foreground/70 leading-relaxed">Payment must first be verified by INVESONE. Once payment verification is completed, an official enrollment confirmation will be provided along with the relevant batch and access information.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What information will I receive after enrollment?</h3>
                <p className="text-foreground/70 leading-relaxed">After successful payment verification, learners will receive relevant enrollment confirmation, batch details, class schedule, access instructions, trainer information and other applicable course information. Learning materials are intended to be made available before classes begin, where applicable.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Will I receive a payment receipt or invoice?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE will provide an applicable payment receipt or invoice following enrollment and payment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is the course fee displayed on the website?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. The standard course fee for each available course will be displayed on the INVESONE website.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I get a discount on the displayed course fee?</h3>
                <p className="text-foreground/70 leading-relaxed">Potentially. INVESONE may offer discounts, coupons, scholarships, bundle pricing and special offers. Learners may contact an educational counsellor to understand whether any applicable offer is available.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Are scholarships available?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Scholarship decisions are made by management on a case-by-case basis.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can different discounts or offers be combined?</h3>
                <p className="text-foreground/70 leading-relaxed">The applicable offer and final payable amount are determined by management on a case-by-case basis.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Are installment or EMI options available?</h3>
                <p className="text-foreground/70 leading-relaxed">The standard payment policy is full payment upfront. Installments, staged payments or other arrangements may be permitted in specific cases, subject to management approval.</p>
              </div>
            </div>
          </section>

          {/* Batch Changes & Course Continuity */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Batch Changes & Course Continuity</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I change my batch after enrollment?</h3>
                <p className="text-foreground/70 leading-relaxed">A batch change may be permitted in genuine circumstances, subject to management approval and availability. Batch changes are not automatic once a batch has commenced.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What if I cannot complete my course because of a genuine circumstance?</h3>
                <p className="text-foreground/70 leading-relaxed">In appropriate cases, INVESONE may allow a learner to complete the corresponding remaining portion of the course through a subsequent batch, subject to management approval and batch availability.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What happens if I pay but do not join my assigned batch?</h3>
                <p className="text-foreground/70 leading-relaxed">Your enrollment remains valid. The learner may subsequently take the applicable service, subject to the relevant arrangements, or resolve the payment through the applicable cancellation/refund process.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I repeat a course after completing it?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Learners may be permitted to repeat or rejoin the same course for revision purposes. A separate revision/rejoining fee may apply, which will generally be lower than the original course fee.</p>
              </div>
            </div>
          </section>

          {/* Certificates */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Certificates</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide a course-completion certificate?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Eligible learners who meet the applicable course-completion requirements will receive an INVESONE course-completion certificate.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a separate certificate fee?</h3>
                <p className="text-foreground/70 leading-relaxed">No. The course-completion certificate is included in the course fee.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">When will I receive my certificate?</h3>
                <p className="text-foreground/70 leading-relaxed">The digital certificate is expected to be issued within 7 days after the learner fulfills the applicable course-completion requirements.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Will the certificate be digital or physical?</h3>
                <p className="text-foreground/70 leading-relaxed">A digital course-completion certificate will be provided. Once INVESONE has an operational physical office/classroom facility, eligible learners may also be invited to collect a hard-copy certificate.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can the certificate be verified?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE certificates will contain a unique certificate number or Certificate ID and will have an online verification mechanism to help employers or other third parties verify their authenticity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What are the requirements for receiving a course-completion certificate?</h3>
                <p className="text-foreground/70 leading-relaxed">Certificate issuance is subject to the applicable completion requirements of the course. Attendance is an important requirement, while assignments, assessments and participation may also be considered where applicable.</p>
              </div>
            </div>
          </section>

          {/* NISM & Professional Development */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">NISM & Professional Development</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide NISM preparation?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE provides educational training and preparation for relevant NISM examinations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE issue NISM certification?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE does not issue NISM certification. Learners must appear for and successfully clear the relevant NISM examination to obtain the applicable NISM certification.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide career guidance?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE may provide career guidance to learners interested in developing a career in the capital-markets ecosystem.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide employment assistance?</h3>
                <p className="text-foreground/70 leading-relaxed">Where suitable opportunities are available, INVESONE may provide employment-related assistance, such as sharing relevant opportunities, facilitating introductions and assisting eligible learners with applications.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE guarantee employment?</h3>
                <p className="text-foreground/70 leading-relaxed">No. Employment is not guaranteed. Any employment opportunity depends on the learner's eligibility, qualifications, performance, available opportunities and the requirements of the relevant organization.</p>
              </div>
            </div>
          </section>

          {/* Support After the Course */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Support After the Course</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Will I receive support after completing my course?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE plans to provide periodic academic doubt-clearing sessions, faculty interaction and market-related discussions after course completion.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I ask questions after my live batch ends?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Applicable post-course academic support may include doubt-solving, faculty interaction and periodic learning or market discussions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Will INVESONE update learning materials after I complete my course?</h3>
                <p className="text-foreground/70 leading-relaxed">Where a significant new concept or relevant development requires additional educational content, INVESONE may provide specific additional or revised learning material even after course completion.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a student community?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE is evaluating the structure of its learner community and related initiatives. Any community-based services will be introduced subject to the applicable policies and arrangements.</p>
              </div>
            </div>
          </section>

          {/* Webinars & Free Educational Content */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Webinars & Free Educational Content</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide free educational content?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE may provide selected educational ideas, insights and learning content through social media, YouTube, webinars, seminars and other public channels.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Are INVESONE webinars free?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE may conduct webinars and seminars that provide educational and market-related insights. Where applicable, the organization may also introduce its courses and services during these sessions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Will everything provided by INVESONE be free?</h3>
                <p className="text-foreground/70 leading-relaxed">No. Public educational content may be available through selected free channels. Structured courses, programs and other enrolled services are paid offerings and are subject to their applicable fees and terms.</p>
              </div>
            </div>
          </section>

          {/* Refunds & Cancellations */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Refunds & Cancellations</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I request a refund after my course has started?</h3>
                <p className="text-foreground/70 leading-relaxed">A refund may be possible even after classes have begun, depending on the circumstances. Refund and cancellation requests are reviewed and decided by management on a case-by-case basis.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE offer a universal refund guarantee?</h3>
                <p className="text-foreground/70 leading-relaxed">No. Refund eligibility and the applicable resolution depend on the circumstances and the relevant terms of the enrollment.</p>
              </div>
            </div>
          </section>

          {/* Academic & Student Support */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Academic & Student Support</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there someone I can contact before choosing a course?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. INVESONE offers one-to-one pre-enrollment counselling to help prospective learners understand the available learning options and identify a suitable course based on their existing knowledge and objectives.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What if I do not have the foundation required for an advanced course?</h3>
                <p className="text-foreground/70 leading-relaxed">Learners are informed when foundational knowledge or prior market exposure is recommended for an advanced or specialized course. The purpose is to help learners make an informed enrollment decision and understand the level of the program before joining.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I receive individual academic help?</h3>
                <p className="text-foreground/70 leading-relaxed">Yes. Individual doubt-solving or additional support sessions may be provided where learners require extra academic assistance. Trainers and educational counsellors may assist according to the nature of the requirement.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Who handles non-academic issues?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE will have a dedicated student/customer support channel for matters such as enrollment, batch changes, access issues, payments and other non-academic queries.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How are grievances handled?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE will have a dedicated grievance-handling function supported by a customer relationship manager. Learner concerns are reviewed individually, with the aim of addressing genuine grievances fairly and appropriately.</p>
              </div>
            </div>
          </section>

          {/* Educational Integrity & Regulatory Boundaries */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Educational Integrity & Regulatory Boundaries</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide investment or trading advice?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE's courses and learner-support services are educational in nature. INVESONE does not provide personalized investment advice, trading advice, portfolio management or individualized buy/sell recommendations as part of its educational programs.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide buy or sell calls?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE's educational programs do not constitute personalized buy/sell recommendations or investment advice.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can INVESONE's courses guarantee trading or investment success?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE does not guarantee profits, returns or successful trading or investment outcomes. Results depend on an individual's knowledge, application, decisions, market conditions and numerous other factors.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can INVESONE guarantee a particular financial return?</h3>
                <p className="text-foreground/70 leading-relaxed">No. INVESONE does not guarantee or promise any specific financial return from applying the knowledge gained through its educational programs.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does completing an INVESONE course make someone a professional trader or investor?</h3>
                <p className="text-foreground/70 leading-relaxed">Course completion demonstrates completion of an educational program; it does not by itself establish professional competence, guarantee market success or authorize a learner to provide regulated financial services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Does INVESONE provide regulated financial services through its courses?</h3>
                <p className="text-foreground/70 leading-relaxed">INVESONE's role in its educational programs is to provide capital-markets education. Any separately provided regulated service, where applicable, would be distinct from the educational program and subject to the relevant regulatory framework and provider.</p>
              </div>
            </div>
          </section>

          <div className="mt-16 bg-surface/80 p-8 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-4">A Note for Learners</h3>
            <p className="text-foreground/70 leading-relaxed mb-4">
              INVESONE believes that meaningful market education is built on knowledge, practice, discipline and responsible decision-making—not shortcuts or promises.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              The purpose of our programs is to help learners understand markets more clearly, develop structured thinking and apply concepts responsibly. Market participation involves risk, and every learner remains responsible for their own financial decisions.
            </p>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
