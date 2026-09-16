**STOCKLEARN EDTECH PLATFORM**

*Stock Market Education & Learning Management System*

**SOFTWARE REQUIREMENTS SPECIFICATION (SRS)**

Frontend & Backend Documentation \| Project Roadmap \| Client
Deliverables

**Competitor / Reference Benchmarks:**

Invstory • Investmate • Elearnmarkets

Document Version 1.0

Prepared for Client Review \| September 2026

**Document Control**

  --------------------- -------------------------------------------------
  **Field**             **Details**

  Document Title        SRS & Project Documentation --- Stock Market
                        EdTech LMS

  Version               1.0 (Draft for Client Review)

  Prepared By           Project / Business Analysis Team

  Reference Websites    Invstory, Investmate, Elearnmarkets (competitor
                        benchmarks)

  Platform Type         EdTech LMS --- Stock Market Education

  Core Modules          Landing Page, Course Listing, Payment Gateway,
                        Account Dashboard, Live Classes / Doubt Clearing,
                        Webinars
  --------------------- -------------------------------------------------

**1. Introduction**

**1.1 Purpose**

This document defines the complete functional and technical requirements
for the proposed Stock Market EdTech platform. It serves three purposes:
(a) as a Software Requirements Specification (SRS) that engineering will
build against, (b) as a client-facing scope document describing exactly
what will be delivered and when, and (c) as a project roadmap covering
design, development, testing and launch phases.

**1.2 Project Overview**

The platform is a Learning Management System (LMS) focused on educating
retail users on stock market investing and trading. It will combine
self-paced video courses, live doubt-clearing classes, webinars, a
learner dashboard, and an integrated payment gateway for course and
subscription purchases --- positioning the product against established
players in this space.

**1.3 Competitor / Reference Benchmarking**

Three existing platforms have been used as functional and UX references.
Their key patterns inform the requirements in this document:

**Elearnmarkets**

-   Large catalogue of SEBI-oriented stock market courses (beginner to
    advanced), sold individually or as bundled mentorship programs.

-   Live and recorded webinars, technical analysis and options-trading
    content, downloadable eBooks/tools (SIP, EMI, CAGR calculators).

-   Learner dashboard with \'My Courses\', discussion-forum-based doubt
    resolution tied to specific video timestamps, and downloadable
    certificates.

**Investmate**

-   Structured, sequential learning paths (modules unlocked
    progressively) aimed at beginner-to-intermediate investors.

-   Strong emphasis on mobile-first course consumption and short-format
    lessons with progress tracking.

**Invstory**

-   Story/narrative-driven course content and a simplified, guided
    onboarding flow for first-time investors.

-   Lightweight course catalogue with a strong landing-page-to-signup
    conversion funnel.

These references establish the baseline feature set for this platform;
the modules below meet or exceed this baseline while remaining scoped to
the six core screens requested.

**1.4 Scope**

In scope: Landing Page, Course Listing & Detail, Payment Gateway
integration, Learner Account Dashboard, Live Classes (doubt-clearing),
Webinars, and the Admin/Backend panel required to operate all of the
above. Out of scope (unless separately commissioned): native mobile
apps, a proprietary trading/broking terminal, algo-trading tools, and
community/social-feed features.

**1.5 Definitions & Acronyms**

  --------------------- -------------------------------------------------
  **Term**              **Meaning**

  LMS                   Learning Management System

  SRS                   Software Requirements Specification

  SEBI                  Securities and Exchange Board of India ---
                        relevant for course-content compliance claims

  PG                    Payment Gateway

  RBAC                  Role-Based Access Control

  VOD                   Video on Demand (recorded course content)
  --------------------- -------------------------------------------------

**2. Overall Description**

**2.1 User Classes**

  ------------------- ---------------------------------------------------
  **Role**            **Description**

  Visitor / Guest     Unregistered user browsing the landing page and
                      course catalogue

  Learner / Student   Registered user who purchases courses, attends live
                      classes/webinars, tracks progress

  Instructor /        Conducts live classes and webinars, uploads
  Faculty             recorded content, resolves doubts

  Admin / Content     Manages courses, pricing, users, payments,
  Manager             schedules via the admin panel

  Support / Ops       Handles refunds, tickets, KYC-lite verification,
                      and payment reconciliation
  ------------------- ---------------------------------------------------

