export default function JobsLoading() {
  return (
    <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="animate-pulse">
        <div className="h-4 w-8 rounded bg-accent-soft" />
        <div className="mt-3 h-8 w-32 rounded bg-slate-800" />
        <div className="mt-2 h-4 w-80 rounded bg-slate-800" />
      </div>

      <div className="mt-8 grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-4 rounded-2xl border border-line bg-card p-5"
          >
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-800" />
            <div className="flex-1">
              <div className="h-5 w-48 rounded bg-slate-800" />
              <div className="mt-2 h-4 w-64 rounded bg-slate-800" />
              <div className="mt-3 h-3 w-full rounded bg-slate-800" />
              <div className="mt-2 h-3 w-3/4 rounded bg-slate-800" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-800" />
                <div className="h-6 w-16 rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
