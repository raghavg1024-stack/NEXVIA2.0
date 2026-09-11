"use client";

import { useActionState } from "react";
import {
  updateCourseStatus,
  type ActionState,
} from "@/lib/roadmap";
import type { Course, MilestoneStatus } from "@/lib/types";

const initialState: ActionState = { ok: true };

export function CourseToggle({
  course,
  milestoneAvailable,
}: {
  course: Course;
  milestoneAvailable: boolean;
}) {
  const [state, action, pending] = useActionState(
    updateCourseStatus,
    initialState
  );

  if (course.status === "completed") {
    return (
      <span className="text-sm font-medium text-emerald-600">Completed</span>
    );
  }

  if (!milestoneAvailable) {
    return <span className="text-xs font-medium text-slate-500">Locked</span>;
  }

  return (
    <form action={action}>
      <input type="hidden" name="courseId" value={course.id} />
      <input type="hidden" name="status" value="completed" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Mark complete"}
      </button>
      {state.ok === false && state.message ? (
        <p className="mt-1 text-xs text-red-600">{state.message}</p>
      ) : null}
    </form>
  );
}

export function MilestoneAction({
  status,
  canComplete,
}: {
  status: MilestoneStatus;
  canComplete: boolean;
}) {
  if (status === "completed") return null;
  const message = status === "locked"
    ? "Complete the previous milestone to unlock this step."
    : canComplete
      ? "Finishing this step and unlocking the next milestone…"
      : "Complete every activity above. The next milestone unlocks automatically.";
  return <p className="text-sm text-slate-400">{message}</p>;
}
