import { redirect } from "next/navigation";
import { getProfile, getSession } from "@/lib/profile";
import ProfileEditForm from "./profile-form";

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-4 text-center">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const user = await getSession();
  const profile = await getProfile();

  if (!user) redirect("/login");

  const displayName =
    profile?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    "Career OS User";
  const email = profile?.email ?? user.email ?? "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{displayName}</h1>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatCard value={profile?.level ?? 1} label="Level" accent="text-indigo-400" />
            <StatCard value={profile?.xp ?? 0} label="XP" accent="text-amber-400" />
            <StatCard value={profile?.coins ?? 0} label="Coins" accent="text-emerald-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-800">
          <h2 className="text-lg font-semibold text-slate-50">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Education level</dt>
              <dd className="font-medium">{formatLabel(profile?.education_level)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Learning style</dt>
              <dd className="font-medium">{formatLabel(profile?.learning_style)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Study hours per week</dt>
              <dd className="font-medium">{profile?.study_hours_per_week ?? "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Current streak</dt>
              <dd className="font-medium">{profile?.current_streak_days ?? 0} days</dd>
            </div>
            <div>
              <dt className="text-slate-400">Goals</dt>
              <dd className="mt-1 text-slate-200">{profile?.goals ?? "Not set"}</dd>
            </div>
          </dl>
        </div>

        <ProfileEditForm profile={profile} />
      </div>
    </div>
  );
}
