export default function RoadmapLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="animate-pulse">
        <div className="h-7 w-48 rounded bg-slate-800" />
        <div className="mt-2 h-4 w-32 rounded bg-slate-800" />
      </div>

      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full border-2 border-line bg-card" />
            <div className="flex-1 rounded-2xl border border-line bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 rounded bg-slate-800" />
                  <div className="mt-2 h-5 w-40 rounded bg-slate-800" />
                </div>
                <div className="h-6 w-20 rounded-full bg-slate-800" />
              </div>
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-14 rounded-xl border border-line bg-slate-800"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
