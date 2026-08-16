import Link from "next/link";
import { redirect } from "next/navigation";
import { levelFromXp, xpForLevel } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Reveal, Stagger, StaggerItem } from "../_components/motion";

const quickActions = [
  {
    href: "/assessment",
    title: "Take Assessment",
    description: "Discover your strengths and ideal career paths.",
    icon: "✦",
    accent: "from-accent to-blue-500",
  },
  {
    href: "/roadmap",
    title: "My Roadmap",
    description: "See your personalized learning plan.",
    icon: "◈",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    href: "/mentor",
    title: "AI Mentor",
    description: "Get guidance from your AI career mentor.",
    icon: "✧",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    href: "/community",
    title: "Community",
    description: "Join study groups and learn with peers.",
    icon: "❋",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    href: "/certificates",
    title: "Certificates",
    description: "View your earned career certificates.",
    icon: "✓",
    accent: "from-amber-500 to-orange-500",
  },
  {
    href: "/readiness",
    title: "Career Readiness",
    description: "Check how ready you are for the job market.",
    icon: "◎",
    accent: "from-rose-500 to-pink-500",
  },
  {
    href: "/rewards",
    title: "Rewards",
    description: "Check in daily and collect XP and badges.",
    icon: "★",
    accent: "from-yellow-500 to-amber-500",
  },
  {
    href: "/profile",
    title: "Profile",
    description: "Update your goals and learning style.",
    icon: "●",
    accent: "from-teal-500 to-emerald-400",
  },
];

export default async function DashboardPage() {
  let user: { id: string; email?: string | null } | null = null;
  let profile: {
    full_name: string | null;
    email: string | null;
    xp: number;
    coins: number;
    level: number;
    current_streak_days: number;
    longest_streak_days: number;
    last_active_day: string | null;
  } | null = null;
  let transactions: {
    id: string;
    amount: number;
    reason: string;
    created_at: string;
  }[] = [];
  let assessment: { status: string } | null = null;
  let readiness: {
    overall: number;
    suggestions: string[];
  } | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser ?? null;
    if (user) {
      const [
        { data: p },
        { data: t },
        { data: a },
        { data: readinessRow },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "full_name, email, xp, coins, level, current_streak_days, longest_streak_days, last_active_day"
          )
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("xp_transactions")
          .select("id, amount, reason, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("assessments")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("career_readiness")
          .select("overall, suggestions")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      profile = p;
      transactions = t ?? [];
      assessment = a;
      readiness = readinessRow ?? null;
    }
  } catch {}

  if (!user) {
    redirect("/login");
  }

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] ||
    profile?.email?.split("@")[0] ||
    "there";
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? levelFromXp(xp);
  const coins = profile?.coins ?? 0;
  const streak = profile?.current_streak_days ?? 0;
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progressPct = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))
  );
  const assessmentDone = assessment?.status === "completed";

  return (
    <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-display text-sm text-accent">01.</span>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-slate-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 text-slate-500">
          Here is how your career journey is going today.
        </p>
      </Reveal>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <div className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40">
            <p className="text-sm font-medium text-slate-500">Level</p>
            <p className="mt-2 font-display text-3xl text-slate-900">{level}</p>
            <p className="mt-1 text-sm text-slate-400">Career progress</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40">
            <p className="text-sm font-medium text-slate-500">XP</p>
            <p className="mt-2 font-display text-3xl text-slate-900">{xp}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {progressPct}% to level {level + 1}
              </p>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-amber-500/40">
            <p className="text-sm font-medium text-slate-500">Coins</p>
            <p className="mt-2 font-display text-3xl text-slate-900">{coins}</p>
            <p className="mt-1 text-sm text-slate-400">Spend on the Rewards Shop</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-rose-500/40">
            <p className="text-sm font-medium text-slate-500">Streak</p>
            <p className="mt-2 font-display text-3xl text-slate-900">
              {streak} <span className="align-middle text-2xl">🔥</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Longest: {profile?.longest_streak_days ?? 0} days
            </p>
          </div>
        </StaggerItem>
      </Stagger>

      {!assessmentDone && (
        <Reveal>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg uppercase tracking-tight text-slate-900">
                You have not taken the assessment yet
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Complete it to unlock personalized career recommendations and your
                learning roadmap.
              </p>
            </div>
            <Link
              href="/assessment"
              className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
            >
              Take Assessment
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-12 flex items-baseline gap-4">
        <span className="font-display text-sm text-accent">02.</span>
        <h2 className="font-display text-2xl uppercase tracking-tight text-slate-900">
          Quick actions
        </h2>
      </Reveal>
      <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <StaggerItem key={action.href}>
            <Link
              href={action.href}
              className="group relative block overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-xl hover:shadow-slate-200"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.accent} text-lg text-white shadow-lg opacity-80`}
              >
                {action.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-accent">
                {action.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{action.description}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      {readiness && (
        <Reveal>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-50 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg uppercase tracking-tight text-slate-900">
                Career Readiness
              </h2>
              <p className="mt-1 text-sm text-emerald-700">
                Your overall readiness score is{" "}
                <span className="font-semibold">{readiness.overall}%</span>
                {readiness.suggestions?.length ? (
                  <>
                    {" "}with {readiness.suggestions.length} area
                    {readiness.suggestions.length === 1 ? "" : "s"} to work on.
                  </>
                ) : (
                  ". Keep it up!"
                )}
              </p>
            </div>
            <Link
              href="/readiness"
              className="shrink-0 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
            >
              View Readiness
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-12 flex items-baseline gap-4">
        <span className="font-display text-sm text-accent">03.</span>
        <h2 className="font-display text-2xl uppercase tracking-tight text-slate-900">
          Recent XP activity
        </h2>
      </Reveal>
      {transactions.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-card p-6 text-slate-500">
          No XP earned yet. Take the assessment or check in daily to start
          earning.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">{tx.reason}</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  {new Date(tx.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                +{tx.amount} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}