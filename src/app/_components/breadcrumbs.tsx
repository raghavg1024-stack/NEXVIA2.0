"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const hiddenRoutes = new Set(["/", "/login", "/signup"]);

export function Breadcrumbs() {
  const pathname = usePathname();
  if (hiddenRoutes.has(pathname)) return null;

  const segments = pathname.split("/").filter(Boolean);
  return (
    <nav aria-label="Breadcrumb" className="border-b border-white/[.06] bg-[#090d18]/75 px-5 py-3 text-xs text-slate-400 backdrop-blur-xl">
      <ol className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-white">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const label = decodeURIComponent(segment).replaceAll("-", " ");
          const current = index === segments.length - 1;
          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden="true" />
              {current ? (
                <span className="capitalize text-slate-200" aria-current="page">{label}</span>
              ) : (
                <Link href={href} className="capitalize transition hover:text-white">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