**2.2 Operating Environment**

-   Responsive web application --- desktop, tablet, and mobile browsers
    (mobile app treated as a future phase).

-   Cloud-hosted (AWS / GCP / Azure) with CDN-backed video delivery.

-   Third-party integrations: payment gateway
    (Razorpay/PayU/Stripe-equivalent for India), live-streaming/webinar
    provider (Zoom SDK / Vimeo Live / Agora), transactional SMS & email,
    and analytics (GA4 / Mixpanel).

**3. Functional Requirements --- Core Modules**

**3.1 Landing Page**

Purpose: primary conversion surface introducing the brand, value
proposition, and course catalogue to new visitors.

-   Hero section: value proposition, primary CTA (\'Explore Courses\' /
    \'Start Free\'), trust indicators (learner count, ratings, media
    mentions).

-   Featured/best-selling courses carousel with price, rating, and
    \'Enroll\' CTA.

-   Category tiles (Stock Market Basics, Technical Analysis, Options
    Trading, Fundamental Analysis, Mutual Funds/SIP, Intraday Trading).

-   Upcoming live classes & webinars strip with countdown/registration
    CTA.

-   Testimonials, instructor/faculty highlights, and \'as seen in\'
    press/media logos.

-   Free resources section (calculators, eBooks, blog/glossary) for SEO
    and top-of-funnel lead capture.

-   Newsletter/lead-capture form, footer with sitemap, legal pages, and
    social links.

-   SEO: server-rendered/meta-optimized pages, schema markup for
    courses, fast Core Web Vitals.

**3.2 Course Listing & Course Detail**

-   Course catalogue with filters: category, level
    (beginner/intermediate/advanced), language, price, format
    (self-paced / live / bundled mentorship).

-   Search with autocomplete and sorting (popularity, rating, price,
    newest).

-   Course card: thumbnail, title, instructor, rating, price (with
    discount/strikethrough), duration, badge (Bestseller/New).

-   Course detail page: syllabus/curriculum accordion, learning
    outcomes, instructor bio, preview video, reviews & ratings, FAQs,
    prerequisites.

-   Related/\'students also bought\' recommendations and
    bundle/mentorship-program upsell.

-   Wishlist / \'Save for later\' and Add-to-cart flow supporting
    multi-course checkout.

**3.3 Payment Gateway Page**

-   Cart/checkout summary with applied coupons, taxes (GST), and final
    payable amount.

-   Multiple payment modes via gateway integration: UPI, cards, net
    banking, wallets, and EMI where supported.

-   Coupon/discount code engine and support for bundled/subscription
    pricing plans.

-   Secure payment redirect/iframe flow, PCI-DSS-compliant handling (no
    raw card data touches our servers).

-   Payment status handling: success, failure, retry, and
    pending/reconciliation states.

-   Auto-generated invoice (GST-compliant) emailed to the learner;
    webhook-based order confirmation.

-   Refund and cancellation workflow triggered from the admin panel,
    reflected in the learner\'s dashboard.

**3.4 Account Dashboard (Learner)**

-   \'My Courses\' with progress bar per course (% complete, last
    watched lesson, resume playback).

-   Upcoming live classes/webinars calendar with join links and
    reminders.

-   Certificates: view/download/share on completion of eligible courses.

-   Doubt/query history and responses (linked to specific
    lessons/timestamps).

-   Order & payment history with downloadable invoices; saved payment
    methods (tokenized).

-   Profile & KYC-lite settings (name, contact, preferences),
    notification preferences.

-   Wishlist, referral/rewards (if applicable), and support/help-ticket
    access.

**3.5 Live Classes --- Doubt Clearing Sessions**

-   Scheduling engine: instructors create sessions with topic,
    date/time, capacity, and linked course(s).

-   Registration/RSVP for enrolled learners; automated reminder
    emails/SMS/push before session start.

-   Embedded live video (SDK-based) with screen-share, raise-hand, and
    live chat/Q&A moderated by instructor.

-   Doubt-submission queue: learners can pre-submit questions tied to a
    course/lesson before the session.

-   Session recording auto-uploaded to the related course as
    supplementary VOD content post-session.

-   Attendance tracking for reporting and instructor payout/performance
    metrics.

