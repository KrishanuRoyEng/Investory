# API Conventions

- Base path: `/api/v1/*`
- Auth: `Authorization: Bearer <JWT>`. Access token 15min, refresh token 7d
  (httpOnly cookie).
- Roles enforced via NestJS guards, never in controller body logic alone.
- Every module's controller explicitly secures routes using `@Roles(...)`.
- `JwtAuthGuard` and `RolesGuard` are globally applied via `APP_GUARD` in `AppModule`.
- **Public Routes:** Routes that do not require authentication MUST be decorated with `@Public()`.
  - **Role-Aware Public Routes:** If a route is `@Public()`, `JwtAuthGuard` will still parse and populate `req.user` if a valid token is provided, but will return `null` instead of throwing a 401 on missing/invalid tokens. This enables endpoints (like `/courses/:slug` or `/webinars`) to return a redacted response to unauthenticated users or learners, while returning a full response (e.g. including `videoUrl` or meeting links) when accessed by staff (ADMIN/INSTRUCTOR). Check `req.user?.role` against specific allowed roles rather than just checking for `req.user` presence.
- Response envelope for all endpoints:
  ```json
  { "data": {}, "meta": { "page": 1, "pageSize": 20, "total": 0 } }
  ```
- Error envelope:
  ```json
  { "error": { "code": "COURSE_NOT_FOUND", "message": "human readable" } }
  ```
- Error codes are UPPER_SNAKE_CASE and documented in `docs/api/error-codes.md`
  as they're introduced — do not invent ad hoc strings without recording them.
- Pagination: `?page=1&pageSize=20` query params on every list endpoint.
- Every new endpoint gets an entry in `docs/api/openapi.yaml` in the same PR
  that implements it — not deferred to "later."
- Webhooks (Razorpay, streaming provider) verify signatures before processing
  and are idempotent (safe to receive the same event twice).
- Money fields: integers in smallest currency unit (paise), field suffix `...Paise`.
- Timestamps: ISO 8601 UTC.
