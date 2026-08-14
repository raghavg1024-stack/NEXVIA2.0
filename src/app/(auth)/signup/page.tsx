"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "../actions";

const initialState: AuthState = { error: null, success: null };

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {state?.success ? (
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 text-center ring-1 ring-slate-800">
          <h1 className="text-xl font-semibold text-slate-50">Check your email</h1>
          <p className="mt-2 text-sm text-slate-400">{state.success}</p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Go to login
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800">
          <h1 className="text-2xl font-semibold text-slate-50">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Start your Career OS journey.
          </p>
          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ada Lovelace"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
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
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>
            {state?.error && (
              <div className="rounded-lg border border-rose-800/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
                {state.error}
              </div>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Log in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