**3.6 Webinars**

-   Public and learner-exclusive webinar types, each with its own
    landing/registration page.

-   Registration capture (name, email, phone) with confirmation and
    calendar-invite generation.

-   Live streaming (webinar mode: one-to-many) with chat, polls/Q&A, and
    optional lead-magnet download.

-   Post-webinar: recording published to a resource library, follow-up
    email sequence, and course-offer CTA.

-   Webinar analytics: registrations vs. attendance, drop-off time,
    engagement, and conversion to paid enrollment.

**3.7 Admin Panel (Backend Console)**

-   Course & content management: create/edit courses, upload video
    (VOD), manage curriculum, pricing, and coupons.

-   User management: learners, instructors, roles/permissions (RBAC),
    KYC-lite review.

-   Live class & webinar scheduling, instructor assignment, capacity and
    reminder configuration.

-   Payments & orders: transaction log, refunds, invoices,
    reconciliation dashboard, GST reporting export.

-   CMS for landing page sections, testimonials, banners, and
    blog/resource content.

-   Analytics dashboard: sales, enrollment trends, completion rates,
    webinar funnel, cohort reports.

-   Support/ticketing view for learner queries and refund requests.

**3.8 Authentication & Account Management**

-   Email/phone + OTP and password-based signup/login; optional
    Google/Facebook social login.

-   Role-based access control across learner, instructor, and admin
    surfaces.

-   Forgot/reset password, session management, and account
    deactivation/deletion (data-privacy compliant).

**4. Non-Functional Requirements**

  ------------------- ---------------------------------------------------
  **Category**        **Requirement**

  Performance         Landing/course pages load \< 2.5s on 4G; video
                      start latency \< 3s via CDN

  Scalability         Support concurrent live-class viewers scaling to
                      thousands via a dedicated streaming provider,
                      decoupled from core app servers

  Security            HTTPS everywhere, PCI-DSS-compliant payment flow,
                      OWASP Top 10 hardening, encrypted PII at rest

  Availability        Target 99.5% uptime for core app; monitored with
                      alerting on payment and live-class services

  Compliance          GST-compliant invoicing, data-privacy (consent,
                      right-to-delete), no unregistered investment-advice
                      claims in marketing copy

  Browser/Device      Latest 2 versions of Chrome, Safari, Edge, Firefox;
  Support             iOS/Android mobile browsers

  Accessibility       WCAG 2.1 AA target for core learner flows
  ------------------- ---------------------------------------------------

**5. System Architecture & Technology Stack**

**5.1 Frontend**

-   Framework: React / Next.js (SSR for SEO on landing & course pages),
    TypeScript.

-   Styling: Tailwind CSS / design-system component library; responsive,
    mobile-first layouts.

-   State/data: React Query or equivalent for API caching; video player
    via a VOD-capable player (e.g., Video.js/Mux Player) with
    DRM/watermarking for course content.

**5.2 Backend**

-   API layer: Node.js (NestJS/Express) or equivalent, exposing
    REST/GraphQL APIs consumed by the frontend and admin panel.

-   Database: PostgreSQL/MySQL for relational data (users, courses,
    orders); Redis for caching/session; object storage (S3-equivalent)
    for video and assets.

-   Auth: JWT/OAuth2-based session management with RBAC middleware.

-   Background jobs/queue for emails, SMS reminders, invoice generation,
    and recording post-processing.

**5.3 Key Third-Party Integrations**

  ------------------------------- ---------------------------------------
  **Integration**                 **Purpose**

  Payment Gateway (Razorpay /     Checkout, UPI/card/netbanking, refunds,
  PayU / Cashfree)                webhooks

  Live Streaming (Zoom SDK /      Live classes and webinars, recording
  Agora / Vimeo Live)             

  Video Hosting/CDN (Mux /        Secure VOD delivery with DRM/watermark
  Cloudflare Stream /             
  S3+CloudFront)                  

  Transactional Email & SMS       OTP, reminders, invoices, confirmations
  (SendGrid/Twilio equivalents)   

  Analytics (GA4 / Mixpanel)      Funnel tracking, cohort analysis
  ------------------------------- ---------------------------------------

**5.4 High-Level Data Entities**

