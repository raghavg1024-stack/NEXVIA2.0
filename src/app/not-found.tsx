import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <span className="font-display text-6xl text-accent">404</span>
      <h1 className="mt-6 font-display text-2xl uppercase tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
      >
        Go home
      </Link>
    </div>
  );
}
