# QA Report — Career OS MVP

Date: 2026-08-14
Engineer: QA / Review Engineer

## Checks run

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | PASS (0 errors, 0 warnings) |
| Type-check | `npx tsc --noEmit` | PASS |
| Build | `npm run build` | PASS (11 routes + proxy) |
| Proxy correctness | read `src/proxy.ts` vs Next 16 docs | PASS (see fixes) |
| Schema cross-check | app columns vs `supabase/migrations/0001_init.sql` | PASS (all columns match) |
| Ownership / duplicates | glob for `layout.tsx`, `page.tsx`, route handlers | PASS (single `src/app/layout.tsx`, single `src/app/page.tsx`, no duplicates) |
| Security grep | `SUPABASE_SERVICE_ROLE_KEY`, hardcoded keys, secret logging | PASS |

## Issues found + fixed

### 1. Proxy auth bypass on `/assessment`, `/roadmap`, `/profile` (real bug) — FIXED

`src/proxy.ts` — the `config.matcher` correctly listed `/assessment/:path*`, `/roadmap/:path*`, and `/profile/:path*` as protected, but the guard logic only redirected unauthenticated users away from `/dashboard`. An unauthenticated visitor could reach the assessment, roadmap, and profile pages directly.

Fixed by adding an `isProtectedRoute` check covering `/dashboard`, `/assessment`, `/roadmap`, `/profile` so unauthenticated users are redirected to `/login` for all of them. `/login` and `/signup` still redirect authenticated users to `/dashboard`. The file uses the Next 16 `proxy` export (not `middleware`) and a `config.matcher`, which matches the Next 16 docs in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.

## Review findings (no change needed)

- **Auth flow** (`src/app/(auth)/actions.ts`, `src/app/auth/callback/route.ts`): signup does `signUp` + `profiles` upsert (idempotent on conflict), login does `signInWithPassword`, both redirect correctly. Callback exchanges code for session and redirects. Logout (`src/lib/rewards.ts:logout`) signs out and redirects to `/`. No dangerous operations; no service role used.
- **Assessment flow** (`src/lib/assessment.ts`, `src/app/assessment|analysis|recommendations`): `saveProgress`/`completeAssessment` upsert `assessments` with columns matching `0001_init.sql` (`status`, `current_question_index`, `responses`, `started_at`, `completed_at`). `completeAssessment` writes `analysis_reports` and `career_recommendations` (all columns exist in schema). Redirects: assessment page → `/analysis`, `selectCareer` → `/roadmap`. `matchCareers` usage is type-safe.
- **Roadmap** (`src/lib/roadmap.ts`): status transitions follow `VALID_*` maps (`pending→in_progress→completed`, `locked→in_progress→completed`); `roadmaps.status` uses `draft`/`completed` which exist in the schema check constraint. Course/milestone inserts match `milestones`/`courses` columns exactly. Ownership checks prevent cross-user updates.
- **Dashboard/Rewards** (`src/app/dashboard`, `src/app/rewards`, `src/lib/rewards.ts`, `src/app/layout.tsx`, `src/app/page.tsx`): all queries are RLS-safe (filtered by `user.id`); no SQL injection (Supabase query builder); no secrets in client components (only `NEXT_PUBLIC_*`). `"use server"` files only export async functions. XP/level/badge logic is consistent with `src/lib/data.ts` (`XP_RULES`, `levelFromXp`, `BADGES`, `matchCareers`).
- **Supabase schema**: every column referenced by app code exists in `0001_init.sql` with exact names (verified `profiles`, `assessments`, `analysis_reports`, `career_recommendations`, `roadmaps`, `milestones`, `courses`, `xp_transactions`, `badges`, `user_badges`).
- **Security**: no `SUPABASE_SERVICE_ROLE_KEY` in code (only mentioned in `.env.example` as a comment). Only `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read by app code. No `console.log` of secrets.

## Issues still open

None critical. Build/lint/typecheck are all green.

Minor non-blocking observations (no change made, per conservative scope):
- `src/lib/assessment.ts` uses `user!.id` after a `redirect()` guard (`redirect` throws, so it's safe, but non-null assertions are brittle style).
- `src/lib/roadmap.ts:105` casts `roadmap.career_title as string` — column is `text not null` so safe.

## Verdict

**PASS.** `npm run lint`, `npx tsc --noEmit`, and `npm run build` are all green. One real bug (proxy not enforcing protection on `/assessment`, `/roadmap`, `/profile`) was found and fixed. All app↔schema column references match the migrations; auth, assessment, roadmap, and rewards flows are consistent and RLS-safe. No secrets in code. Ready to ship.
