"use client";

import { useActionState } from "react";
import { createGroup, type CommunityFormState } from "@/lib/community";

const initialState: CommunityFormState = { ok: false, message: "" };

export function CreateGroupForm() {
  const [state, formAction, pending] = useActionState(createGroup, initialState);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold text-white">Create a study group</h2>
      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="group-name"
            className="block text-sm font-medium text-slate-300"
          >
            Group name
          </label>
          <input
            id="group-name"
            name="name"
            required
            maxLength={60}
            placeholder="e.g. Frontend Interview Prep"
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="group-description"
            className="block text-sm font-medium text-slate-300"
          >
            Description
          </label>
          <textarea
            id="group-description"
            name="description"
            maxLength={200}
            rows={3}
            placeholder="What is this group about?"
            className="mt-1 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create group"}
        </button>
        {state.message && (
          <p
            aria-live="polite"
            className={`text-sm ${state.ok ? "text-emerald-400" : "text-amber-400"}`}
          >
            {state.message}
          </p>
        )}
      </form>
    </section>
  );
}