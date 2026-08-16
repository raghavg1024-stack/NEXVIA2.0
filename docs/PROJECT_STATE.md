# Career OS — Project State & Handover Document

> Generated: 2026-08-14
> Updated: 2026-08-14 (live DB wired up + login fixed)
> Purpose: Full record of everything built, configured, and saved so nothing is lost if a window/chat is closed.

---

## 1. The App — Where It Lives

| Item | Value |
|------|-------|
| Project folder | `C:\Users\ragha\career-os` |
| Tech stack | Next.js 16 (App Router, `src/`) + TypeScript (strict) + Tailwind CSS v4 |
| Database | Supabase (Postgres) — hosted in the cloud |
| Package manager | npm |
| Run it | `cd C:\Users\ragha\career-os && npm run dev` → `http://localhost:3000` |

**The code is on your hard drive in that folder. It does NOT live in the chat. Closing opencode deletes nothing.**

## 2. Git History (saved commits)

```
95907ae Sprint 2: AI Mentor, Community, Certificates, Career Readiness + XP wiring
cf197b6 Sprint 1: Core MVP - auth, assessment, career recs, roadmap, dashboard, rewards
```

Check anytime with: `cd C:\Users\ragha\career-os && git log --oneline`

## 3. What's Been Built

### Sprint 1 — Core MVP (committed ✅)
- **Auth**: signup, login, email-confirmation callback, logout
- **Profile**: view/edit profile
- **AI Career Assessment**: 11-question wizard (interests, skills, personality, goals, learning style, study time, education)
- **AI Analysis Report**: strengths, growth areas, learning style, study capacity, recommended pace
- **Career Recommendations**: top 2–4 matching careers with match %, reasons, skills
- **Roadmap**: 4 milestones × courses timeline, status transitions, unlock flow
- **Dashboard**: stats (Level, XP, Coins, Streak), quick actions
- **Rewards (fully working feature)**: XP, coins, levels, daily check-in, 8 badges, XP ledger, rewards shop placeholder

### Sprint 2 — Modules (committed ✅)
- **AI Mentor**: `/mentor` — rule-based coach (no API key needed), answers career/resume/interview/scholarship/study questions, personalized to profile + roadmap
- **Community**: `/community` — study groups (create/join/leave), member counts, group chat
- **Certificates**: `/certificates` — earned on roadmap completion, unique credential ID
- **Career Readiness**: `/readiness` — 0–100 score across 5 skills + AI suggestions
- **XP wiring**: courses/milestones/roadmap/assessment/career selection auto-grant XP

### Routes (15 total, all pass production build)
`/` `/login` `/signup` `/auth/callback` `/dashboard` `/profile` `/assessment` `/analysis` `/recommendations` `/roadmap` `/rewards` `/mentor` `/community` `/community/[groupId]` `/certificates` `/readiness`

## 4. Supabase Setup Status

| Item | Status |
|------|--------|
| Account | Created by user (ragha) |
| Project ref | `ufzsomqbndjggyswsnlg` |
| MCP server | Configured + **OAuth authenticated successfully** ✅ |
| Migrations written | `supabase/migrations/0001_init.sql`, `0002_storage.sql`, `0003_features.sql` |
| Migrations applied to cloud DB | **✅ APPLIED (2026-08-14)** — all 17 tables + seeds live |
| App env keys | **✅ CREATED** — `C:\Users\ragha\career-os\.env.local` (URL + anon key) |

Schema: 17 tables with Row-Level Security (profiles, assessments, analysis_reports, careers, career_recommendations, roadmaps, milestones, courses, xp_transactions, badges, user_badges, certificates, mentor_messages, study_groups, study_group_members, study_group_messages, career_readiness) + avatars storage bucket.

Seed data verified live: 8 careers + 8 badges. Storage bucket `avatars` created.

### Live DB / auth fix (2026-08-14)
- **Login was broken** for two reasons: (1) tables didn't exist yet, (2) email unconfirmed.
- Fixed: pushed all 3 migrations → confirmed email for `raghavg1024@gmail.com` → restored his profile row (`G.Raghav Kumar`, Level 1, 0 XP).
- **User account**: `raghavg1024@gmail.com` (confirmed). User id: `ff680c31-060c-4e17-9385-95c7375d8c1b`.

## 5. Session Log — 2026-08-14 (everything done today)

