export default function DashboardLoading() {
  return (
    <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="animate-pulse">
        <div className="h-4 w-16 rounded bg-accent-soft" />
        <div className="mt-3 h-8 w-72 rounded bg-slate-800" />
        <div className="mt-2 h-4 w-80 rounded bg-slate-800" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-line bg-card p-6"
          >
            <div className="h-4 w-12 rounded bg-slate-800" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-800" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="h-6 w-32 rounded bg-slate-800" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-line bg-card p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-800" />
              <div className="mt-4 h-4 w-24 rounded bg-slate-800" />
              <div className="mt-2 h-3 w-36 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
