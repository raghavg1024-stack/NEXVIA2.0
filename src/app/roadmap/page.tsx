import Link from "next/link";
import { getRoadmap, ensureMilestones } from "@/lib/roadmap";
import type { Milestone, MilestoneStatus } from "@/lib/types";
import { CourseToggle, MilestoneAction } from "./status-toggle";

export const dynamic = "force-dynamic";

function statusBadge(status: MilestoneStatus) {
  switch (status) {
    case "locked":
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-slate-500">
          <span aria-hidden>🔒</span> Locked
        </span>
      );
    case "in_progress":
      return (
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
          In progress
        </span>
      );
    case "completed":
      return (
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <span aria-hidden>✓</span> Completed
        </span>
      );
  }
}

function statusDot(status: MilestoneStatus) {
  switch (status) {
    case "locked":
      return "border-slate-700 bg-slate-900 text-slate-500";
    case "in_progress":
      return "border-indigo-500 bg-indigo-600 text-white";
    case "completed":
      return "border-emerald-500 bg-emerald-500/20 text-emerald-400";
  }
}

function milestoneIcon(status: MilestoneStatus) {
  if (status === "completed") return <span aria-hidden>✓</span>;
  if (status === "in_progress") return <span aria-hidden>●</span>;
  return <span aria-hidden>🔒</span>;
}

function MilestoneCard({
  milestone,
  index,
  total,
  canStart,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  canStart: boolean;
}) {
  const completedCourses = milestone.courses.filter(
    (c) => c.status === "completed"
  ).length;
  const totalCourses = milestone.courses.length;
  const progress =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
  const canComplete = totalCourses > 0 && completedCourses === totalCourses;

  return (
    <li className="relative flex gap-4">
      {index < total - 1 && (
        <div className="absolute left-[19px] top-12 bottom-[-16px] w-px bg-slate-800" />
      )}
      <div
        className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${statusDot(
          milestone.status
        )}`}
      >
        {milestoneIcon(milestone.status)}
      </div>
      <div
        className={`flex-1 rounded-xl border bg-slate-900/60 p-5 ${
          milestone.status === "locked"
            ? "border-slate-800/80 opacity-60"
            : milestone.status === "in_progress"
              ? "border-indigo-600/60 shadow-lg shadow-indigo-950/40"
              : "border-emerald-600/40"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                Step {index + 1}
              </span>
              <h2
                className={`text-lg font-semibold ${
                  milestone.status === "locked"
                    ? "text-slate-500"
                    : "text-slate-100"
                }`}
              >
                {milestone.title}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {milestone.description}
            </p>
          </div>
          {statusBadge(milestone.status)}
        </div>

        {milestone.status === "in_progress" && totalCourses > 0 && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {completedCourses} of {totalCourses} courses complete
              </span>
              <span className="font-semibold text-indigo-400">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <ul className="mt-4 space-y-2">
          {milestone.courses.map((course) => (
            <li
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-200">{course.title}</p>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    {course.duration_weeks}{" "}
                    {course.duration_weeks === 1 ? "week" : "weeks"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate-400">
                  {course.description}
                </p>
              </div>
              <div className="shrink-0">
                <CourseToggle course={course} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-slate-800 pt-4">
          <MilestoneAction
            milestoneId={milestone.id}
            status={milestone.status}
            canStart={canStart}
            canComplete={canComplete}
          />
        </div>
      </div>
    </li>
  );
}

export default async function RoadmapPage() {
  let roadmap = await getRoadmap();
  if (roadmap) roadmap = (await ensureMilestones(roadmap.id)) ?? roadmap;

  if (!roadmap) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-100">
          Your roadmap is waiting
        </h1>
        <p className="mt-2 max-w-md text-slate-400">
          Complete the career assessment to generate your personalized learning
          roadmap.
        </p>
        <Link
          href="/assessment"
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Take the assessment
        </Link>
      </main>
    );
  }

  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter(
    (m) => m.status === "completed"
  ).length;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-100">
            {roadmap.career_title}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              roadmap.status === "completed"
                ? "bg-emerald-500/10 text-emerald-400"
                : roadmap.status === "active"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "bg-slate-800 text-slate-400"
            }`}
          >
            {roadmap.status === "completed" ? "Roadmap complete" : "Active"}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {completed} of {total} milestones complete
        </p>
      </header>

      <ol className="space-y-6">
        {roadmap.milestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
            total={total}
            canStart={
              index === 0 ||
              roadmap.milestones[index - 1].status === "completed"
            }
          />
        ))}
      </ol>
    </main>
  );
}
