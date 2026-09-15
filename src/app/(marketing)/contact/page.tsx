import type { Metadata } from "next";
import { ContactForm } from "../_components/public-form";

export const metadata: Metadata = { title: "Contact", description: "Contact the Nexvia team about student access, academic partnerships, industry opportunities, or product support.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Contact ArticXcoders</p><h1 className="mt-4 font-display text-4xl uppercase text-white sm:text-5xl">Let’s build better career outcomes.</h1><p className="mt-5 leading-7 text-slate-400">Tell us whether you are a student, parent, academic institution, or industry partner and what you want to achieve with Nexvia.</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/[.03] p-5 text-sm leading-6 text-slate-400">We only use the details you submit to respond to your enquiry. Never include passwords, API keys, or sensitive academic records.</div></div><section className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8"><h2 className="text-2xl font-bold text-white">Send a message</h2><div className="mt-6"><ContactForm /></div></section></main>;
}
