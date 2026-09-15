import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ArticXcoders and Nexvia",
  description: "Meet ArticXcoders and learn why Nexvia connects student skills, academic guidance, and industry opportunity in one career platform.",
  alternates: { canonical: "/about" },
};

const roles = ["Team leadership & research", "UI/UX design", "Frontend development", "Backend, database & auth", "AI recommendations", "Testing & deployment"];

export default function AboutPage() {
  return <main className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">About Nexvia</p><h1 className="mt-4 max-w-3xl font-display text-4xl uppercase text-white sm:text-6xl">A clearer route from learning to opportunity.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">Students often receive disconnected advice, generic courses, and unrelated job listings. Nexvia brings assessment, career selection, sequential roadmaps, readiness evidence, mentorship, interviews, and relevant opportunities into one accountable journey.</p><section className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center"><div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-4"><Image src="/team-photo.svg" width={1200} height={720} alt="Placeholder for the official ArticXcoders team photograph" className="h-auto w-full rounded-2xl" priority /><p className="mt-3 text-xs text-amber-200">Official team photograph placeholder — replace this asset before the final presentation.</p></div><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Built by ArticXcoders</p><h2 className="mt-3 text-3xl font-bold text-white">Six roles, one connected product</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{roles.map((role, index) => <div key={role} className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><span className="text-xs text-violet-300">0{index + 1}</span><p className="mt-2 font-semibold text-slate-100">{role}</p></div>)}</div></div></section><section className="mt-16 rounded-3xl border border-violet-300/20 bg-violet-400/[.07] p-8 text-center"><h2 className="text-3xl font-bold text-white">Help shape the pilot</h2><p className="mx-auto mt-3 max-w-2xl text-slate-400">We are inviting students, academic institutions, parents, and employers to validate the next version.</p><Link href="/waitlist" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-950">Join the waitlist</Link></section></main>;
}
