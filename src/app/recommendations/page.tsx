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
    <main className="min-h-screen bg-background px-6 py-12 text-slate-700">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-display text-sm uppercase tracking-widest text-accent">
            01. Career matches
          </p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-slate-900">
            Your top career paths
          </h1>
          <p className="mt-3 text-slate-500">
            Based on your assessment, these careers fit your skills, interests, and goals.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {matches.map(({ rec, career }) => (
            <article
              key={rec.id}
              className="flex flex-col rounded-2xl border border-line bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl">{career.icon}</p>
                  <h2 className="mt-2 font-display text-xl uppercase tracking-tight text-slate-900">{career.title}</h2>
                  <p className="text-sm text-slate-500">{career.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-accent">{rec.match_percentage}%</p>
                  <p className="text-xs text-slate-400">match</p>
                </div>
              </div>

              <p className="prose prose-slate prose-sm mt-4 max-w-none text-slate-700">
                {career.description}
              </p>

              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Why it matches
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {rec.reasons.length > 0 ? (
                    rec.reasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
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
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Skills to build
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    You already bring
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.existing_strengths.length > 0 ? (
                      rec.existing_strengths.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs text-accent"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs text-slate-400">
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
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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