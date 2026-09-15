import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NexviaLogoMark } from "./nexvia-logo";

const links = [
  ["/about", "About"],
  ["/reviews", "Reviews"],
  ["/#faq", "FAQ"],
  ["/contact", "Contact"],
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#070a12]/90 backdrop-blur-xl">
      <nav aria-label="Public navigation" className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <NexviaLogoMark href="/" />
        <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          {links.map(([href, label]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/waitlist" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/10 sm:inline-flex">Join waitlist</Link>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-violet-100">Start free <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </nav>
    </header>
  );
}
