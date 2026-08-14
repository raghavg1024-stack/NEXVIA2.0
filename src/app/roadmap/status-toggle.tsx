"use client";

import { useActionState } from "react";
import {
  updateCourseStatus,
  updateMilestoneStatus,
  type ActionState,
} from "@/lib/roadmap";
import type { Course, MilestoneStatus } from "@/lib/types";

const initialState: ActionState = { ok: true };

export function CourseToggle({ course }: { course: Course }) {
  const [state, action, pending] = useActionState(
    updateCourseStatus,
    initialState
  );

  if (course.status === "completed") {
    return (
      <span className="text-sm font-medium text-emerald-400">Completed</span>
    );
  }

  const next: Course["status"] =
    course.status === "pending" ? "in_progress" : "completed";

  return (
    <form action={action}>
      <input type="hidden" name="courseId" value={course.id} />
      <input type="hidden" name="status" value={next} />
      <button
        type="submit"
        disabled={pending}
        className={
          next === "in_progress"
            ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            : "rounded-lg border border-emerald-500/30 bg-emerald-600/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-600/20 disabled:opacity-50"
        }
      >
        {next === "in_progress" ? "Start" : "Mark complete"}
      </button>
      {state.ok === false && state.message ? (
        <p className="mt-1 text-xs text-red-400">{state.message}</p>
      ) : null}
    </form>
  );
}

export function MilestoneAction({
  milestoneId,
  status,
  canStart,
  canComplete,
}: {
  milestoneId: string;
  status: MilestoneStatus;
  canStart: boolean;
  canComplete: boolean;
}) {
  const [state, action, pending] = useActionState(
    updateMilestoneStatus,
    initialState
  );

  if (status === "completed") return null;

  let next: MilestoneStatus | null = null;
  if (status === "locked" && canStart) next = "in_progress";
  if (status === "in_progress" && canComplete) next = "completed";

  if (!next) {
    return (
      <p className="text-sm text-slate-400">
        {status === "locked"
          ? "Complete the previous milestone to unlock this one."
          : "Complete all courses to finish this milestone."}
      </p>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="milestoneId" value={milestoneId} />
      <input type="hidden" name="status" value={next} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-indigo-500/40 bg-indigo-600/10 px-3 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-600/20 disabled:opacity-50"
      >
        {next === "in_progress" ? "Start milestone" : "Mark milestone complete"}
      </button>
      {state.ok === false && state.message ? (
        <p className="mt-1 text-xs text-red-400">{state.message}</p>
      ) : null}
    </form>
  );
}