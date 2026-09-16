# Coding Standards

- TypeScript strict mode everywhere. No `any` without a `// TODO(type):` comment.
- Backend: NestJS module-per-domain (`auth/`, `courses/`, `payments/`,
  `live-sessions/`, `webinars/`, `dashboard/`, `admin/`). One module = one
  responsibility; don't merge domains into shared "misc" modules.
- Frontend: feature-folder structure under `app/`, colocate components with
  the route that owns them; only promote to `components/shared/` once reused
  in 2+ places.
- Shared types/DTOs live in `/shared` and are imported by both frontend and
  backend — never duplicate a type definition across workspaces.
- Naming: `camelCase` variables/functions, `PascalCase` components/classes,
  `kebab-case` file names except React components (`PascalCase.tsx`).
- Every backend endpoint has at least one integration test before being
  marked done. Every non-trivial frontend form has a validation test.
- Commit messages: `<module>: <what changed>` (e.g. `payments: add refund webhook handler`).
- Do not introduce a new npm package without checking if an already-installed
  one covers the need — check `package.json` first.
