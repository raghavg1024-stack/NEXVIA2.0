"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "@/lib/auth-actions";
import { PORTALS, type PortalKey } from "@/lib/portal-auth";

const initialState: AuthState = { error: null, success: null };
const inputClass = "mt-1 w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export function SignupForm({ portalKey }: { portalKey: PortalKey }) {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const portal = PORTALS[portalKey];

  if (state?.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-3xl border border-line bg-card p-8 text-center">
          <h1 className="font-display text-2xl uppercase text-white">Check your email</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{state.success}</p>
          <Link href={`/login/${portalKey}`} className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white">Go to {portal.label} Login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className={`pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-gradient-to-br ${portal.accent} opacity-15 blur-3xl`} />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-card p-7 shadow-2xl sm:p-9">
        <Link href="/signup" className="text-xs font-semibold text-slate-500 transition hover:text-white">← Change account type</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">{portal.eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-white">Create {portal.label} Account</h1>
        <form action={formAction} className="mt-8 space-y-4">
          <input type="hidden" name="portal" value={portalKey} />
          <div><label htmlFor="full_name" className="text-sm font-medium text-slate-300">Full name</label><input id="full_name" name="full_name" required autoComplete="name" className={inputClass} /></div>
          <div><label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label><input id="email" name="email" type="email" required autoComplete="email" className={inputClass} /></div>
          <div><label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label><input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} /></div>
          {state?.error ? <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{state.error}</p> : null}
          <button type="submit" disabled={pending} className={`w-full rounded-xl bg-gradient-to-r ${portal.accent} px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60`}>
            {pending ? "Creating account..." : `Create ${portal.label} Account`}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link href={`/login/${portalKey}`} className="font-semibold text-cyan-300 hover:text-white">Sign in</Link></p>
      </section>
    </main>
  );
}
