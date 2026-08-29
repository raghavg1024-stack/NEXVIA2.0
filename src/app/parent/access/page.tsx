export default function ParentAccessPage() {
  return (
    <div className="min-h-screen bg-background p-8 sm:p-12 text-slate-300">
      <div className="mx-auto max-w-md space-y-8">
        <header className="rounded-2xl border border-line bg-card p-6">
          <h2 className="font-display text-lg uppercase tracking-tight text-foreground mb-4">
            Parent Portal Access
          </h2>
          <p className="text-slate-400 mb-6">
            Link to your childs career exploration session. Enter the code or select
            from recent sessions.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Child Session Code
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Enter session code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Or select recent session
              </label>
              <select className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent">
                <option value="">No recent sessions</option>
                <option value="">Session 1 - Math & Science</option>
                <option value="">Session 2 - Career Assessment</option>
              </select>
            </div>
            <button
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Link Session
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Or continue as guest <a href="/dashboard" className="text-accent underline">
              View demo data
            </a>
          </p>
        </header>
      </div>
    </div>
  );
}