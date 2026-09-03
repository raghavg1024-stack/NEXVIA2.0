import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  Check,
  Compass,
  Gamepad2,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { HeroScene } from "./_components/hero-scene";
import {
  Reveal,
  ScrollProgress,
  Stagger,
  StaggerItem,
  TiltCard,
} from "./_components/motion";

const pillars = [
  {
    icon: Compass,
    eyebrow: "01 / MAP",
    title: "Map the skill gap",
    description:
      "Compare a student’s current skills with the competencies that target industries and roles actually require.",
    color: "text-cyan-300",
  },
  {
    icon: Brain,
    eyebrow: "02 / CONNECT",
    title: "Connect academia and industry",
    description:
      "Give institutions, students, and employers one shared place to define skills, opportunities, and outcomes.",
    color: "text-violet-300",
  },
  {
    icon: Trophy,
    eyebrow: "03 / PLACE",
    title: "Convert readiness into opportunity",
    description:
      "Turn verified learning, projects, internships, and interview practice into placement-ready proof.",
    color: "text-pink-300",
  },
];

const journey = [
  "Map skills and goals",
  "Identify industry gaps",
  "Follow a role-based roadmap",
  "Build proof through projects",
  "Match with internships and placements",
];

const missionStats = [
  { label: "Industry skill map", value: "Live", icon: Target, tone: "text-cyan-300" },
  { label: "Opportunity paths", value: "03", icon: Sparkles, tone: "text-violet-300" },
  { label: "Collaboration loop", value: "360°", icon: Zap, tone: "text-amber-300" },
];

