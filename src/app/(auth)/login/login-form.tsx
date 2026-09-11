"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "@/lib/auth-actions";
import { PORTALS, type PortalKey } from "@/lib/portal-auth";

const initialState: AuthState = { error: null, success: null };
const inputClass = "mt-1 w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export function LoginForm({ portalKey }: { portalKey: PortalKey }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const portal = PORTALS[portalKey];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className={`pointer-events-none absolute h-[520px] w-[520px] rounded-full bg-gradient-to-br ${portal.accent} opacity-15 blur-3xl`} />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-card p-7 shadow-2xl sm:p-9">
        <Link href="/login" className="text-xs font-semibold text-slate-500 transition hover:text-white">← Change portal</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">{portal.eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-white">{portal.label} Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{portal.description}</p>
        <form action={formAction} className="mt-8 space-y-4">
          <input type="hidden" name="portal" value={portalKey} />
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Your password" className={inputClass} />
          </div>
          {state?.error ? <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{state.error}</p> : null}
          <button type="submit" disabled={pending} className={`w-full rounded-xl bg-gradient-to-r ${portal.accent} px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60`}>
            {pending ? "Signing in..." : `Sign in to ${portal.label} Portal`}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account? <Link href={`/signup/${portalKey}`} className="font-semibold text-cyan-300 hover:text-white">Create one</Link>
        </p>
      </section>
    </main>
  );
}
