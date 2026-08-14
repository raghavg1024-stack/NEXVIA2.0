import Link from "next/link";
import { redirect } from "next/navigation";
import { getAssessment } from "@/lib/assessment";

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  const { assessment, analysisReport } = await getAssessment();

  if (!analysisReport || assessment?.status !== "completed") {
    redirect("/assessment");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
            Your Analysis
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            How you learn, what you&apos;re great at, and where to grow
          </h1>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Learning style
            </h2>
            <p className="mt-3 text-lg font-medium capitalize text-white">
              {analysisReport.learning_style}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              We&apos;ll shape your roadmap around this.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Study capacity
            </h2>
            <p className="mt-3 text-lg font-medium text-white">
              {analysisReport.study_capacity_hours} hours / week
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Realistic time you can commit each week.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Recommended pace
            </h2>
            <p className="mt-3 text-base text-white">{analysisReport.recommended_pace}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Your strengths
            </h2>
            <ul className="mt-3 space-y-2.5">
              {analysisReport.strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  {strength}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Growth areas
            </h2>
            <ul className="mt-3 space-y-2.5">
              {analysisReport.growth_areas.map((area) => (
                <li key={area} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  {area}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-200">
              {analysisReport.summary}
            </p>
          </section>
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/recommendations"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            See my career matches
          </Link>
        </div>
      </div>
    </main>
  );
}
