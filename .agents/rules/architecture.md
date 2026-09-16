# Architecture

## Repo layout

```
/frontend        Next.js app (learner-facing + admin UI)
/backend          NestJS API
/shared           Prisma schema, shared TS types/DTOs, zod validators
/docs
  /api             openapi.yaml, error-codes.md
  SRS.md           full original SRS (reference only)
  open-stubs.md    tracked list of stubbed/mocked endpoints
```

## Data flow

Frontend never talks to Razorpay, the streaming SDK, or S3 directly for
anything security-sensitive — always through backend-issued, short-lived
tokens/signed URLs. Exception: client-side video playback pulls signed CDN
URLs issued by the backend per-request (not long-lived public URLs).

## Environments

- `local` — docker-compose (Postgres, Redis)
- `staging` — mirrors production, used for client UAT
- `production`

Each has its own `.env` (never commit secrets — `.env.example` documents
required keys only).

## Async/background work

Use a job queue (BullMQ on Redis) for: invoice email generation, live-session
recording post-processing, reminder notifications, webinar follow-up emails.
Do not do these synchronously inside request handlers.
