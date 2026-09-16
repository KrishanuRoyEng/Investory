# Domain Glossary & Module Rules

Condensed from the SRS. This is the canonical quick-reference — prefer this
over re-reading `docs/SRS.md`.

## Core entities

- **User** — role: `LEARNER | INSTRUCTOR | ADMIN | SUPPORT`
- **Course** — has curriculum (modules → lessons), price, level, language, format (`SELF_PACED | LIVE | BUNDLE`)
- **Enrollment** — links User + Course, tracks progress %, last-watched lesson
- **Order / Transaction** — one order can contain multiple courses; one transaction per payment attempt
- **LiveSession** — type `CLASS | WEBINAR`, has schedule, capacity, instructor, linked course (optional for webinars)
- **Attendance** — links User + LiveSession, join/leave timestamps
- **Doubt/Query** — links User + Lesson (or LiveSession), status `OPEN | ANSWERED`
- **Certificate** — issued on course completion, downloadable
- **Coupon** — code, discount type, validity, usage limits

## Module rules

**Landing Page** — SSR/SEO-critical. No client-only rendering for hero, course
carousel, or category tiles. CMS-driven sections (testimonials, banners) pull
from admin-managed content, not hardcoded.

**Course Listing/Detail** — Filters (category, level, language, price, format)
must be server-side filterable via query params, not client-side-only
filtering of a full dataset. Course detail must show curriculum, instructor,
reviews, and preview video.

**Payment Gateway** — Cart → Razorpay order creation → redirect/checkout →
webhook confirms payment → Enrollment created only after webhook success
(never on client-side redirect alone). GST-compliant invoice auto-generated
and emailed. Refunds are admin-triggered, update Order status, and revoke
Enrollment access.

**Account Dashboard** — Reads-heavy: My Courses (progress), upcoming
live sessions, certificates, order history, doubt history. No mutations here
except profile/notification settings.

**Live Classes** — Learner must be enrolled in the linked course to register.
Doubts can be pre-submitted before the session. Recording auto-attaches to
the course as a lesson after the session ends (async job, not synchronous).

**Webinars** — Can be public (no enrollment required) or learner-exclusive.
Registration always captures name/email/phone even for logged-in users (for
marketing follow-up). Post-webinar recording goes to a public resource
library unless marked learner-exclusive.

**Admin Panel** — Every learner-facing mutation (refunds, enrollment changes,
session rescheduling) must be visible/auditable from here. This is not an
afterthought module — build its API alongside each learner module, not at
the end.

## Explicitly out of scope (do not build unless asked)

- Native mobile apps
- Algo-trading / broking terminal
- Social feed / community features