export default function Home() {
  return (
    <div className="cinematic-shell relative min-h-screen overflow-hidden bg-[#070a12] text-slate-200">
      <ScrollProgress />
      <div className="neo-grid pointer-events-none absolute inset-x-0 top-0 h-[920px]" aria-hidden="true" />
      <div className="cinematic-orb cinematic-orb-one" aria-hidden="true" />
      <div className="cinematic-orb cinematic-orb-two" aria-hidden="true" />
      <div className="cinematic-orb cinematic-orb-three" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />

      <header className="landing-nav sticky top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Reveal direction="left">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-cube flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-400 text-lg font-black text-white shadow-[0_0_28px_rgba(139,124,255,.45)]">N</span>
            <span className="text-lg font-bold tracking-tight text-white">Nexvia<span className="text-violet-300">.</span></span>
          </Link>
        </Reveal>
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#experience" className="nav-underline transition hover:text-white">Experience</a>
          <a href="#journey" className="nav-underline transition hover:text-white">How it works</a>
          <a href="#features" className="nav-underline transition hover:text-white">Features</a>
        </nav>
        <Reveal direction="right">
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline-flex">Log in</Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-violet-100">Start free <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Reveal>
      </header>

      <main className="relative z-10">
        <section className="hero-stage mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-7xl items-center px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-4">
            <div className="max-w-2xl">
              <Reveal delay={0.05}>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-md"><Building2 className="h-3.5 w-3.5 text-cyan-300" /> Academia × Industry collaboration</div>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="glow-text max-w-2xl font-display text-5xl uppercase leading-[0.98] tracking-tight text-white sm:text-7xl">Close the<br /><span className="animated-gradient-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">skill-to-industry gap.</span></h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">Nexvia is a unified portal for students, academic institutions, and industry partners—mapping skills, building readiness, and matching talent with internships and placements.</p>
              </Reveal>
              <Reveal delay={0.28}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="hero-cta group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,80,220,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(99,80,220,.5)]">Start skill mapping <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
                  <Link href="#experience" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-md transition hover:border-violet-300/40 hover:bg-white/[0.08] hover:text-white"><Gamepad2 className="h-4 w-4 text-cyan-300" /> See how it works</Link>
                </div>
              </Reveal>
              <Reveal delay={0.34}>
                <div className="mt-10 flex flex-wrap items-center gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Students, faculty, and employers</span><span>Skill-first matching</span><span>Outcome-led learning</span></div>
              </Reveal>
            </div>

            <Reveal direction="scale" delay={0.16}>
              <div className="hero-perspective relative flex min-h-[430px] items-center justify-center lg:min-h-[560px]">
                <div className="hero-halo absolute h-72 w-72 rounded-full sm:h-96 sm:w-96" />
                <HeroScene />
                <TiltCard className="glass-panel mission-card absolute bottom-3 left-2 z-20 w-56 rounded-2xl p-4 sm:left-8">
                  <div className="depth-content"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Current quest</span><Zap className="h-4 w-4 text-yellow-300" /></div><p className="mt-2 text-sm font-bold text-white">Ship your first project</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="xp-bar h-full w-[72%] rounded-full" /></div><p className="mt-2 text-[11px] text-slate-500"><span className="text-cyan-300">+120 XP</span> · 3 days left</p></div>
                </TiltCard>
                <TiltCard className="glass-panel absolute right-1 top-10 z-20 hidden w-44 rounded-2xl p-4 sm:block">
                  <div className="depth-content"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-amber-200"><Medal className="h-4 w-4" /> Rising star</div><p className="mt-3 text-2xl font-black tracking-tight text-white">Level 07</p><p className="mt-1 text-[11px] text-slate-400">Top 12% of learners</p></div>
                </TiltCard>
              </div>
            </Reveal>
          </div>
          <div className="scroll-cue pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block" aria-hidden="true"><span /></div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-6 sm:px-8 lg:px-12">
          <Stagger className="mission-strip grid gap-3 rounded-3xl p-3 sm:grid-cols-3">
            {missionStats.map(({ label, value, icon: Icon, tone }) => (
              <StaggerItem key={label}>
                <TiltCard className="h-full rounded-2xl border border-white/[.07] bg-black/15">
                  <div className="depth-content flex h-full items-center gap-4 px-4 py-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] ${tone}`}><Icon className="h-5 w-5" /></span><div><p className="text-lg font-black tracking-tight text-white">{value}</p><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">{label}</p></div></div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="experience" className="section-depth mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12">
          <Reveal><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">The Nexvia collaboration loop</p><h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">Learning that leads to <span className="text-cyan-300">opportunity</span></h2></div><span className="hidden text-right text-xs text-slate-500 sm:block">Map → Build → Match</span></div></Reveal>
          <Stagger className="grid gap-4 md:grid-cols-3">
            {pillars.map(({ icon: Icon, eyebrow, title, description, color }, index) => (
              <StaggerItem key={title}>
                <TiltCard className="h-full"><article className="glass-panel lift-card depth-card relative h-full overflow-hidden rounded-3xl p-6"><span className="absolute right-5 top-5 font-display text-4xl text-white/[.05]">0{index + 1}</span><Icon className={`depth-content h-7 w-7 ${color}`} /><p className="mt-8 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">{eyebrow}</p><h3 className="mt-2 font-display text-xl uppercase tracking-tight text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{description}</p></article></TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="journey" className="section-depth mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12">
          <Reveal direction="scale">
            <div className="glass-panel journey-board overflow-hidden rounded-3xl p-6 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
                <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">From classroom to career</p><h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-white">One connected system.<br /><span className="text-violet-300">Measurable outcomes.</span></h2><p className="mt-4 text-sm leading-6 text-slate-400">Students see the skills their target roles require. Faculty can spot common gaps. Industry partners can find learners who are ready to contribute.</p><Link href="/signup" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-cyan-200">Start the collaboration loop <ArrowRight className="h-4 w-4" /></Link></div>
                <Stagger className="relative space-y-3 lg:pl-8">
                  <span aria-hidden="true" className="absolute bottom-6 left-[1.05rem] top-6 hidden w-px bg-gradient-to-b from-cyan-300/60 via-violet-400/50 to-transparent lg:block" />
                  {journey.map((step, index) => (
                    <StaggerItem key={step}>
                      <TiltCard className="journey-node relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"><div className="depth-content flex items-center gap-4"><span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/15 text-xs font-bold text-violet-100">{index + 1}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold leading-5 text-slate-100">{step}</p>{index === 0 ? <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300"><Check className="h-3 w-3" /> Ready</span> : <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Step {index + 1} of {journey.length}</span>}</div></div></TiltCard>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="features" className="section-depth mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-24 pt-20 text-center sm:px-8 lg:px-12">
          <Reveal direction="scale"><div className="cta-stage relative overflow-hidden rounded-[2rem] border border-violet-300/20 px-5 py-16 sm:px-10"><div className="relative z-10"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200"><Users className="h-6 w-6" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-slate-400">Built for the whole ecosystem</p><h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl uppercase tracking-tight text-white sm:text-5xl">Make every learner industry-ready.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300">Connect academic learning to the skill signals, internships, and placements that create real outcomes.</p><Link href="/signup" className="hero-cta mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">Create your free account <ArrowRight className="h-4 w-4" /></Link></div></div></Reveal>
        </section>
      </main>
    </div>
  );
}
