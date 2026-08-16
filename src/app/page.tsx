import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "./_components/motion";
import { NexviaLogo } from "./_components/nexvia-logo";
import { HeroScene } from "./_components/hero-scene";

const services = [
  {
    title: "Assessment",
    description:
      "A guided AI assessment that maps your strengths, interests, and learning style.",
    icon: "✦",
    href: "/signup",
  },
  {
    title: "Roadmap",
    description:
      "A personalized study plan with milestones tuned to how you actually learn.",
    icon: "◈",
    href: "/signup",
  },
  {
    title: "Mentor",
    description:
      "Your 24/7 AI career coach for resumes, interviews, projects, and next steps.",
    icon: "✧",
    href: "/signup",
  },
  {
    title: "Rewards",
    description:
      "XP, levels, coins, and badges that turn your career journey into a game.",
    icon: "★",
    href: "/signup",
  },
];

const steps = [
  {
    step: "Sign Up",
    desc: "Create your free account in seconds.",
  },
  {
    step: "Assessment",
    desc: "Answer 11 questions about yourself.",
  },
  {
    step: "Recommendations",
    desc: "Get matched to your ideal careers.",
  },
  {
    step: "Roadmap",
    desc: "Follow a personalized study plan.",
  },
  {
    step: "Rewards",
    desc: "Level up with XP, coins & badges.",
  },
];

const stats = [
  { value: "11", label: "Insight questions" },
  { value: "8+", label: "Career paths" },
  { value: "100%", label: "Personalized" },
  { value: "24/7", label: "AI mentor" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* 01 — Hero */}
      <section className="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-20 pb-20 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-slate-600">
                <NexviaLogo className="h-4 w-4" />
                AI-powered Career Operating System
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-8 max-w-5xl font-display text-4xl font-normal uppercase leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Discover yourself.{" "}
                <span className="text-accent">Learn smarter.</span>{" "}
                Build your future.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="prose prose-slate prose-lg mt-6 max-w-2xl leading-relaxed text-slate-500">
                Nexvia turns the overwhelming journey of career planning into a
                clear, step-by-step system guided by AI and driven by your goals.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="group relative overflow-hidden rounded-xl bg-slate-900 px-9 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-slate-800"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-line bg-card px-9 py-4 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:text-slate-900"
                >
                  Log In
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-card px-6 py-5">
                    <p className="font-display text-3xl text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.25} className="hidden lg:block">
            <HeroScene />
          </Reveal>
        </div>
      </section>

      {/* 02 — Services */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-sm text-accent">02.</span>
            <h2 className="font-display text-3xl uppercase tracking-tight text-slate-900 sm:text-4xl">
              Services
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <Link
                href={service.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-8 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent-soft opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-xl text-white shadow-lg shadow-accent/30">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-slate-500">
                  {service.description}
                </p>
                <span className="mt-6 text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 03 — How it works */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-sm text-accent">03.</span>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-slate-900 sm:text-4xl">
                From sign-up to a career you love
              </h2>
              <p className="mt-3 max-w-xl text-slate-500">
                Five simple steps, each one building on the last. No guesswork,
                no overwhelm — just a clear path forward.
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <StaggerItem key={step.step}>
              <div className="relative h-full rounded-2xl border border-line bg-card p-6">
                <span className="font-display text-3xl text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg uppercase tracking-tight text-slate-900">
                  {step.step}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 04 — CTA */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <h2 className="relative font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Ready to build your future?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-slate-300">
              Join Nexvia and let AI turn your goals into a plan you can
              actually follow.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-accent px-9 py-4 text-base font-semibold text-white shadow-xl shadow-accent/30 transition-all hover:scale-[1.03] hover:brightness-110"
              >
                Start your journey
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/5 px-9 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}