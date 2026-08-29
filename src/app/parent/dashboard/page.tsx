import ParentQuestionsPage from "@/app/parent/questions/page";
import ParentEncouragementForm from "@/app/parent/encouragement/page";

export default function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8 sm:p-12 text-slate-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-line bg-card p-6">
          <h2 className="font-display text-lg uppercase tracking-tight text-foreground mb-4">
            Parent Dashboard
          </h2>
          <p className="text-slate-400 mb-6">
            Overview of your childs career exploration progress and guidance.
          </p>
        </header>

        {/* Module 1: Career DNA Summary */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Top Recommended Path
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Career DNA Match</span>
              <span className="text-accent font-medium">87%</span>
            </div>
            <p className="text-slate-300 text-sm">
              Software Engineer - Design, build, and maintain software products
            </p>
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Strong alignment with programming and problem-solving skills
            </p>
          </div>
        </div>

        {/* Module 2: Strength/Interest Chart */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Strength & Interest Distribution
          </h3>
          <div className="h-64 w-full rounded-lg bg-gradient-to-br from-accent-soft to-violet-500/20 p-4">
            <p className="text-center text-slate-500 text-sm">
              Chart would display: Problem Solving, Programming, Writing, Public Speaking,
              Design, Data analysis, Teamwork, Research
            </p>
          </div>
        </div>

        {/* Module 3: Roadmap Timeline */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Roadmap Progress
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Original AI Roadmap</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-line rounded-w-full overflow-hidden">
              <div className="h-full bg-accent rounded-w-full w-full" style={{ width: "100%" }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Student-Edited Roadmap</span>
              <span>85%</span>
            </div>
            <div className="h-2 bg-line rounded-w-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-w-full w-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>

        {/* Module 4: Progress Snapshot */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Progress Overview
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Roadmap Complete</p>
              <p className="text-2xl font-medium text-accent">85%</p>
            </div>
            <div>
              <p className="text-slate-400">Badges Earned</p>
              <p className="text-2xl font-medium">12</p>
            </div>
            <div>
              <p className="text-slate-400">Current Streak</p>
              <p className="text-2xl font-medium">7 days</p>
            </div>
            <div>
              <p className="text-slate-400">XP Level</p>
              <p className="text-2xl font-medium">Level 5</p>
            </div>
          </div>
        </div>

        {/* Module 5: Peer Comparison Band */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Peer Comparison
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Science</span>
              <span>68%</span>
            </div>
            <p className="text-xs text-slate-500">
              68% of students with similar aptitude profiles chose top path
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Commerce</span>
              <span>54%</span>
            </div>
            <p className="text-xs text-slate-500">
              54% of students with similar interest profiles chose top path
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Arts</span>
              <span>41%</span>
            </div>
            <p className="text-xs text-slate-500">
              41% of students with similar creative profiles chose top path
            </p>
          </div>
        </div>

        {/* Module 6: Questions to Ask Your Child */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <ParentQuestionsPage />
        </div>

        {/* Module 7: Send Encouragement */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <ParentEncouragementForm />
        </div>
        <div className="rounded-2xl border border-line bg-card p-6">
          <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
            Full Report
          </h3>
          <p className="text-slate-400 mb-4">
            Unlock the complete printable report with all analysis and insights.
          </p>
          <button
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Unlock Full Report
          </button>
          <p className="mt-3 text-xs text-slate-500 text-center">
            Mock pricing modal - no real payment integration
          </p>
        </div>
      </div>
    </div>
  );
}