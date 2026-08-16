"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import type { Profile } from "@/lib/types";

const initialState = { error: null as string | null };

const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelClass = "block text-sm font-medium text-slate-600";

export default function ProfileEditForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form
      action={formAction}
      className="rounded-2xl bg-card p-6 ring-1 ring-line"
    >
      <h2 className="font-display text-lg uppercase tracking-tight text-slate-900">
        Edit profile
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className={labelClass}>
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile?.full_name ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={profile?.email ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="education_level" className={labelClass}>
            Education level
          </label>
          <select
            id="education_level"
            name="education_level"
            defaultValue={profile?.education_level ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="high_school">High school</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="self_taught">Self taught</option>
          </select>
        </div>
        <div>
          <label htmlFor="learning_style" className={labelClass}>
            Learning style
          </label>
          <select
            id="learning_style"
            name="learning_style"
            defaultValue={profile?.learning_style ?? ""}
            className={inputClass}
          >
            <option value="">Not set</option>
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="reading">Reading</option>
            <option value="kinesthetic">Kinesthetic</option>
          </select>
        </div>
        <div>
          <label htmlFor="study_hours_per_week" className={labelClass}>
            Study hours per week
          </label>
          <input
            id="study_hours_per_week"
            name="study_hours_per_week"
            type="number"
            min={0}
            max={168}
            defaultValue={profile?.study_hours_per_week ?? ""}
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="goals" className={labelClass}>
          Goals
        </label>
        <textarea
          id="goals"
          name="goals"
          rows={4}
          defaultValue={profile?.goals ?? ""}
          className={inputClass}
        />
      </div>
      {state?.error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}