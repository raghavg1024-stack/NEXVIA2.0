import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./_components/logout-button";
import { NexviaLogoMark } from "./_components/nexvia-logo";
import { MobileNav } from "./_components/mobile-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexvia — Academia–Industry Collaboration Portal",
    template: "%s | Nexvia",
  },
  description:
    "Nexvia connects students, academic institutions, and industry partners through skill mapping, internships, and placement readiness.",
  keywords: [
    "academia industry collaboration",
    "skill mapping",
    "internships",
    "placement readiness",
    "career planning",
    "AI mentor",
    "learning roadmap",
    "career assessment",
    "skills development",
  ],
  openGraph: {
    title: "Nexvia — Academia–Industry Collaboration Portal",
    description:
      "Map skills, close industry gaps, and connect learners to internships and placements.",
    type: "website",
    siteName: "Nexvia",
  },
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "My Roadmap" },
  { href: "/jobs", label: "Jobs" },
  { href: "/scholarships", label: "Internships & Scholarships" },
  { href: "/recruiter", label: "Industry" },
  { href: "/academia", label: "Academia" },
  { href: "/mentor", label: "AI Mentor" },
  { href: "/mock-interview", label: "Mock Interview" },
  { href: "/community", label: "Community" },
  { href: "/certificates", label: "Certificates" },
  { href: "/readiness", label: "Career Readiness" },
  { href: "/rewards", label: "Rewards" },
  { href: "/careers", label: "Careers" },
  { href: "/profile", label: "Profile" },
  { href: "/parent/access", label: "Parent Portal" },
];

async function getSessionUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {user && (
          <header className="sticky top-0 z-40 border-b border-violet-400/10 bg-[#070a12]/80 shadow-[0_10px_40px_rgba(0,0,0,.18)] backdrop-blur-xl">
            <nav className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <NexviaLogoMark href="/dashboard" />
              <div className="hidden items-center gap-1 xl:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-400 transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent hover:shadow-[0_8px_20px_rgba(139,124,255,.12)] 2xl:px-3 2xl:text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-emerald-300 lg:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" /> Quest mode
                </span>
                <LogoutButton />
                <MobileNav />
              </div>
            </nav>
          </header>
        )}
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-line bg-background">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex items-center gap-2.5">
              <NexviaLogoMark href={user ? "/dashboard" : "/"} />
            </div>
            <p className="text-center text-xs text-slate-500 sm:text-right">
              &copy; {new Date().getFullYear()} Nexvia. Discover Yourself. Learn
              Smarter. Build Your Future.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
