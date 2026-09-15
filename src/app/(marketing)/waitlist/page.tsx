import type { Metadata } from "next";
import { WaitlistForm } from "../_components/public-form";

export const metadata: Metadata = { title: "Join the Waitlist", description: "Join the Nexvia pilot waitlist for personalized career roadmaps, readiness tools, mentorship, and career-relevant opportunities.", alternates: { canonical: "/waitlist" } };

export default function WaitlistPage() {
  return <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Nexvia pilot</p><h1 className="mt-4 font-display text-4xl uppercase text-white sm:text-6xl">Be first to test the complete career loop.</h1><p className="mt-6 text-lg leading-8 text-slate-400">Join students, parents, institutions, and recruiters helping us validate accurate roadmaps, readiness signals, and skill-first opportunity matching.</p><ul className="mt-8 space-y-3 text-sm text-slate-300"><li>✓ Early pilot access</li><li>✓ Product updates and testing invitations</li><li>✓ A direct channel for feedback</li></ul></div><section className="rounded-3xl border border-violet-300/20 bg-white/[.04] p-6 sm:p-8"><h2 className="text-2xl font-bold text-white">Reserve your place</h2><p className="mt-2 text-sm text-slate-400">No payment required. You can opt out at any time.</p><div className="mt-6"><WaitlistForm /></div></section></main>;
}