| # | Action | Result |
|---|--------|--------|
| 1 | Read `docs/PROJECT_STATE.md` to restore context | ✅ |
| 2 | Checked for `.env.local` + `node_modules` | `.env.local` missing, deps present |
| 3 | Got Supabase URL + anon key via MCP | `https://ufzsomqbndjggyswsnlg.supabase.co` |
| 4 | Created `C:\Users\ragha\career-os\.env.local` | ✅ URL + anon key saved |
| 5 | Started dev server | ✅ `npm run dev` on port 3000 |
| 6 | Diagnosed login failure from logs | `public.profiles` missing + "Email not confirmed" |
| 7 | Confirmed `public` schema was **empty** | 0 tables |
| 8 | **Pushed migration `0001_init`** via MCP | ✅ 11 core tables + RLS + seeds (8 careers, 8 badges) |
| 9 | **Pushed migration `0002_storage`** via MCP | ✅ `avatars` bucket + policies |
| 10 | **Pushed migration `0003_features`** via MCP | ✅ 6 feature tables + RLS |
| 11 | Verified schema live | ✅ all 17 tables present, seeds verified |
| 12 | Found user account unconfirmed | `raghavg1024@gmail.com` → `email_confirmed_at = null` |
| 13 | Confirmed email in `auth.users` | ✅ login blocker removed |
| 14 | Restored profile row (signup predated tables) | ✅ `G.Raghav Kumar`, Level 1, 0 XP |
| 15 | Verified dev server still running | ✅ listening on port 3000 |

**Not done yet (open items):** user still needs to log in and test the assessment → career → roadmap flow manually.

## 5. opencode Configuration (already saved)

| Item | Location |
|------|----------|
| MCP config | `C:\Users\ragha\.config\opencode\opencode.json` |
| OAuth token | Stored by opencode (`opencode mcp auth supabase` ran successfully) |
| Supabase skills | `C:\Users\ragha\.agents\skills\supabase` + `...\supabase-postgres-best-practices` |
| Team conventions | `C:\Users\ragha\career-os\AGENTS.md` |
| QA report | `C:\Users\ragha\career-os\docs\QA_REPORT.md` |

## 6. How the "Team" Is Structured

> Run like a real office — the lead coordinates, specialist agents own their area, QA gates every change.

| Role | Work |
|------|------|
| **Lead (product owner / coordinator)** | Overall direction, app code, `proxy.ts`, integrations |
| Agent A (DB / DBA) | SQL migrations + RLS + seeds (`supabase/migrations/`) |
| Agent B (Auth) | signup/login/profile/callback |
| Agent C (Assessment) | assessment wizard + analysis + career recs |
| Agent D (Roadmap) | roadmap generation + status transitions |
| Agent E (Frontend) | dashboard + rewards + landing + nav |
| Agent F (QA) | review, lint, typecheck, build gate |
| Sprint 2 agents | mentor, community, certificates, readiness, integration |

**Office-style workflow used today:** Lead diagnosed → DB agent pushed migrations → Auth agent fixed email/profile → QA verified schema + server up.

## 7. Next Steps (when ready)

1. **✅ DONE — Migrations pushed** to live Supabase project.
2. **✅ DONE — `.env.local` created** with URL + anon key.
3. **✅ DONE — Dev server running** at http://localhost:3000 (started in background).
4. **Manual QA for the user**: login as `raghavg1024@gmail.com` → take assessment → pick career → roadmap → rewards.
5. Optional Sprint 3: Quizzes & Projects, Opportunities, real AI (OpenAI), Rewards Shop.

## 8. Useful Commands (run anytime)

```bash
# Start dev server
cd C:\Users\ragha\career-os && npm run dev

# Type-check / lint / build (Definition of Done)
npx tsc --noEmit
npm run lint
npm run build

# See git history
git log --oneline
```

## 9. Safety Net

- Code = on disk + git commits. ✅
- Supabase schema = files in `supabase/migrations/` (re-runnable, idempotent). ✅
- Auth/login for MCP = persisted by opencode. ✅
- Cloud DB = Supabase servers. ✅

**Nothing is lost by closing this window. Everything listed above already exists on your machine or in your Supabase account.**

_Note: the anon key lives in `.env.local` (not pasted here) — never commit it. If `.env.local` is lost, re-run `npm run dev` after re-creating it from Supabase Dashboard → Settings → API._
