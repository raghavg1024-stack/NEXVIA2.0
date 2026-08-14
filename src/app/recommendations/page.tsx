import { redirect } from "next/navigation";
import { CAREERS } from "@/lib/data";
import type { Career, CareerRecommendation } from "@/lib/types";
import { getAssessment, selectCareer } from "@/lib/assessment";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const { analysisReport, recommendations } = await getAssessment();

  if (!analysisReport || recommendations.length === 0) {
    redirect("/assessment");
  }

  const matches = recommendations
    .map((rec) => ({ rec, career: CAREERS.find((c) => c.id === rec.career_id) }))
    .filter((m): m is { rec: CareerRecommendation; career: Career } => Boolean(m.career));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Career matches
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your top career paths</h1>
          <p className="mt-3 text-slate-400">
            Based on your assessment, these careers fit your skills, interests, and goals.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {matches.map(({ rec, career }) => (
            <article
              key={rec.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl">{career.icon}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{career.title}</h2>
                  <p className="text-sm text-slate-400">{career.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-indigo-400">{rec.match_percentage}%</p>
                  <p className="text-xs text-slate-400">match</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-300">{career.description}</p>

              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Why it matches
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                  {rec.reasons.length > 0 ? (
                    rec.reasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                        {reason}
                      </li>
                    ))
                  ) : (
                    <li>Strong fit based on your overall profile.</li>
                  )}
                </ul>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Skills to build
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    You already bring
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.existing_strengths.length > 0 ? (
                      rec.existing_strengths.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        Fresh start — plenty to learn
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form
                action={selectCareer.bind(null, career.id, rec.id)}
                className="mt-6 flex-1 flex items-end"
              >
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Choose this career
                </button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}