-   User (role, profile, auth), Course (curriculum, pricing, media),
    Enrollment/Order, Payment/Transaction, LiveSession (class/webinar),
    Attendance, Doubt/Query, Certificate, Coupon.

**6. Project Roadmap**

Indicative timeline assuming a mid-sized team (1 PM, 2 frontend, 2
backend, 1 QA, 1 designer). Durations to be finalized after requirement
sign-off.

  ------------------- ---------------------------------------- ------------
  **Phase**           **Deliverables**                         **Est.
                                                               Duration**

  Phase 0 ---         Finalized SRS sign-off, sitemap,         1--2 weeks
  Discovery & UX      wireframes, competitor gap analysis      

  Phase 1 --- UI/UX   High-fidelity designs (all 6 modules),   2--3 weeks
  Design              design system, client review rounds      

  Phase 2 --- Core    Auth, course/content APIs, DB schema,    3--4 weeks
  Backend & Admin     admin panel v1                           

  Phase 3 --- Landing Public site, catalogue, course detail,   2--3 weeks
  Page + Course       SEO setup                                
  Listing                                                      

  Phase 4 --- Payment Checkout flow, PG integration,           2 weeks
  Gateway             invoicing, refunds                       

  Phase 5 --- Account Learner dashboard, progress tracking,    2 weeks
  Dashboard           certificates                             

  Phase 6 --- Live    Streaming integration, scheduling,       3 weeks
  Classes & Webinars  doubt-queue, recordings                  

  Phase 7 --- QA &    Functional/security/performance testing, 2 weeks
  UAT                 client UAT sign-off                      

  Phase 8 ---         Production deployment, monitoring,       1 week
  Deployment & Launch handover, go-live support                
  ------------------- ---------------------------------------- ------------

Total indicative timeline: approximately 16--20 weeks end-to-end, with
parallel workstreams across frontend/backend reducing calendar time
where team capacity allows.

**7. Deliverables to Client**

**7.1 Documentation Deliverables**

-   This SRS document (functional + non-functional requirements).

-   UI/UX wireframes and high-fidelity design files (Figma, with
    view/comment access).

-   System architecture diagram and database ER diagram.

-   API documentation (endpoints, request/response schema ---
    Swagger/Postman collection).

-   Admin panel user manual and learner-facing help documentation.

-   Test plan and UAT sign-off report.

-   Deployment/runbook document and credentials handover sheet.

**7.2 Product Deliverables**

-   Fully functional responsive web application covering all six modules
    plus admin panel.

-   Source code repository access (frontend, backend, admin) with commit
    history.

-   Configured third-party integrations (payment gateway, streaming,
    email/SMS) under client\'s own accounts/keys.

-   Staging and production environment setup, with CI/CD pipeline
    configuration.

**7.3 Milestone-Based Handover**

  ------------------------ ----------------------------------------------
  **Milestone**            **What\'s Handed Over**

  Design sign-off          Figma design files, clickable prototype

  Backend/API sign-off     API documentation, Postman collection, DB
                           schema

  Module completion (per   Working demo on staging, module-level test
  phase)                   results

  Final launch             Production app, source code, all
                           documentation, 15--30 day post-launch support
                           window (recommended)
  ------------------------ ----------------------------------------------

**8. Assumptions, Constraints & Acceptance**

**8.1 Assumptions**

-   Client will provide branding assets (logo, brand guidelines) and
    initial course content/video masters.

-   Third-party service accounts (payment gateway merchant ID, streaming
    provider) will be created/owned by the client; the team integrates
    against them.

-   Content is educational in nature and does not constitute registered
    investment advice; legal/compliance copy review is a client
    responsibility.

**8.2 Constraints**

-   Native mobile apps, algo-trading tools, and community/social
    features are excluded from this scope unless a change request is
    raised.

-   Live-class concurrency limits are governed by the chosen third-party
    streaming provider\'s plan.

**8.3 Acceptance Criteria**

-   Each module functions per Section 3 requirements across supported
    browsers/devices listed in Section 4.

-   A test purchase completes end-to-end (course selection → payment →
    dashboard access → certificate) without manual intervention.

-   A test live class and webinar can be scheduled, joined, recorded,
    and the recording auto-published to the course/library.

*This document is intended as a living reference and will be updated as
requirements are refined during Phase 0 (Discovery) in consultation with
the client.*
