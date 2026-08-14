import { redirect } from "next/navigation";
import { getReadiness } from "@/lib/readiness";
import { createClient } from "@/lib/supabase/server";
import type { CareerReadinessScore } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORIES: {
  key: keyof Pick<
    CareerReadinessScore,
    | "technical_skills"
    | "communication"
    | "projects"
    | "resume_quality"
    | "interview_readiness"
  >;
  label: string;
}[] = [
  { key: "technical_skills", label: "Technical skills" },
  { key: "communication", label: "Communication" },
  { key: "projects", label: "Projects" },
  { key: "resume_quality", label: "Resume quality" },
  { key: "interview_readiness", label: "Interview readiness" },
];

function ScoreRing({ value }: { value: number }) {
  const degrees = Math.round((value / 100) * 360);
  return (
    <div
      className="relative flex h-40 w-40 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#4f46e5 ${degrees}deg, #1e293b ${degrees}deg 360deg)`,
      }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-slate-900">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          / 100
        </span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="font-semibold text-indigo-400">{value}/100</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default async function ReadinessPage() {
  let authed = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = !!user;
  } catch {}
  if (!authed) redirect("/login");

  const score = await getReadiness();
  if (!score) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Career Readiness</h1>
        <p className="mt-2 text-sm text-slate-400">
          A snapshot of how ready you are for your target career, based on your
          activity across Career OS.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm font-medium text-slate-400">
            Overall readiness
          </p>
          <div className="mt-6">
            <ScoreRing value={score.overall} />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Last updated {new Date(score.updated_at).toLocaleDateString()}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <h2 className="font-semibold text-white">Skill areas</h2>
          <div className="mt-5 space-y-6">
            {CATEGORIES.map((category) => (
              <ScoreBar
                key={category.key}
                label={category.label}
                value={score[category.key]}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white">Suggested next steps</h2>
        {score.suggestions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            Keep learning and your readiness profile will update as you go.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {score.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-300">{suggestion}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}