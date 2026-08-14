import { redirect } from "next/navigation";
import { BADGES, levelFromXp, xpForLevel } from "@/lib/data";
import { getRewardsState } from "@/lib/rewards";
import { CheckInButton } from "../_components/check-in-button";

function todayString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export default async function RewardsPage() {
  const state = await getRewardsState();
  if (!state.profile) {
    redirect("/login");
  }

  const { profile, earned, transactions } = state;
  const xp = profile.xp;
  const level = profile.level || levelFromXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progressPct = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))
  );
  const checkedInToday = profile.last_active_day === todayString();
  const earnedMap = new Map(earned.map((entry) => [entry.badge_key, entry.earned_at]));

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">Rewards</h1>
      <p className="mt-2 text-slate-400">
        Keep the momentum going. Check in daily, earn XP, and unlock badges.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Level progress</h2>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold text-white">{xp}</p>
              <p className="mt-1 text-sm text-slate-400">total XP</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-indigo-300">
                Level {level}
              </p>
              <p className="text-sm text-slate-500">
                {xpForLevel(level + 1) - xp} XP to level {level + 1}
              </p>
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Level {level}</span>
            <span>{progressPct}%</span>
            <span>Level {level + 1}</span>
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Daily streak</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">
              {profile.current_streak_days}
            </p>
            <span className="text-xl" aria-hidden="true">
              🔥
            </span>
            <span className="text-sm text-slate-400">day{profile.current_streak_days === 1 ? "" : "s"}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Longest streak: {profile.longest_streak_days} days
          </p>
          <div className="mt-auto pt-6">
            <CheckInButton checkedInToday={checkedInToday} />
          </div>
        </section>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-white">Badges</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BADGES.map((badge) => {
          const earnedAt = earnedMap.get(badge.key);
          const isEarned = Boolean(earnedAt);
          return (
            <div
              key={badge.key}
              className={`rounded-xl border p-6 transition-colors ${
                isEarned
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-900/40 opacity-60"
              }`}
            >
              <span
                className={`text-3xl ${isEarned ? "" : "grayscale"}`}
                aria-hidden="true"
              >
                {badge.icon}
              </span>
              <h3 className="mt-3 font-semibold text-white">{badge.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{badge.description}</p>
              <p className="mt-3 text-xs text-slate-500">
                {isEarned && earnedAt
                  ? `Earned on ${new Date(earnedAt).toLocaleDateString()}`
                  : badge.criteria ?? `Earn ${badge.xp_required ?? 0} XP`}
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="mt-14 text-xl font-semibold text-white">XP ledger</h2>
      {transactions.length === 0 ? (
        <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
          No XP yet. Complete your assessment or check in daily to get started.
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

      <h2 className="mt-14 text-xl font-semibold text-white">Rewards Shop</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Premium insights",
            description: "Advanced analysis of your strengths and growth areas.",
          },
          {
            title: "Resume reviews",
            description: "Get your resume reviewed by career experts.",
          },
          {
            title: "Mock interviews",
            description: "Practice with realistic interview scenarios.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            <span className="mt-4 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}