# Career OS — Project State & Handover Document

> Generated: 2026-08-14
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
| Migrations applied to cloud DB | **NOT YET** — next step |
| App env keys | **NOT YET** — `.env.local` still needs creating (or use MCP after restart) |

Schema: 17 tables with Row-Level Security (profiles, assessments, analysis_reports, careers, career_recommendations, roadmaps, milestones, courses, xp_transactions, badges, user_badges, certificates, mentor_messages, study_groups, study_group_members, study_group_messages, career_readiness) + avatars storage bucket.

## 5. opencode Configuration (already saved)

| Item | Location |
|------|----------|
| MCP config | `C:\Users\ragha\.config\opencode\opencode.json` |
| OAuth token | Stored by opencode (`opencode mcp auth supabase` ran successfully) |
| Supabase skills | `C:\Users\ragha\.agents\skills\supabase` + `...\supabase-postgres-best-practices` |
| Team conventions | `C:\Users\ragha\career-os\AGENTS.md` |
| QA report | `C:\Users\ragha\career-os\docs\QA_REPORT.md` |

## 6. How the "Team" Is Structured

| Role | Work |
|------|------|
| Agent A (DB) | SQL migrations + RLS + seeds |
| Agent B (Auth) | signup/login/profile/callback |
| Agent C (Assessment) | assessment wizard + analysis + career recs |
| Agent D (Roadmap) | roadmap generation + status transitions |
| Agent E (Frontend) | dashboard + rewards + landing + nav |
| Agent F (QA) | review, lint, typecheck, build gate |
| Sprint 2 agents | mentor, community, certificates, readiness, integration |

## 7. Next Steps (when ready)

1. **Restart opencode** (required once so the Supabase MCP connects).
2. Say **"push the migrations"** → team applies `0001 → 0002 → 0003` to the live Supabase project via MCP.
3. Create `.env.local` (URL + anon key from Supabase dashboard) — or use MCP project URL.
4. `npm run dev` → sign up → take assessment → pick career → roadmap → rewards.
5. Optional Sprint 3: Quizzes & Projects, Opportunities, real AI (OpenAI), Rewards Shop.

## 8. Safety Net

- Code = on disk + git commits. ✅
- Supabase schema = files in `supabase/migrations/` (re-runnable, idempotent). ✅
- Auth/login for MCP = persisted by opencode. ✅
- Cloud DB = Supabase servers. ✅

**Nothing is lost by closing this window. Everything listed above already exists on your machine or in your Supabase account.**
