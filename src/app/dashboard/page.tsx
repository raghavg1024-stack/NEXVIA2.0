import Link from "next/link";
import { redirect } from "next/navigation";
import { levelFromXp, xpForLevel } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const quickActions = [
  {
    href: "/assessment",
    title: "Take Assessment",
    description: "Discover your strengths and ideal career paths.",
  },
  {
    href: "/roadmap",
    title: "My Roadmap",
    description: "See your personalized learning plan.",
  },
  {
    href: "/rewards",
    title: "Rewards",
    description: "Check in daily and collect XP and badges.",
  },
  {
    href: "/profile",
    title: "Profile",
    description: "Update your goals and learning style.",
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

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser ?? null;
    if (user) {
      const [{ data: p }, { data: t }, { data: a }] = await Promise.all([
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
      ]);
      profile = p;
      transactions = t ?? [];
      assessment = a;
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
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Welcome back, {firstName}
      </h1>
      <p className="mt-2 text-slate-400">
        Here is how your career journey is going today.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-medium text-slate-400">Level</p>
          <p className="mt-2 text-3xl font-bold text-white">{level}</p>
          <p className="mt-1 text-sm text-slate-500">Career progress</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-medium text-slate-400">XP</p>
          <p className="mt-2 text-3xl font-bold text-white">{xp}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {progressPct}% to level {level + 1}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-medium text-slate-400">Coins</p>
          <p className="mt-2 text-3xl font-bold text-white">{coins}</p>
          <p className="mt-1 text-sm text-slate-500">Spend on the Rewards Shop</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-medium text-slate-400">Streak</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {streak} <span className="align-middle text-2xl">🔥</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Longest: {profile?.longest_streak_days ?? 0} days
          </p>
        </div>
      </div>

      {!assessmentDone && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              You have not taken the assessment yet
            </h2>
            <p className="mt-1 text-sm text-indigo-200">
              Complete it to unlock personalized career recommendations and your
              learning roadmap.
            </p>
          </div>
          <Link
            href="/assessment"
            className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Take Assessment
          </Link>
        </div>
      )}

      <h2 className="mt-12 text-xl font-semibold text-white">Quick actions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-indigo-500/50"
          >
            <h3 className="font-semibold text-white group-hover:text-indigo-300">
              {action.title}
            </h3>
            <p className="mt-2 text-sm text-slate-400">{action.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold text-white">Recent XP activity</h2>
      {transactions.length === 0 ? (
        <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
          No XP earned yet. Take the assessment or check in daily to start
          earning.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <p className="font-medium text-slate-200">{tx.reason}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {new Date(tx.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                +{tx.amount} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}