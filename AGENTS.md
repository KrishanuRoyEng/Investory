# StockLearn — Stock Market EdTech LMS

This file is the always-loaded source of truth for this project. Read this
and `.agents/rules/*.md` before starting any task — do not ask the user to
re-explain scope that is already documented here. The full SRS lives at
`docs/SRS.md`; only open it if a rule file explicitly tells you to, or if
you need detail beyond what's summarized below (saves context/tokens).

## What this is

A Learning Management System for stock market education, competing with
Elearnmarkets / Investmate / Invstory. Six learner-facing modules + an admin
console:

1. Landing Page — marketing/conversion surface
2. Course Listing & Course Detail — catalogue, filters, search, checkout entry
3. Payment Gateway — cart, checkout, coupons, invoices, refunds
4. Account Dashboard — "My Courses", progress, certificates, order history
5. Live Classes — scheduled doubt-clearing sessions with streaming + Q&A
6. Webinars — public/gated one-to-many streams with registration + replay
7. Admin Panel — content, users, payments, scheduling, CMS, analytics

## Tech stack (locked — do not substitute without asking)

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, React Query
- **Backend:** NestJS (TypeScript), REST API, JWT auth (access + refresh tokens)
- **Database:** PostgreSQL via Prisma ORM
- **Cache/session:** Redis
- **Object storage:** S3-compatible (video, images)
- **Payments:** Razorpay (India) — checkout + webhooks
- **Live streaming:** Agora SDK (classes + webinars)
- **Email/SMS:** SendGrid + Twilio (or equivalents already configured in `.env.example`)
- **Monorepo layout:** `/frontend`, `/backend`, `/docs`, `/shared` (shared TS types/DTOs)

## Build order (follow this sequence; do not jump ahead)

1. `/shared` — Prisma schema + generated types, OpenAPI contract stub
2. `/backend` — auth → courses/catalogue → payments → dashboard APIs → live/webinar APIs → admin APIs
3. `/frontend` — built against the real backend, module by module, same order as above

Do not start frontend UI for a module until its backend endpoints exist and
are documented in `docs/api/`. If you must stub something to unblock frontend
work, mark it clearly with `// TODO(api-stub):` and list it in
`docs/open-stubs.md`.

## Non-negotiables

- No raw card data ever touches our backend — Razorpay handles PCI scope.
- Every list/table endpoint is paginated.
- Every mutation validates input server-side (never trust client validation alone).
- RBAC enforced at the API layer for learner / instructor / admin roles.
- All money values are stored as integers (paise/cents), never floats.

## Where things live

- Business rules & module-level detail → `.agents/rules/domain-glossary.md`
- API conventions (routes, errors, auth) → `.agents/rules/api-conventions.md`
- Coding/style standards → `.agents/rules/coding-standards.md`
- Architecture & folder structure → `.agents/rules/architecture.md`
- Full original SRS (only if you need it) → `docs/SRS.md`

## Commands

- `pnpm dev` — run frontend + backend together
- `pnpm --filter backend prisma:migrate` — run DB migrations
- `pnpm --filter backend test` / `pnpm --filter frontend test`
- `pnpm lint` — lint all workspaces
