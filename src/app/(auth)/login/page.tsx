"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "motion/react";
import { login, type AuthState } from "@/lib/auth-actions";

const initialState: AuthState = { error: null, success: null };

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-foreground placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-accent-soft blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[450px] w-[450px] rounded-full bg-accent-soft/60 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-xl ring-1 ring-line"
      >
        <h1 className="font-display text-2xl uppercase tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Log in to your Nexvia account.
        </p>
        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-400">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
              className={inputClass}
            />
          </div>
          {state?.error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{" "}
          <Link href="/signup" className="font-medium text-accent hover:text-foreground">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
