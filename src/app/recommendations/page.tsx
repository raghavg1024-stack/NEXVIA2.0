import { redirect } from "next/navigation";
import { CAREERS } from "@/lib/data";
import type { Career, CareerRecommendation } from "@/lib/types";
import { getAssessment, selectCareer } from "@/lib/assessment";
import { Reveal, Stagger, StaggerItem } from "../_components/motion";

export const dynamic = "force-dynamic";

function MatchRing({ percentage }: { percentage: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-lg text-foreground">{percentage}%</p>
      </div>
    </div>
  );
}

export default async function RecommendationsPage() {
  const { analysisReport, recommendations } = await getAssessment();

  if (!analysisReport || recommendations.length === 0) {
    redirect("/assessment");
  }

  const matches = recommendations
    .map((rec) => ({ rec, career: CAREERS.find((c) => c.id === rec.career_id) }))
    .filter((m): m is { rec: CareerRecommendation; career: Career } => Boolean(m.career));

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-slate-300">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <header>
            <p className="font-display text-sm uppercase tracking-widest text-accent">
              Career matches
            </p>
            <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-foreground">
              Your top career paths
            </h1>
            <p className="mt-3 text-slate-400">
              Based on your assessment, these careers fit your skills, interests, and goals.
            </p>
          </header>
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
          {matches.map(({ rec, career }) => (
            <StaggerItem key={rec.id}>
              <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-slate-200">
                {/* Top accent bar */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-violet-500 to-accent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line bg-slate-800 text-2xl">
                        {career.icon}
                      </div>
                      <div>
                        <h2 className="font-display text-xl uppercase tracking-tight text-foreground">
                          {career.title}
                        </h2>
                        <p className="text-sm text-slate-400">{career.category}</p>
                      </div>
                    </div>
                    <MatchRing percentage={rec.match_percentage} />
                  </div>

                  <p className="prose prose-invert prose-sm mt-4 max-w-none text-slate-400">
                    {career.description}
                  </p>

                  {/* Why it matches */}
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Why it matches
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
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

                  {/* Skills */}
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Skills to build
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rec.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-line bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
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
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rec.existing_strengths.length > 0 ? (
                          rec.existing_strengths.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full border border-line bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                            Fresh start — plenty to learn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Salary + demand */}
                  <div className="mt-5 flex items-center gap-4 text-sm">
                    <span className="text-slate-400">
                      💰 {career.salary_range}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        career.demand === "very_high"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : career.demand === "high"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {career.demand.replace("_", " ")} demand
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t border-line p-4">
                  <form action={selectCareer.bind(null, career.id, rec.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:brightness-110"
                    >
                      Choose this career →
                    </button>
                  </form>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </main>
  );
}
