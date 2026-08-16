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
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className={`font-display text-2xl ${accent}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
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
    "Nexvia User";
  const email = profile?.email ?? user.email ?? "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-slate-700">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-line">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-xl uppercase tracking-tight text-slate-900">{displayName}</h1>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatCard value={profile?.level ?? 1} label="Level" accent="text-accent" />
            <StatCard value={profile?.xp ?? 0} label="XP" accent="text-amber-600" />
            <StatCard value={profile?.coins ?? 0} label="Coins" accent="text-emerald-600" />
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-line">
          <h2 className="font-display text-lg uppercase tracking-tight text-slate-900">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Education level</dt>
              <dd className="font-medium text-slate-900">{formatLabel(profile?.education_level)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Learning style</dt>
              <dd className="font-medium text-slate-900">{formatLabel(profile?.learning_style)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Study hours per week</dt>
              <dd className="font-medium text-slate-900">{profile?.study_hours_per_week ?? "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Current streak</dt>
              <dd className="font-medium text-slate-900">{profile?.current_streak_days ?? 0} days</dd>
            </div>
            <div>
              <dt className="text-slate-500">Goals</dt>
              <dd className="mt-1 text-slate-700">{profile?.goals ?? "Not set"}</dd>
            </div>
          </dl>
        </div>

        <ProfileEditForm profile={profile} />
      </div>
    </div>
  );
}