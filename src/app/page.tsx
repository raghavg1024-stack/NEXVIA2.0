import Link from "next/link";

const pillars = [
  {
    title: "Discover Yourself",
    description:
      "Uncover your strengths, interests, and learning style with a guided AI assessment.",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    title: "Learn Smarter",
    description:
      "Get a personalized roadmap and a study plan tuned to how you actually learn.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Build Your Future",
    description:
      "Track your growth with XP, levels, and badges on the path to your dream career.",
    accent: "from-sky-500 to-cyan-500",
  },
];

const steps = [
  "Sign Up",
  "Assessment",
  "Recommendations",
  "Roadmap",
  "Rewards",
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
        aria-hidden="true"
      />
      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          AI-powered Career Operating System
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Discover Yourself. Learn Smarter. Build Your Future.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Career OS turns the overwhelming journey of career planning into a
          clear, step-by-step system guided by AI and driven by your goals.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-8 py-3.5 text-base font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
          >
            Log In
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 transition-colors hover:border-slate-700"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.accent} text-lg font-bold text-white`}
              >
                {index + 1}
              </div>
              <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-400">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
          Five simple steps from sign-up to a career you are excited about.
        </p>
        <ol className="mt-12 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex w-full max-w-[200px] flex-col items-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-500 bg-slate-900 text-lg font-bold text-indigo-300">
                {index + 1}
              </span>
              <span className="mt-4 text-sm font-semibold text-white">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}